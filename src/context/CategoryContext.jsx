import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { db, functions } from '../config/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { logger } from '../utils/logger';

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
  const loadingRef = useRef(isCategoriesLoading);
  useEffect(() => { loadingRef.current = isCategoriesLoading; }, [isCategoriesLoading]);

  useEffect(() => {
    logger.info("Initializing Firebase Category Listener...");
    const fallbackTimer = setTimeout(() => {
      if (loadingRef.current) {
        logger.warn("Firebase connection timed out (15s). Falling back to mock categories.");
        setCategories(initialMockCategories);
        setIsCategoriesLoading(false);
      }
    }, 15000);

    try {
      const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
        logger.info("Firebase Category Snapshot received!", snapshot.empty ? "Empty" : "Data found");
        clearTimeout(fallbackTimer);
        
        if (snapshot.empty) {
          logger.info("Category collection is empty. Falling back to mock categories locally.");
          setCategories(initialMockCategories);
          setIsCategoriesLoading(false);
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
        logger.error("Firebase Category Snapshot Error:", error.message, error.code);
        setCategoriesError(error.message);
        setCategories(initialMockCategories);
        setIsCategoriesLoading(false);
      });
      
      return () => {
        unsubscribe();
        clearTimeout(fallbackTimer);
      };
    } catch (err) {
      logger.error("Error setting up onSnapshot for categories:", err.message);
      // Ensure these state updates are outside the render cycle if they occur synchronously here
      setTimeout(() => {
        setCategories(initialMockCategories);
        setIsCategoriesLoading(false);
      }, 0);
    }
  }, []);

  const addCategory = useCallback(async (category) => {
    try {
      const newId = category.id || Date.now().toString();
      const manageCategory = httpsCallable(functions, 'manageCategory');
      await manageCategory({ action: 'create', id: newId, categoryData: { ...category, id: newId } });
    } catch (e) {
      logger.error("Error securely adding category: ", e);
      throw e;
    }
  }, []);

  const updateCategory = useCallback(async (id, updatedFields) => {
    try {
      const manageCategory = httpsCallable(functions, 'manageCategory');
      await manageCategory({ action: 'update', id, categoryData: updatedFields });
    } catch (e) {
      logger.error("Error securely updating category: ", e);
      throw e;
    }
  }, []);

  const deleteCategory = useCallback(async (id) => {
    try {
      const manageCategory = httpsCallable(functions, 'manageCategory');
      await manageCategory({ action: 'delete', id });
    } catch (e) {
      logger.error("Error securely deleting category: ", e);
      throw e;
    }
  }, []);

  const value = useMemo(() => ({
    categories, isCategoriesLoading, categoriesError,
    addCategory, updateCategory, deleteCategory
  }), [categories, isCategoriesLoading, categoriesError, addCategory, updateCategory, deleteCategory]);

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};
