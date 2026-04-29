import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { db, functions } from '../config/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { logger } from '../utils/logger';

const BannerContext = createContext();

export const useBanners = () => useContext(BannerContext);

// No mock banners loaded locally

export const BannerProvider = ({ children }) => {
  const [banners, setBanners] = useState([]);
  const [isBannersLoading, setIsBannersLoading] = useState(true);
  const [bannersError, setBannersError] = useState(null);
  const loadingRef = useRef(isBannersLoading);
  
  useEffect(() => { loadingRef.current = isBannersLoading; }, [isBannersLoading]);

  useEffect(() => {
    logger.info("Initializing Firebase Banner Listener...");
    const fallbackTimer = setTimeout(() => {
      if (loadingRef.current) {
        logger.warn("Firebase connection timed out (15s).");
        setBanners([]);
        setIsBannersLoading(false);
      }
    }, 15000);

    try {
      const bannersQuery = query(collection(db, 'banners'), orderBy('order', 'asc'));
      const unsubscribe = onSnapshot(bannersQuery, (snapshot) => {
        clearTimeout(fallbackTimer);
        
        if (snapshot.empty) {
          logger.info("Banner collection is empty.");
          setBanners([]);
          setIsBannersLoading(false);
        } else {
          const loadedBanners = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setBanners(loadedBanners);
          setIsBannersLoading(false);
        }
      }, (error) => {
        clearTimeout(fallbackTimer);
        logger.error("Firebase Banner Snapshot Error:", error.message, error.code);
        setBannersError(error.message);
        setBanners([]);
        setIsBannersLoading(false);
      });
      
      return () => {
        unsubscribe();
        clearTimeout(fallbackTimer);
      };
    } catch (err) {
      logger.error("Error setting up onSnapshot for banners:", err.message);
      setTimeout(() => {
        setBanners([]);
        setIsBannersLoading(false);
      }, 0);
    }
  }, []);

  const addBanner = useCallback(async (banner) => {
    try {
      const newId = banner.id || `banner_${Date.now()}`;
      const manageBanner = httpsCallable(functions, 'manageBanner');
      await manageBanner({ action: 'create', id: newId, bannerData: { ...banner, id: newId } });
    } catch (e) {
      logger.error("Error securely adding banner: ", e);
      throw e;
    }
  }, []);

  const updateBanner = useCallback(async (id, updatedFields) => {
    try {
      const manageBanner = httpsCallable(functions, 'manageBanner');
      await manageBanner({ action: 'update', id, bannerData: updatedFields });
    } catch (e) {
      logger.error("Error securely updating banner: ", e);
      throw e;
    }
  }, []);

  const deleteBanner = useCallback(async (id) => {
    try {
      const manageBanner = httpsCallable(functions, 'manageBanner');
      await manageBanner({ action: 'delete', id });
    } catch (e) {
      logger.error("Error securely deleting banner: ", e);
      throw e;
    }
  }, []);

  const value = useMemo(() => ({
    banners, isBannersLoading, bannersError,
    addBanner, updateBanner, deleteBanner
  }), [banners, isBannersLoading, bannersError, addBanner, updateBanner, deleteBanner]);

  return (
    <BannerContext.Provider value={value}>
      {children}
    </BannerContext.Provider>
  );
};
