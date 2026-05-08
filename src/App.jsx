import { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/storefront/Navbar';
import SideDrawer from './components/storefront/SideDrawer';
import MobileBottomNav from './components/storefront/MobileBottomNav';
import SearchOverlay from './components/storefront/SearchOverlay';
import styles from './App.module.css';
import CookieConsent from './components/storefront/CookieConsent';
import LoadingSpinner from './components/ui/LoadingSpinner';
import WhatsAppFloat from './components/ui/WhatsAppFloat';
import FloatingCart from './components/storefront/FloatingCart';



// ─── Storefront Pages (Lazy Loaded) ───────────────────────────
const Home = lazy(() => import('./pages/storefront/Home'));
const CategoryPage = lazy(() => import('./pages/storefront/CategoryPage'));
const ProductDetail = lazy(() => import('./pages/storefront/ProductDetail'));
const Stores = lazy(() => import('./pages/storefront/Stores'));
const Wishlist = lazy(() => import('./pages/storefront/Wishlist'));
const SignIn = lazy(() => import('./pages/storefront/SignIn'));
const Register = lazy(() => import('./pages/storefront/Register'));
const CartCheckout = lazy(() => import('./pages/storefront/CartCheckout'));
const ProfileLayout = lazy(() => import('./pages/storefront/profile/ProfileLayout'));
const ProfileDashboard = lazy(() => import('./pages/storefront/profile/ProfileDashboard'));
const ProfileOrders = lazy(() => import('./pages/storefront/profile/ProfileOrders'));
const ProfileAddresses = lazy(() => import('./pages/storefront/profile/ProfileAddresses'));
const ProfileSettings = lazy(() => import('./pages/storefront/profile/ProfileSettings'));
const ProfilePayments = lazy(() => import('./pages/storefront/profile/ProfilePayments'));
const ProfileHelp = lazy(() => import('./pages/storefront/profile/ProfileHelp'));
const ProfilePrivacy = lazy(() => import('./pages/storefront/profile/ProfilePrivacy'));
const AboutPage = lazy(() => import('./pages/storefront/AboutPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/storefront/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/storefront/TermsPage'));
const DeliveryPolicyPage = lazy(() => import('./pages/storefront/DeliveryPolicyPage'));
const NotFound = lazy(() => import('./pages/storefront/NotFound'));

// ─── Admin Pages (Lazy Loaded) ───────────────────────────────
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ProductManagement = lazy(() => import('./pages/admin/ProductManagement'));
const CategoryManagement = lazy(() => import('./pages/admin/CategoryManagement'));
const BannerManagement = lazy(() => import('./pages/admin/BannerManagement'));
const OrderManagement = lazy(() => import('./pages/admin/OrderManagement'));

// ─── Premium Loading Fallback ────────────────────────────────
const PageFallback = () => (
  <div className={styles.pageFallback}>
    <LoadingSpinner size={40} label="Loading Experience" />
  </div>
);


function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setIsLoading(false), 600);
    }, 1800); 
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={styles.appContainer}>
      {/* Side Drawer for Mobile */}
      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Global Start-up Loader */}
      {isLoading && (
        <div className={`${styles.loaderOverlay} ${fadeOut ? 'animate-fade-out' : ''}`}>
          {/* Elegant Ambient Background Pulse */}
          <div className={`${styles.ambientGlow} animate-ambient-glow`} />

          {/* Main Logo Container */}
          <div className={`${styles.loaderLogoContainer} animate-loader-logo`}>
            
            <h2 className={styles.brandName}>
              <span>Luqman</span>
              <span className={styles.brandGo}>Go</span>

              <div className={styles.arrowContainer}>
                <svg width="100%" height="100%" viewBox="0 0 240 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M10 10 C 50 8, 180 8, 225 10 L 220 5 L 230 10 L 220 15 L 225 10" 
                      stroke="#00C853" 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="animate-loader-arrow"
                      style={{ strokeDasharray: 300, strokeDashoffset: 300, animation: 'arrowDrawSVG 1.2s ease-out 0.5s forwards' }}

                    />
                </svg>
              </div>
            </h2>

            <div className={`${styles.tagline} animate-tagline`}>
              Shop. Click. Done.
            </div>

            <div className={styles.loaderSubtext}>
              PIONEERING PREMIUM UTILITY
            </div>
            
          </div>

          <div className={styles.footerNote}>
             <div className={styles.globalNote}>GLOBAL CURATED NETWORK</div>
             <div className={`${styles.pulseLine} animate-pulse-glow`} />
          </div>
          
        </div>
      )}

      <Navbar onOpenDrawer={() => setIsDrawerOpen(true)} onOpenSearch={() => setIsSearchOpen(true)} />
      
      <main className="main-content">
        <ErrorBoundary>
        <AnimatePresence mode="popLayout">
          <Motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ minHeight: '60vh' }}
          >
            <Suspense fallback={<PageFallback />}>
            <Routes location={location}>
            {/* Storefront Routes - Public */}
              <Route path="/" element={<Home />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/stores" element={<Stores />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<CartCheckout />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/delivery-policy" element={<DeliveryPolicyPage />} />
              
              {/* Protected Routes - Requires Authentication */}
              <Route path="/profile" element={<ProtectedRoute><ProfileLayout /></ProtectedRoute>}>
                <Route index element={<ProfileDashboard />} />
                <Route path="orders" element={<ProfileOrders />} />
                <Route path="addresses" element={<ProfileAddresses />} />
                <Route path="settings" element={<ProfileSettings />} />
                <Route path="payments" element={<ProfilePayments />} />
                <Route path="help" element={<ProfileHelp />} />
                <Route path="privacy" element={<ProfilePrivacy />} />
              </Route>
              
              {/* Admin Routes - Requires Admin Role */}
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="banners" element={<BannerManagement />} />
                <Route path="orders" element={<OrderManagement />} />
              </Route>

              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </Motion.div>
        </AnimatePresence>
        </ErrorBoundary>
      </main>

      {/* Persistent Bottom Nav for Mobile */}
      <MobileBottomNav 
        onOpenDrawer={() => setIsDrawerOpen(true)} 
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      {/* GDPR Cookie Consent */}
      <CookieConsent />
      
      {/* Persistent Global Floating Cart Summary */}
      <FloatingCart isDrawerOpen={isDrawerOpen} isSearchOpen={isSearchOpen} />
      
      {/* Persistent Global Floating Contact */}
      {!isDrawerOpen && <WhatsAppFloat />}
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
