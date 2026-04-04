import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';

const CategoryContext = createContext();

export const useCategories = () => useContext(CategoryContext);

const initialMockCategories = [
  { id: '1', name: 'Groceries', image: '/images/i1.png' },
  { id: '2', name: 'Electronics', image: '/images/i2.png' },
  { id: '3', name: 'Dresses', image: '/images/i3.png' },
  { id: '4', name: 'Home & Living', image: '/images/i4.png' },
  { id: '5', name: 'Beauty', image: '/images/i5.png' },
  { id: '6', name: 'All', isDeals: true, image: '/images/i6.png' },
];

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  useEffect(() => {
    console.log("Initializing Firebase Category Listener...");
    const fallbackTimer = setTimeout(() => {
      if (isCategoriesLoading) {
        console.warn("Firebase connection timed out (15s). Falling back to mock categories.");
        setCategories(initialMockCategories);
        setIsCategoriesLoading(false);
      }
    }, 15000);

    try {
      const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
        console.log("Firebase Category Snapshot received!", snapshot.empty ? "Empty" : "Data found");
        clearTimeout(fallbackTimer);
        
        if (snapshot.empty) {
          console.log("Seeding category database with initial data...");
          const seedDatabase = async () => {
            try {
              for (const c of initialMockCategories) {
                 await setDoc(doc(db, 'categories', c.id.toString()), c);
              }
              console.log("Category database seeded successfully.");
            } catch (err) {
              console.error("Category seeding failed:", err.message);
              setCategories(initialMockCategories);
              setIsCategoriesLoading(false);
            }
          };
          seedDatabase();
        } else {
          // Keep Exclusive Deals (All) at the end if it exists, otherwise sort alphabetically
          const loadedCategories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const sorted = loadedCategories.sort((a, b) => {
            if (a.isDeals) return 1;
            if (b.isDeals) return -1;
            return a.name.localeCompare(b.name);
          });
          setCategories(sorted);
          setIsCategoriesLoading(false);
        }
      }, (error) => {
        clearTimeout(fallbackTimer);
        console.error("Firebase Category Snapshot Error:", error.message, error.code);
        setCategoriesError(error.message);
        setCategories(initialMockCategories);
        setIsCategoriesLoading(false);
      });
      
      return () => {
        unsubscribe();
        clearTimeout(fallbackTimer);
      };
    } catch (err) {
      console.error("Error setting up onSnapshot for categories:", err.message);
      setCategories(initialMockCategories);
      setIsCategoriesLoading(false);
    }
  }, []);

  const addCategory = async (category) => {
    try {
      const newId = category.id || Date.now().toString();
      await setDoc(doc(db, 'categories', newId), { ...category, id: newId });
    } catch (e) {
      console.error("Error adding category: ", e);
    }
  };

  const updateCategory = async (id, updatedFields) => {
    try {
      await setDoc(doc(db, 'categories', id), updatedFields, { merge: true });
    } catch (e) {
      console.error("Error updating category: ", e);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (e) {
      console.error("Error deleting category: ", e);
    }
  };

  const value = {
    categories, isCategoriesLoading, categoriesError,
    addCategory, updateCategory, deleteCategory
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};
