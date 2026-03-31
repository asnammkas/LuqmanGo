import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/storefront/Navbar';
import SideDrawer from './components/storefront/SideDrawer';
import MobileBottomNav from './components/storefront/MobileBottomNav';
import Home from './pages/storefront/Home';
import CategoryPage from './pages/storefront/CategoryPage';
import ProductDetail from './pages/storefront/ProductDetail';
import StoresComingSoon from './pages/storefront/StoresComingSoon';
import Wishlist from './pages/storefront/Wishlist';
import SignIn from './pages/storefront/SignIn';
import Register from './pages/storefront/Register';
import CartCheckout from './pages/storefront/CartCheckout';
import UserProfile from './pages/storefront/UserProfile';
import AboutPage from './pages/storefront/AboutPage';
import PrivacyPolicyPage from './pages/storefront/PrivacyPolicyPage';
import TermsPage from './pages/storefront/TermsPage';
import DeliveryPolicyPage from './pages/storefront/DeliveryPolicyPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import NotFound from './pages/storefront/NotFound';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setIsLoading(false), 600);
    }, 3200); // Extended to allow animations to complete
    return () => clearTimeout(timer);
  }, []);

  // Scroll to top on route change
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
              position: 'absolute', width: '300px', height: '300px', 
              borderRadius: '50%', background: 'radial-gradient(circle, rgba(0, 200, 83, 0.1) 0%, transparent 70%)',
              filter: 'blur(50px)', zIndex: 0 
            }}
          />

          {/* Main Logo Container */}
          <div className="animate-loader-logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1, width: '90%' }}>
            
            {/* Logo Text Section - Now the positioning context for the arrow */}
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

              {/* Hand-drawn Arrow SVG Underline - Absolutely positioned to match text width */}
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

            {/* Tagline Section */}
            <div className="animate-tagline" style={{ marginTop: '0.8rem', fontFamily: '"Georgia", serif', fontStyle: 'italic', fontSize: '1.5rem', color: '#001d04', letterSpacing: '0.02em' }}>
              Shop. Click. Done.
            </div>

            {/* Mission Statement */}
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

          {/* Branding Detail at Bottom */}
          <div style={{ position: 'absolute', bottom: '8vh', opacity: 0, animation: 'fadeIn 1s ease-out 2.2s forwards', textAlign: 'center' }}>
             <div style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.2rem', color: '#001d04', marginBottom: '0.5rem' }}>GLOBAL CURATED NETWORK</div>
             <div className="animate-pulse-glow" style={{ width: '40px', height: '1.5px', backgroundColor: '#436132', margin: '0 auto', opacity: 0.2 }}></div>
          </div>
          
        </div>
      )}

      <Navbar onOpenDrawer={() => setIsDrawerOpen(true)} />
      
      <main className="main-content">
        {/* Animated Page Transition Wrapper */}
        <div key={location.pathname} className="animate-fade-in" style={{ animationDuration: '0.4s' }}>
          <Routes>
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
            <Route path="/admin/orders" element={<AdminRoute><OrderManagement /></AdminRoute>} />

            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>

      {/* Persistent Bottom Nav for Mobile */}
      <MobileBottomNav onOpenDrawer={() => setIsDrawerOpen(true)} />
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
