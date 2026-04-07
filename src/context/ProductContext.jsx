import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { db } from '../config/firebase';
import { 
  collection, onSnapshot, doc, setDoc, deleteDoc, 
  query, limit, orderBy, startAfter, getDocs, where
} from 'firebase/firestore';
import { logger } from '../utils/logger';

const ProductContext = createContext();

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
      setFeaturedProducts(loaded);
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
      setSearchCatalog(loaded);
    } catch (err) {
      logger.error("Search Catalog Fetch Error:", err);
    }
  }, [searchCatalog]);

  // ─── Fetch Admin Catalog (Real-time listener on mount) ───
  const fetchAdminCatalog = useCallback(() => {
    if (adminUnsub.current) return; // already listening
    const q = query(collection(db, 'products'), orderBy('title'));
    adminUnsub.current = onSnapshot(q, (snapshot) => {
      const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
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
        q = query(collection(db, 'products'), orderBy('title'), limit(pageSize));
      } else {
        q = query(collection(db, 'products'), where('category', '==', category), limit(pageSize));
      }
      
      const snapshot = await getDocs(q);
      let loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
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
        q = query(collection(db, 'products'), orderBy('title'), startAfter(afterDoc), limit(pageSize));
      } else {
        q = query(collection(db, 'products'), where('category', '==', category), startAfter(afterDoc), limit(pageSize));
      }
      
      const snapshot = await getDocs(q);
      if (snapshot.empty) return { products: [], lastDoc: afterDoc, hasMore: false };

      const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const lastVisible = snapshot.docs[snapshot.docs.length - 1];
      const canLoadMore = snapshot.docs.length === pageSize;
      
      return { products: loaded, lastDoc: lastVisible, hasMore: canLoadMore };
    } catch (err) {
      logger.error("Category Load More Error:", err);
      return { products: [], lastDoc: afterDoc, hasMore: false };
    }
  }, []);

  // ─── CRUD Operations ───
  const addProduct = useCallback(async (product) => {
    try {
      const newId = Date.now().toString();
      await setDoc(doc(db, 'products', newId), { ...product, id: newId });
    } catch (e) {
      logger.error("Error adding document: ", e);
    }
  }, []);

  const updateProduct = useCallback(async (id, updatedFields) => {
    try {
      await setDoc(doc(db, 'products', id), updatedFields, { merge: true });
    } catch (e) {
      logger.error("Error updating document: ", e);
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      logger.error("Error deleting document: ", e);
    }
  }, []);

  const value = useMemo(() => ({
    featuredProducts, isProductsLoading, productsError,
    fetchSearchCatalog, searchCatalog,
    fetchAdminCatalog, clearAdminCatalog, adminCatalog,
    fetchCategoryProducts, fetchMoreCategoryProducts,
    addProduct, updateProduct, deleteProduct
  }), [
    featuredProducts, isProductsLoading, productsError, 
    searchCatalog, fetchSearchCatalog,
    adminCatalog, fetchAdminCatalog, clearAdminCatalog,
    fetchCategoryProducts, fetchMoreCategoryProducts,
    addProduct, updateProduct, deleteProduct
  ]);

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
