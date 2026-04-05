import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { db } from '../config/firebase';
import { 
  collection, onSnapshot, doc, setDoc, deleteDoc, 
  query, limit, orderBy, startAfter, getDocs, where
} from 'firebase/firestore';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  // ─── Home Page State (All Products) ───
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const initialLoadDone = useRef(false);

  // ─── Real-time listener for ALL products ───
  useEffect(() => {
    console.log("Initializing Real-time Firebase Listeners...");
    
    const allProductsQuery = query(
      collection(db, 'products'),
      orderBy('title')
    );

    const fallbackTimer = setTimeout(() => {
      if (!initialLoadDone.current) {
        console.warn("Firebase connection timed out (15s). Showing empty state.");
        setProducts([]);
        setFeaturedProducts([]);
        setIsProductsLoading(false);
      }
    }, 15000);

    // Real-time listener — automatically reflects adds, updates, AND deletes
    const unsubAll = onSnapshot(allProductsQuery, (snapshot) => {
      const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setProducts(loaded);
      setFeaturedProducts(loaded.filter(p => p.featured));
      initialLoadDone.current = true;
      setIsProductsLoading(false);
      clearTimeout(fallbackTimer);
    }, (err) => {
      console.error("Products listener error:", err);
      setProductsError("Failed to load products. Please refresh.");
      setIsProductsLoading(false);
    });

    return () => {
      unsubAll();
      clearTimeout(fallbackTimer);
    };
  }, []);

  // fetchAllProducts is kept for manual refresh calls (e.g. after add/update)
  // but now it's a no-op since the real-time listener handles everything
  const fetchAllProducts = () => {
    // Real-time listener already keeps products in sync
  };

  // ─── Load more is no longer needed since we fetch all via onSnapshot ───
  const fetchMoreAllProducts = () => {
    // All products are loaded via real-time listener
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
