import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Simulate initial loading sequence for a premium feel
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Remove from DOM after fade animation completes
      setTimeout(() => setIsLoading(false), 600);
    }, 1500);
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
            
            {/* Logo Text Section */}
            <h2 style={{ fontSize: 'clamp(2.5rem, 12vw, 4.5rem)', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'baseline', letterSpacing: '-0.02em', color: '#00C853' }}>
              <span>Luqman</span>
              <span style={{ color: '#C4D300' }}>Go</span>
            </h2>

            {/* Hand-drawn Arrow SVG Underline */}
            <div style={{ width: 'clamp(180px, 50vw, 240px)', height: '20px', marginTop: '-0.4rem', position: 'relative' }}>
               <svg width="100%" height="100%" viewBox="0 0 240 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M10 10 C 50 8, 180 8, 225 10 L 220 5 L 230 10 L 220 15 L 225 10" 
                    stroke="#00C853" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="animate-loader-arrow"
                    style={{ strokeDasharray: 300, strokeDashoffset: 300, animation: 'arrowDrawSVG 1.5s ease-out 0.8s forwards' }}
                  />
               </svg>
            </div>

            {/* Tagline Section */}
            <div className="animate-tagline" style={{ marginTop: '0.8rem', fontFamily: '"Georgia", serif', fontStyle: 'italic', fontSize: '1.5rem', color: '#001d04', letterSpacing: '0.02em' }}>
              Shop. Click. Done.
            </div>

            {/* Mission Statement */}
            <div 
              style={{ 
                marginTop: '3.5rem', opacity: 0, 
                animation: 'fadeIn 1s ease-out 1.8s forwards',
                fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.4em',
                color: '#706F65'
              }}
            >
              PIONEERING SUSTAINABLE LUXURY
            </div>
            
          </div>

          {/* Branding Detail at Bottom */}
          <div style={{ position: 'absolute', bottom: '8vh', opacity: 0, animation: 'fadeIn 1s ease-out 2.5s forwards', textAlign: 'center' }}>
             <div style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.2rem', color: '#001d04', marginBottom: '0.5rem' }}>GLOBAL SUSTAINABLE NETWORK</div>
             <div className="animate-pulse-glow" style={{ width: '40px', height: '1.5px', backgroundColor: '#00C853', margin: '0 auto', opacity: 0.2 }}></div>
          </div>
          
        </div>
      )}

      <Navbar onOpenDrawer={() => setIsDrawerOpen(true)} />
      
      <main className="main-content">
        {/* Animated Page Transition Wrapper */}
        <div key={location.pathname} className="animate-fade-in" style={{ animationDuration: '0.4s' }}>
          <Routes>
            {/* Storefront Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/stores" element={<StoresComingSoon />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<CartCheckout />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/delivery-policy" element={<DeliveryPolicyPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/orders" element={<OrderManagement />} />
          </Routes>
        </div>
      </main>

      {/* Persistent Bottom Nav for Mobile */}
      <MobileBottomNav onOpenDrawer={() => setIsDrawerOpen(true)} />
    </div>
  );
}

export default App;
