import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
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
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    // Simulate initial loading sequence for a premium feel
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Remove from DOM after fade animation completes
      setTimeout(() => setIsLoading(false), 600);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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
            backgroundColor: 'var(--color-bg-main)', 
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          {/* Animated App Logo */}
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '40px', marginBottom: '1.5rem', animation: 'pulse-glow 2s infinite', borderRadius: '50%', padding: '10px' }}>
             <img src="/images/logo.jpg" alt="Logo" style={{ height: '80px', objectFit: 'contain' }} />
          </div>
          <h2 style={{ fontSize: '2rem', letterSpacing: '0.05em', fontWeight: 800, lineHeight: 1 }}>
            <span style={{ color: 'var(--color-secondary)' }}>Luqman</span>
            <span style={{ color: 'var(--color-primary)' }}>Go</span>
          </h2>
          {/* Loading Bar */}
          <div style={{ marginTop: '2rem', width: '200px', height: '3px', backgroundColor: 'var(--color-border)', borderRadius: '99px', overflow: 'hidden', position: 'relative' }}>
            <div 
              style={{ 
                position: 'absolute', top: 0, left: 0, height: '100%', width: '40%', 
                backgroundColor: 'var(--color-primary)', borderRadius: '99px',
                animation: 'pulse-glow 1s infinite alternate' 
              }} 
            />
          </div>
        </div>
      )}

      <Navbar onOpenDrawer={() => setIsDrawerOpen(true)} />
      
      <main className="main-content">
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
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
        </Routes>
      </main>

      {/* Persistent Bottom Nav for Mobile */}
      <MobileBottomNav onOpenDrawer={() => setIsDrawerOpen(true)} />
    </div>
  );
}

export default App;
