import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { initAnalytics } from '../../config/firebase';
import styles from './CookieConsent.module.css';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('luqmango_cookie_consent');
    if (consent === 'true') {
      initAnalytics();
    }
    
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('luqmango_cookie_consent', 'true');
    initAnalytics();
    setIsVisible(false);
  };

  const handleDecline = () => {
    // In a real GDPR setup, you would disable analytics here
    localStorage.setItem('luqmango_cookie_consent', 'false');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.95 }}
          className={styles.container}
        >

          <div className={styles.header}>
            <div className={styles.iconWrapper}>
              <Cookie size={24} color="#00C853" />
            </div>
            <div className={styles.content}>
              <h4 className={styles.title}>Cookie Preferences</h4>
              <p className={styles.description}>
                We use cookies to improve your experience and analyze traffic for LuqmanGo. No personal data is stored without your consent.
              </p>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className={styles.closeButton}
              aria-label="Close"
            >
              <X size={18} color="#706F65" />
            </button>
          </div>

          <div className={styles.buttonGroup}>
            <button
              onClick={handleAccept}
              className={styles.acceptButton}
            >
              Accept All
            </button>
            <button
              onClick={handleDecline}
              className={styles.declineButton}
            >
              Essential Only
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
