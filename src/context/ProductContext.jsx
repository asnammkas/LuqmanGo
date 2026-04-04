import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { mockProducts } from '../data/mockProducts';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  useEffect(() => {
    console.log("Initializing Firebase Product Listener...");
    const fallbackTimer = setTimeout(() => {
      if (isProductsLoading) {
        console.warn("Firebase connection timed out (15s). Falling back to mock data.");
        setProducts(mockProducts);
        setIsProductsLoading(false);
      }
    }, 15000);

    try {
      const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
        console.log("Firebase Snapshot received!", snapshot.empty ? "Empty" : "Data found");
        clearTimeout(fallbackTimer);
        if (snapshot.empty) {
          console.log("Seeding database with mock data...");
          const seedDatabase = async () => {
            try {
              for (const p of mockProducts) {
                 await setDoc(doc(db, 'products', p.id.toString()), p);
              }
              console.log("Database seeded successfully.");
            } catch (err) {
              console.error("Seeding failed:", err.message);
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
        console.error("Firebase Snapshot Error:", error.message, error.code);
        setProductsError(error.message);
        setProducts(mockProducts);
        setIsProductsLoading(false);
      });
      
      return () => {
        unsubscribe();
        clearTimeout(fallbackTimer);
      };
    } catch (err) {
      console.error("Error setting up onSnapshot:", err.message);
      setProducts(mockProducts);
      setIsProductsLoading(false);
    }
  }, []);

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
    products, isProductsLoading, productsError,
    addProduct, updateProduct, deleteProduct
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
