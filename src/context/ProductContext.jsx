import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../config/firebase';
import { 
  collection, onSnapshot, doc, setDoc, deleteDoc, 
  query, limit, orderBy, startAfter, getDocs, where
} from 'firebase/firestore';
import { mockProducts } from '../data/mockProducts';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  // ─── Home Page State (All Products) ───
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // ─── Initial Load: Featured Products (real-time) + All Products (paginated) ───
  useEffect(() => {
    console.log("Initializing Optimized Firebase Listeners...");
    
    const featuredQuery = query(
      collection(db, 'products'),
      where('featured', '==', true)
    );

    const fallbackTimer = setTimeout(() => {
      if (isProductsLoading) {
        console.warn("Firebase connection timed out (15s). Falling back to mock data.");
        setProducts(mockProducts);
        setFeaturedProducts(mockProducts.filter(p => p.featured));
        setIsProductsLoading(false);
      }
    }, 15000);

    let unsubFeatured = () => {};

    try {
      unsubFeatured = onSnapshot(featuredQuery, (snapshot) => {
        const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeaturedProducts(loaded);
      });

      // Initial fetch for "All" products (Home page)
      fetchAllProducts();
      
      return () => {
        unsubFeatured();
        clearTimeout(fallbackTimer);
      };
    } catch (err) {
      console.error("Error setting up listeners:", err.message);
      setProducts(mockProducts);
      setIsProductsLoading(false);
    }
  }, []);

  // ─── Fetch "All" products for Home page ───
  const fetchAllProducts = async () => {
    setIsProductsLoading(true);
    
    try {
      const q = query(collection(db, 'products'), orderBy('title'), limit(12));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        await seedIfEmpty();
      } else {
        const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(loaded);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
        setHasMore(snapshot.docs.length === 12);
        setIsProductsLoading(false);
      }
    } catch (err) {
      console.error("Initial Fetch Error:", err);
      setProducts(mockProducts);
      setIsProductsLoading(false);
    }
  };

  const seedIfEmpty = async () => {
    try {
      for (const p of mockProducts) {
         await setDoc(doc(db, 'products', p.id.toString()), p);
      }
      const q = query(collection(db, 'products'), orderBy('title'), limit(12));
      const res = await getDocs(q);
      const loaded = res.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(loaded);
      setLastDoc(res.docs[res.docs.length - 1]);
      setIsProductsLoading(false);
    } catch (err) {
      setProducts(mockProducts);
      setIsProductsLoading(false);
    }
  };

  // ─── Load more "All" products (Home page infinite scroll) ───
  const fetchMoreAllProducts = async () => {
    if (!lastDoc || !hasMore) return;

    try {
      const q = query(collection(db, 'products'), orderBy('title'), startAfter(lastDoc), limit(12));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        setHasMore(false);
        return;
      }

      const nextItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const uniqueNew = nextItems.filter(item => !existingIds.has(item.id));
        return [...prev, ...uniqueNew];
      });
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === 12);
    } catch (err) {
      console.error("Load More Error:", err);
    }
  };

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
      const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
      const canLoadMore = snapshot.docs.length === pageSize;
      
      return { products: loaded, lastDoc: lastVisible, hasMore: canLoadMore };
    } catch (err) {
      console.error("Category Fetch Error:", err);
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
      console.error("Category Load More Error:", err);
      return { products: [], lastDoc: afterDoc, hasMore: false };
    }
  }, []);

  // ─── CRUD Operations ───
  const addProduct = async (product) => {
    try {
      const newId = Date.now().toString();
      await setDoc(doc(db, 'products', newId), { ...product, id: newId });
      // Refresh home page products
      fetchAllProducts();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      await setDoc(doc(db, 'products', id), updatedFields, { merge: true });
      fetchAllProducts();
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const value = {
    // Home page data
    products, featuredProducts, isProductsLoading, productsError,
    hasMore, fetchMoreAllProducts, fetchAllProducts,
    // Category page helpers (return data, don't mutate shared state)
    fetchCategoryProducts, fetchMoreCategoryProducts,
    // CRUD
    addProduct, updateProduct, deleteProduct
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
