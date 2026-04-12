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
      return saved ? JSON.parse(saved) : [];
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
            return saved ? JSON.parse(saved) : [];
          } catch {
            return [];
          }
        })();

        if (snap.exists() && snap.data().wishlist) {
          const cloudList = snap.data().wishlist || [];
          
          // Merge lists removing duplicates
          const mergedList = [...cloudList];
          for (const item of localList) {
             if (!mergedList.find(i => i.id === item.id)) {
                mergedList.push(item);
             }
          }
          
          setWishlist(mergedList);
          
          if (localList.length > 0) {
             await setDoc(userRef, { wishlist: mergedList }, { merge: true });
          }
        } else {
           if (localList.length > 0) {
              await setDoc(userRef, { wishlist: localList }, { merge: true });
           }
        }
        logger.info('Wishlist synced with cloud account.');
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

  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const isInWishlist = useCallback((id) => {
    return !!wishlist.find(item => item.id === id);
  }, [wishlist]);

  const value = useMemo(() => ({ wishlist, toggleWishlist, isInWishlist }), [wishlist, toggleWishlist, isInWishlist]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
