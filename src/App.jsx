import { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/storefront/Navbar';
import SideDrawer from './components/storefront/SideDrawer';
import MobileBottomNav from './components/storefront/MobileBottomNav';
import SearchOverlay from './components/storefront/SearchOverlay';

// ─── Storefront Pages (Lazy Loaded) ───────────────────────────
const Home = lazy(() => import('./pages/storefront/Home'));
const CategoryPage = lazy(() => import('./pages/storefront/CategoryPage'));
const ProductDetail = lazy(() => import('./pages/storefront/ProductDetail'));
const StoresComingSoon = lazy(() => import('./pages/storefront/StoresComingSoon'));
const Wishlist = lazy(() => import('./pages/storefront/Wishlist'));
const SignIn = lazy(() => import('./pages/storefront/SignIn'));
const Register = lazy(() => import('./pages/storefront/Register'));
const CartCheckout = lazy(() => import('./pages/storefront/CartCheckout'));
const UserProfile = lazy(() => import('./pages/storefront/UserProfile'));
const AboutPage = lazy(() => import('./pages/storefront/AboutPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/storefront/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/storefront/TermsPage'));
const DeliveryPolicyPage = lazy(() => import('./pages/storefront/DeliveryPolicyPage'));
const NotFound = lazy(() => import('./pages/storefront/NotFound'));

// ─── Admin Pages (Lazy Loaded) ───────────────────────────────
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ProductManagement = lazy(() => import('./pages/admin/ProductManagement'));
const CategoryManagement = lazy(() => import('./pages/admin/CategoryManagement'));
const OrderManagement = lazy(() => import('./pages/admin/OrderManagement'));

// ─── Premium Loading Fallback ────────────────────────────────
const PageFallback = () => (
  <div style={{ 
    height: '60vh', width: '100%', 
    display: 'flex', flexDirection: 'column', 
    alignItems: 'center', justifyContent: 'center',
    gap: '1.5rem', opacity: 0, animation: 'fadeIn 0.3s ease forwards'
  }}>
    <div style={{ 
      width: '40px', height: '40px', 
      border: '3px solid rgba(0, 200, 83, 0.1)', 
      borderTopColor: '#00C853', 
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <span style={{ 
      fontSize: '0.75rem', fontWeight: 700, 
      letterSpacing: '0.2em', color: '#706F65', 
      textTransform: 'uppercase' 
    }}>
      Loading Experience
    </span>
    <style>{`
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes fadeIn { to { opacity: 1; } }
    `}</style>
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
    }, 3200); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-container">
      {/* Side Drawer for Mobile */}
      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Global Start-up Loader */}
      {isLoading && (
        <div 
          className={fadeOut ? 'animate-fade-out' : ''}
          style={{ 
            position: 'fixed', inset: 0, zIndex: 9999, 
            backgroundColor: '#F7F3ED', 
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            paddingBottom: '12vh',
            background: 'radial-gradient(circle at center, #FFFFFF 0%, #F7F3ED 100%)'
          }}
        >
          {/* Elegant Ambient Background Pulse */}
          <div 
            className="animate-ambient-glow"
            style={{ 
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              background: 'radial-gradient(circle at center, rgba(0, 200, 83, 0.1) 0%, transparent 60%)',
              zIndex: 0 
            }}
          />

          {/* Main Logo Container */}
          <div className="animate-loader-logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1, width: '90%' }}>
            
            <h2 style={{ 
              fontSize: 'clamp(5rem, 22vw, 7.5rem)', 
              fontWeight: 800, 
              margin: 0, 
              display: 'inline-flex', 
              alignItems: 'baseline', 
              letterSpacing: '-0.02em', 
              color: '#00C853', 
              textShadow: '0 4px 30px rgba(0,200,83,0.2)',
              position: 'relative',
              paddingBottom: '1.2rem',
              whiteSpace: 'nowrap'
            }}>
              <span>Luqman</span>
              <span style={{ color: '#C4D300' }}>Go</span>

              <div style={{ 
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '30px'
              }}>
                <svg width="100%" height="100%" viewBox="0 0 240 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M10 10 C 50 8, 180 8, 225 10 L 220 5 L 230 10 L 220 15 L 225 10" 
                      stroke="#00C853" 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="animate-loader-arrow"
                      style={{ strokeDasharray: 300, strokeDashoffset: 300, animation: 'arrowDrawSVG 1.5s ease-out 0.8s forwards' }}
                    />
                </svg>
              </div>
            </h2>

            <div className="animate-tagline" style={{ marginTop: '0.8rem', fontFamily: '"Georgia", serif', fontStyle: 'italic', fontSize: '1.5rem', color: '#001d04', letterSpacing: '0.02em' }}>
              Shop. Click. Done.
            </div>

            <div 
              style={{ 
                marginTop: '2.5rem', opacity: 0, 
                animation: 'fadeIn 1s ease-out 1.5s forwards',
                fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.4em',
                color: '#706F65'
              }}
            >
              PIONEERING PREMIUM UTILITY
            </div>
            
          </div>

          <div style={{ position: 'absolute', bottom: '8vh', opacity: 0, animation: 'fadeIn 1s ease-out 2.2s forwards', textAlign: 'center' }}>
             <div style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.2rem', color: '#001d04', marginBottom: '0.5rem' }}>GLOBAL CURATED NETWORK</div>
             <div className="animate-pulse-glow" style={{ width: '40px', height: '1.5px', backgroundColor: '#436132', margin: '0 auto', opacity: 0.2 }}></div>
          </div>
          
        </div>
      )}

      <Navbar onOpenDrawer={() => setIsDrawerOpen(true)} onOpenSearch={() => setIsSearchOpen(true)} />
      
      <main className="main-content">
        <ErrorBoundary>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Suspense fallback={<PageFallback />}>
            <Routes location={location} key={location.pathname}>
            {/* Storefront Routes - Public */}
              <Route path="/" element={<Home />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/stores" element={<StoresComingSoon />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<CartCheckout />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/delivery-policy" element={<DeliveryPolicyPage />} />
              
              {/* Protected Routes - Requires Authentication */}
              <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              
              {/* Admin Routes - Requires Admin Role */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><ProductManagement /></AdminRoute>} />
              <Route path="/admin/categories" element={<AdminRoute><CategoryManagement /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><OrderManagement /></AdminRoute>} />

              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
        </ErrorBoundary>
      </main>

      {/* Persistent Bottom Nav for Mobile */}
      <MobileBottomNav 
        onOpenDrawer={() => setIsDrawerOpen(true)} 
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
