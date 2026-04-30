import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { db, functions } from '../config/firebase';
import { 
  collection, onSnapshot, doc,
  query, limit, orderBy, startAfter, getDocs, where, getDoc
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { logger } from '../utils/logger';

export const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  // ─── Home Page State ───
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const initialLoadDone = useRef(false);

  // ─── On Demand State ───
  const [searchCatalog, setSearchCatalog] = useState(null);
  const [adminCatalog, setAdminCatalog] = useState(null);
  const adminUnsub = useRef(null);
  
  // ─── Consolidated Products Cache ───
  const products = useMemo(() => {
    const map = new Map();
    // Prioritize newest/more detailed data if there are duplicates
    const all = [...featuredProducts, ...(searchCatalog || []), ...(adminCatalog || [])];
    all.forEach(p => {
      if (p && p.id) map.set(p.id, p);
    });
    return Array.from(map.values());
  }, [featuredProducts, searchCatalog, adminCatalog]);

  // ─── Real-time listener for Featured products ───
  useEffect(() => {
    const featuredQuery = query(
      collection(db, 'products'),
      where('featured', '==', true)
    );

    const fallbackTimer = setTimeout(() => {
      if (!initialLoadDone.current) {
        console.warn("Firebase connection timed out (15s). Showing empty state.");
        setFeaturedProducts([]);
        setIsProductsLoading(false);
      }
    }, 15000);

    const unsubFeatured = onSnapshot(featuredQuery, (snapshot) => {
      const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setFeaturedProducts(loaded.filter(p => p.visible !== false));
      initialLoadDone.current = true;
      setIsProductsLoading(false);
      clearTimeout(fallbackTimer);
    }, (err) => {
      logger.error("Products listener error:", err);
      setProductsError("Failed to load products. Please refresh.");
      setIsProductsLoading(false);
    });

    return () => {
      unsubFeatured();
      clearTimeout(fallbackTimer);
    };
  }, []);

  // ─── Fetch Search Catalog (On Demand) ───
  const fetchSearchCatalog = useCallback(async () => {
    if (searchCatalog !== null) return;
    try {
      const q = query(collection(db, 'products'), orderBy('title'));
      const snapshot = await getDocs(q);
      const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSearchCatalog(loaded.filter(p => p.visible !== false));
    } catch (err) {
      logger.error("Search Catalog Fetch Error:", err);
    }
  }, [searchCatalog]);

  // ─── Fetch Admin Catalog (Real-time listener on mount) ───
  const fetchAdminCatalog = useCallback(() => {
    if (adminUnsub.current) return; // already listening
    const q = query(collection(db, 'products'));
    adminUnsub.current = onSnapshot(q, (snapshot) => {
      let loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Sort client-side newest to oldest
      loaded.sort((a, b) => {
        const tA = a.date?.toMillis ? a.date.toMillis() : (a.id > b.id ? 1 : -1);
        const tB = b.date?.toMillis ? b.date.toMillis() : 0;
        if (a.date && b.date) return tB - tA;
        return a.id < b.id ? 1 : -1;
      });
      
      setAdminCatalog(loaded);
    }, (err) => {
      logger.error("Admin Catalog listener error:", err);
    });
  }, []);

  const clearAdminCatalog = useCallback(() => {
    if (adminUnsub.current) {
      adminUnsub.current();
      adminUnsub.current = null;
    }
    setAdminCatalog(null);
  }, []);

  // ─── Category-Specific Fetch (used by CategoryPage locally) ───
  const fetchCategoryProducts = useCallback(async (category, pageSize = 12) => {
    try {
      let q;
      if (category === 'All') {
        q = query(collection(db, 'products'), limit(pageSize));
      } else {
        q = query(collection(db, 'products'), where('category', '==', category), limit(pageSize));
      }
      
      const snapshot = await getDocs(q);
      let loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(p => p.visible !== false);
      
      // Sort client-side newest to oldest
      loaded.sort((a, b) => {
        const tA = a.date?.toMillis ? a.date.toMillis() : (a.id > b.id ? 1 : -1);
        const tB = b.date?.toMillis ? b.date.toMillis() : 0;
        if (a.date && b.date) return tB - tA;
        return a.id < b.id ? 1 : -1; // Fallback to descending ID for older items
      });
      
      // If fetching All, but some are featured, this query might fetch them too. 
      // We will let the consumer filter them if needed.

      const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
      const canLoadMore = snapshot.docs.length === pageSize;
      
      return { products: loaded, lastDoc: lastVisible, hasMore: canLoadMore };
    } catch (err) {
      logger.error("Category Fetch Error:", err);
      return { products: [], lastDoc: null, hasMore: false };
    }
  }, []);

  // ─── Category-Specific Load More (used by CategoryPage locally) ───
  const fetchMoreCategoryProducts = useCallback(async (category, afterDoc, pageSize = 12) => {
    if (!afterDoc) return { products: [], lastDoc: null, hasMore: false };

    try {
      let q;
      if (category === 'All') {
        q = query(collection(db, 'products'), startAfter(afterDoc), limit(pageSize));
      } else {
        q = query(collection(db, 'products'), where('category', '==', category), startAfter(afterDoc), limit(pageSize));
      }
      
      const snapshot = await getDocs(q);
      if (snapshot.empty) return { products: [], lastDoc: afterDoc, hasMore: false };

      let loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(p => p.visible !== false);
      
      loaded.sort((a, b) => {
        const tA = a.date?.toMillis ? a.date.toMillis() : 0;
        const tB = b.date?.toMillis ? b.date.toMillis() : 0;
        if (a.date && b.date) return tB - tA;
        return a.id < b.id ? 1 : -1; 
      });
      const lastVisible = snapshot.docs[snapshot.docs.length - 1];
      const canLoadMore = snapshot.docs.length === pageSize;
      
      return { products: loaded, lastDoc: lastVisible, hasMore: canLoadMore };
    } catch (err) {
      logger.error("Category Load More Error:", err);
      return { products: [], lastDoc: afterDoc, hasMore: false };
    }
  }, []);

  // ─── CRUD Operations (Secure Server-Side) ───
  const addProduct = useCallback(async (product) => {
    try {
      // Fallback for randomUUID if not in a secure context (e.g. testing via IP address on mobile)
      const newId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
        ? crypto.randomUUID() 
        : `prod_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        
      const manageProduct = httpsCallable(functions, 'manageProduct');
      await manageProduct({ action: 'create', id: newId, productData: { ...product, id: newId } });
    } catch (e) {
      logger.error("Error securely adding document: ", e);
      throw e;
    }
  }, []);

  const updateProduct = useCallback(async (id, updatedFields) => {
    try {
      const manageProduct = httpsCallable(functions, 'manageProduct');
      await manageProduct({ action: 'update', id, productData: updatedFields });
    } catch (e) {
      logger.error("Error securely updating document: ", e);
      throw e;
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    try {
      const manageProduct = httpsCallable(functions, 'manageProduct');
      await manageProduct({ action: 'delete', id });
    } catch (e) {
      logger.error("Error securely deleting document: ", e);
      throw e;
    }
  }, []);

  const fetchProductById = useCallback(async (id) => {
    // Check local consolidated cache first
    const cached = products.find(p => p.id === id);
    if (cached) return cached;

    try {
      const docRef = doc(db, 'products', id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
      }
      return null;
    } catch (err) {
      logger.error("Fetch Product By ID Error:", err);
      return null;
    }
  }, [products]);

  const value = useMemo(() => ({
    products, featuredProducts, isProductsLoading, productsError,
    fetchSearchCatalog, searchCatalog,
    fetchAdminCatalog, clearAdminCatalog, adminCatalog,
    fetchCategoryProducts, fetchMoreCategoryProducts,
    fetchProductById, addProduct, updateProduct, deleteProduct
  }), [
    products, featuredProducts, isProductsLoading, productsError, 
    searchCatalog, fetchSearchCatalog,
    adminCatalog, fetchAdminCatalog, clearAdminCatalog,
    fetchCategoryProducts, fetchMoreCategoryProducts,
    fetchProductById, addProduct, updateProduct, deleteProduct
  ]);

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
