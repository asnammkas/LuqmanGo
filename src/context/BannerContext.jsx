import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { db, functions } from '../config/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { logger } from '../utils/logger';

const BannerContext = createContext();

export const useBanners = () => useContext(BannerContext);

// Initial fallback mock banners in case DB is empty or fails
const initialMockBanners = [
  {
    id: 'promo-1',
    title: 'ORGANIC ARTISANAL COFFEE',
    image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    link: '/category/Groceries',
    order: 0
  },
  {
    id: 'promo-2',
    title: 'SUMMER ESSENTIALS COLLECTION',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    link: '/category/Dresses',
    order: 1
  },
  {
    id: 'promo-3',
    title: 'ELEVATE YOUR SPACE',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80',
    link: '/category/Furniture',
    order: 2
  }
];

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
        logger.warn("Firebase connection timed out (15s). Falling back to mock banners.");
        setBanners(initialMockBanners);
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
        setBanners(initialMockBanners);
        setIsBannersLoading(false);
      });
      
      return () => {
        unsubscribe();
        clearTimeout(fallbackTimer);
      };
    } catch (err) {
      logger.error("Error setting up onSnapshot for banners:", err.message);
      setTimeout(() => {
        setBanners(initialMockBanners);
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
