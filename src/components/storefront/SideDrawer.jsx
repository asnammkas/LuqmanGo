import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { 
  X, Search, LayoutGrid, Smartphone, Shirt, Leaf, Sofa, Flower2, 
  LogIn, LogOut, UserPlus, ChevronRight, LayoutDashboard, Store,
  Instagram, Facebook
} from 'lucide-react';

const SideDrawer = ({ isOpen, onClose }) => {

  const { currentUser, isAdmin, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isWaHovered, setIsWaHovered] = useState(false);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/category/All?search=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
      setSearchQuery('');
    }
  };

  if (!isOpen) return null;

  const categoryMenu = [
    { label: 'All Collections', id: 'All', icon: LayoutGrid },
    { label: 'Electronics', id: 'Electronics', icon: Smartphone },
    { label: 'Dresses', id: 'Dresses', icon: Shirt },
    { label: 'Groceries', id: 'Groceries', icon: Leaf },
    { label: 'Furniture', id: 'Furniture', icon: Sofa },
    { label: 'Home & Living', id: 'Home & Living', icon: Flower2 },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 199,
          animation: 'fadeIn 0.3s ease'
        }}
      />

      {/* Drawer */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '85%',
        maxWidth: '380px',
        backgroundColor: '#EAE1D3', // Match user screenshot beige
        zIndex: 200,
        boxShadow: '4px 0 25px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.3s ease-out'
      }}>
        
        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 1.5rem', scrollbarWidth: 'none' }}>
          
          {/* Header - Minimal LuqmanGo */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ 
              fontSize: '1.6rem', 
              fontWeight: 400, 
              letterSpacing: '0.4em', 
              color: 'var(--color-text-main)', 
              margin: 0,
              textTransform: 'none'
            }}>
              LuqmanGo
            </h1>
            <button aria-label="Close menu" onClick={onClose} style={{ background: 'none', border: 'none', color: '#001d04', cursor: 'pointer', padding: '0.5rem' }}>
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            borderBottom: '1px solid rgba(0, 29, 4, 0.1)', 
            paddingBottom: '0.5rem',
            marginBottom: '2rem'
          }}>
            <Search size={16} color="#001d04" style={{ marginRight: '0.75rem', opacity: 0.8 }} />
            <input 
              type="text" 
              placeholder="Explore the archive..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              style={{
                border: 'none',
                background: 'transparent',
                width: '100%',
                fontSize: '0.85rem',
                color: '#001d04',
                outline: 'none'
              }}
            />
          </div>

          {/* Categories Section */}
          <div style={{ 
            fontSize: '0.65rem', 
            fontWeight: 600, 
            textTransform: 'uppercase', 
            color: '#706F65', 
            letterSpacing: '0.15em',
            marginBottom: '1rem',
            paddingLeft: '0.5rem'
          }}>
            Shop by Category
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            {categoryMenu.map((cat) => {
              const Icon = cat.icon;
              // Check if URL matches the category
              const isActive = location.pathname === `/category/${cat.id}` || 
                              (cat.id === 'All' && location.pathname === '/' && false); // You can adjust active logic

              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  onClick={onClose}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    border: 'none',
                    borderRadius: '8px',
                    background: isActive ? '#001d04' : 'transparent',
                    color: isActive ? 'white' : '#001d04',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Icon size={20} strokeWidth={isActive ? 2 : 1.5} color={isActive ? 'white' : '#001d04'} />
                    <span style={{ fontSize: '1.05rem' }}>{cat.label}</span>
                  </div>
                  {isActive && <ChevronRight size={14} strokeWidth={2.5} color="white" />}
                </Link>
              );
            })}
            
            <Link
              to="/stores"
              onClick={onClose}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                border: 'none',
                borderRadius: '8px',
                background: location.pathname === '/stores' ? '#001d04' : 'transparent',
                color: location.pathname === '/stores' ? 'white' : '#001d04',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: location.pathname === '/stores' ? 600 : 400,
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                marginTop: '0.5rem',
                borderTop: '1px solid rgba(0, 29, 4, 0.05)',
                paddingTop: '1.2rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Store size={20} strokeWidth={location.pathname === '/stores' ? 2 : 1.5} color={location.pathname === '/stores' ? 'white' : '#001d04'} />
                <span style={{ fontSize: '1.05rem' }}>Available Stores</span>
              </div>
              <ChevronRight size={14} strokeWidth={1.5} color={location.pathname === '/stores' ? 'white' : '#706F65'} />
            </Link>
          </div>

          <div style={{ height: '2.5rem' }} />

          {/* My Account Section */}
          <div style={{ 
            fontSize: '0.65rem', 
            fontWeight: 600, 
            textTransform: 'uppercase', 
            color: '#706F65', 
            letterSpacing: '0.15em',
            marginBottom: '1rem',
            paddingLeft: '0.5rem'
          }}>
            My Account
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            {currentUser ? (
              <>
                <Link to="/profile" onClick={onClose} style={{ 
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 1rem', 
                  color: '#001d04', textDecoration: 'none', fontSize: '1.05rem', fontWeight: 400 
                }}>
                  <UserPlus size={20} strokeWidth={1.5} /> My Account
                </Link>
                <button 
                  onClick={() => { logout(); onClose(); }} 
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 1rem', 
                    color: '#001d04', fontSize: '1.05rem', fontWeight: 400,
                    background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left'
                  }}
                >
                  <LogOut size={20} strokeWidth={1.5} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" onClick={onClose} style={{ 
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 1rem', 
                  color: '#001d04', textDecoration: 'none', fontSize: '1.05rem', fontWeight: 400 
                }}>
                  <LogIn size={20} strokeWidth={1.5} /> Sign In
                </Link>
                <Link to="/register" onClick={onClose} style={{ 
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 1rem', 
                  color: '#001d04', textDecoration: 'none', fontSize: '1.05rem', fontWeight: 400 
                }}>
                  <UserPlus size={20} strokeWidth={1.5} /> Create Account
                </Link>
              </>
            )}
            {!loading && isAdmin && (
              <Link to="/admin" onClick={onClose} style={{ 
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 1rem', 
                color: '#001d04', textDecoration: 'none', fontSize: '1.05rem', fontWeight: 400 
              }}>
                <LayoutDashboard size={20} strokeWidth={1.5} /> Admin Panel
              </Link>
            )}
          </div>

          <div style={{ height: '3rem' }} />

          {/* Legal / Info Section */}
          <div style={{ 
            fontSize: '0.65rem', 
            fontWeight: 600, 
            textTransform: 'uppercase', 
            color: '#706F65', 
            letterSpacing: '0.15em',
            marginBottom: '0.5rem',
            paddingLeft: '0.5rem'
          }}>
            Information
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'About LuqmanGo', path: '/about' },
            { label: 'Privacy Policy', path: '/privacy' },
            { label: 'Terms of Service', path: '/terms' },
            { label: 'Delivery Policy', path: '/delivery-policy' }
          ].map((item) => (
            <Link key={item.label} to={item.path} onClick={onClose} style={{ 
              padding: '0.5rem 1rem', color: '#001d04', textDecoration: 'none', fontSize: '1rem', fontWeight: 400 
            }}>
              {item.label}
            </Link>
          ))}
          </div>

          {/* Support / Contact Section */}
          <div style={{ paddingLeft: '0.5rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: '#001d04' }}>
              Need Help?
            </div>
            <div style={{ color: '#706F65', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontWeight: 300 }}>
              <span>072 506 5252</span>
              <span>luqmangolk@gmail.com</span>
            </div>
          </div>
          
        </div>

        {/* Bottom Dark Block (Order via WhatsApp instead of Theme) */}
        <a 
          href="https://wa.me/94725065252" 
          target="_blank" 
          rel="noreferrer"
          style={{ 
            margin: '0.5rem 1.5rem 1.5rem',
            backgroundColor: isWaHovered ? '#003308' : '#001d04', 
            color: 'white', 
            borderRadius: '100px', // Pill shape for elegance
            padding: '0.75rem 1.25rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.6rem',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '0.75rem',
            letterSpacing: '0.15em', // Added elegant spacing
            textDecoration: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isWaHovered ? '0 10px 15px -3px rgba(0, 0, 0, 0.2)' : 'none',
            transform: isWaHovered ? 'translateY(-2px)' : 'none'
          }}
          onMouseEnter={() => setIsWaHovered(true)}
          onMouseLeave={() => setIsWaHovered(false)}
          onClick={onClose}
        >
          ORDER VIA WHATSAPP
        </a>

        {/* Social Icons at bottom of Drawer */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '2rem', 
          marginBottom: '1.5rem',
          opacity: 0.7 
        }}>
          <a 
            aria-label="Follow us on Instagram"
            href="https://www.instagram.com/luqmangolk?utm_source=qr&igsh=ZHduOXBueGZid3Nx" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: '#001d04', transition: 'opacity 0.2s' }}
          >
            <Instagram size={20} />
          </a>
          <a 
            aria-label="Follow us on Facebook"
            href="https://www.facebook.com/share/18PpDvHW8U/" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: '#001d04', transition: 'opacity 0.2s' }}
          >
            <Facebook size={20} />
          </a>
        </div>

      </div>
    </>
  );
};

export default SideDrawer;
