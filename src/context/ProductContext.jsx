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

  // Dual Fetch Strategy:
  // 1. Featured Products (Full list for Hero Sliders)
  // 2. Paginated Products (For clean discovery scrolls)
  useEffect(() => {
    console.log("Initializing Dual-Stream Firebase Listeners...");
    
    // Stream 1: All Featured Products (Unpaginated for Sliders)
    const featuredQuery = query(
      collection(db, 'products'),
      where('featured', '==', true)
    );

    // Stream 2: Full General Catalog
    const generalQuery = query(
      collection(db, 'products'), 
      orderBy('title')
    );

    const fallbackTimer = setTimeout(() => {
      if (isProductsLoading) {
        console.warn("Firebase connection timed out (15s). Falling back to mock data.");
        setProducts(mockProducts);
        setFeaturedProducts(mockProducts.filter(p => p.featured));
        setIsProductsLoading(false);
      }
    }, 15000);

    // Unsubscribe functions
    let unsubFeatured = () => {};
    let unsubGeneral = () => {};

    try {
      // Listen to Featured Products
      unsubFeatured = onSnapshot(featuredQuery, (snapshot) => {
        const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeaturedProducts(loaded);
      });

      // Listen to General Paginated Products
      unsubGeneral = onSnapshot(generalQuery, (snapshot) => {
        console.log("General Product Snapshot received!", snapshot.empty ? "Empty" : "Data found");
        clearTimeout(fallbackTimer);
        
        if (snapshot.empty) {
          // SEEDING LOGIC: If DB is empty, seed it
          const seedDatabase = async () => {
            try {
              for (const p of mockProducts) {
                 await setDoc(doc(db, 'products', p.id.toString()), p);
              }
            } catch (err) {
              setProducts(mockProducts);
              setIsProductsLoading(false);
            }
          };
          seedDatabase();
        } else {
          const loadedProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setProducts(loadedProducts);
          setIsProductsLoading(false);
        }
      }, (error) => {
        clearTimeout(fallbackTimer);
        console.error("Firebase Snapshot Error:", error.message);
        setProductsError(error.message);
        setProducts(mockProducts);
        setFeaturedProducts(mockProducts.filter(p => p.featured));
        setIsProductsLoading(false);
      });
      
      return () => {
        unsubFeatured();
        unsubGeneral();
        clearTimeout(fallbackTimer);
      };
    } catch (err) {
      console.error("Error setting up listeners:", err.message);
      setProducts(mockProducts);
      setIsProductsLoading(false);
    }
  }, []);

  const fetchNextPage = async () => {}; // Deprecated in favor of UI pagination

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
    fetchNextPage, addProduct, updateProduct, deleteProduct
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
