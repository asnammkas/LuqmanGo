import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { 
  collection, onSnapshot, doc, setDoc, deleteDoc, 
  query, limit, orderBy, startAfter, getDocs, where
} from 'firebase/firestore';
import { mockProducts } from '../data/mockProducts';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Dual Fetch Strategy:
  // 1. Featured Products (Full list for Hero Sliders - still real-time)
  // 2. Paginated Products (Fetch-on-demand for general catalog)
  useEffect(() => {
    console.log("Initializing Optimized Firebase Listeners...");
    
    // Stream 1: All Featured Products (Unpaginated for Sliders)
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

      // Initial Fetch for General Catalog
      fetchInitialProducts(fallbackTimer);
      
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

  const fetchInitialProducts = async (category = 'All') => {
    setIsProductsLoading(true);
    setProducts([]); // Clear for fresh category fetch
    
    try {
      let q;
      if (category === 'All') {
        q = query(collection(db, 'products'), orderBy('title'), limit(12));
      } else {
        q = query(collection(db, 'products'), where('category', '==', category), orderBy('title'), limit(12));
      }
      
      const snapshot = await getDocs(q);
      if (snapshot.empty && category === 'All') {
        await seedIfEmpty();
      } else {
        const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(loaded);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === 12);
        setIsProductsLoading(false);
      }
    } catch (err) {
      console.error("Initial Fetch Error:", err);
      // Fallback only for initial 'All' fetch
      if (category === 'All') setProducts(mockProducts);
      setIsProductsLoading(false);
    }
  };

  const seedIfEmpty = async () => {
    try {
      for (const p of mockProducts) {
         await setDoc(doc(db, 'products', p.id.toString()), p);
      }
      // Re-fetch after seeding
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

  const fetchMoreProducts = async (category = 'All') => {
    if (!lastDoc || !hasMore) return;

    try {
      let q;
      if (category === 'All') {
        q = query(collection(db, 'products'), orderBy('title'), startAfter(lastDoc), limit(12));
      } else {
        q = query(collection(db, 'products'), where('category', '==', category), orderBy('title'), startAfter(lastDoc), limit(12));
      }

      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        setHasMore(false);
        return;
      }

      const nextItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(prev => [...prev, ...nextItems]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === 12);
    } catch (err) {
      console.error("Load More Error:", err);
    }
  };

  const addProduct = async (product) => {
    try {
      const newId = Date.now().toString();
      await setDoc(doc(db, 'products', newId), { ...product, id: newId });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      await setDoc(doc(db, 'products', id), updatedFields, { merge: true });
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const value = {
    products, featuredProducts, isProductsLoading, productsError,
    fetchInitialProducts, fetchMoreProducts, hasMore, addProduct, updateProduct, deleteProduct
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
