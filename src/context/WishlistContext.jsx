import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { logger } from '../utils/logger';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('luqman_wishlist');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      // Migration: convert objects to IDs if necessary
      return parsed.map(item => (typeof item === 'object' ? item.id : item));
    } catch {
      return [];
    }
  });

  const { currentUser } = useAuth();

  // Merge cloud and local wishlists upon login
  useEffect(() => {
    if (!currentUser) return;
    
    const syncCloudWishlist = async () => {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const snap = await getDoc(userRef);
        
        const localList = (() => {
          try {
            const saved = localStorage.getItem('luqman_wishlist');
            if (!saved) return [];
            const parsed = JSON.parse(saved);
            return parsed.map(item => (typeof item === 'object' ? item.id : item));
          } catch {
            return [];
          }
        })();

        if (snap.exists() && snap.data().wishlist) {
          const rawCloudList = snap.data().wishlist || [];
          // Migration: convert objects to IDs
          const cloudList = rawCloudList.map(item => (typeof item === 'object' ? item.id : item));
          
          // Merge lists removing duplicates
          const mergedList = [...new Set([...cloudList, ...localList])];
          
          setWishlist(mergedList);
          
          if (localList.length > 0) {
             await setDoc(userRef, { wishlist: mergedList }, { merge: true });
          }
        } else {
           if (localList.length > 0) {
              await setDoc(userRef, { wishlist: localList }, { merge: true });
           }
        }
        logger.info('Wishlist (IDs only) synced with cloud.');
      } catch (err) {
        logger.error('Failed to sync cloud wishlist:', err);
      }
    };
    
    syncCloudWishlist();
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('luqman_wishlist', JSON.stringify(wishlist));
    
    // Sync changes back to cloud if logged in
    if (currentUser) {
       const userRef = doc(db, 'users', currentUser.uid);
       setDoc(userRef, { wishlist }, { merge: true }).catch(err => {
         logger.error("Failed to update cloud wishlist", err);
       });
    }
  }, [wishlist, currentUser]);

  const toggleWishlist = useCallback((productId) => {
    const id = typeof productId === 'object' ? productId.id : productId;
    setWishlist((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        return prev.filter(item => item !== id);
      }
      return [...prev, id];
    });
  }, []);

  const isInWishlist = useCallback((id) => {
    return wishlist.includes(id);
  }, [wishlist]);

  const value = useMemo(() => ({ wishlist, toggleWishlist, isInWishlist }), [wishlist, toggleWishlist, isInWishlist]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
