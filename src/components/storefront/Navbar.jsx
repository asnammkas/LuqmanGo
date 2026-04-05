import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, LayoutDashboard, Moon, Sun, Phone, Menu, X, Search } from 'lucide-react';
import SearchOverlay from './SearchOverlay';

const categories = ['All', 'Electronics', 'Dresses', 'Groceries', 'Furniture', 'Home & Living'];

const Navbar = ({ onOpenDrawer, onOpenSearch }) => {
  const { getCartCount } = useCart();
  const { toggleTheme, theme } = useTheme();
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  return (
    <header style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      backgroundColor: '#F7F3ED', 
      borderBottom: '1px solid rgba(0,0,0,0.03)',
      height: '70px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        width: '100%' 
      }}>
        
        {/* Left: Mobile/Desktop Navigation */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <button 
            onClick={onOpenDrawer} 
            className="show-on-mobile"
            style={{ background: 'none', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer', padding: '0.5rem', display: 'flex' }}
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
          
          <nav className="hide-on-mobile desktop-nav-links" style={{ display: 'none' }}>
            <Link to="/" className="desktop-nav-link">Home</Link>
            <Link to="/stores" className="desktop-nav-link">Stores</Link>
            <Link to="/wishlist" className="desktop-nav-link">Wishlist</Link>
            <Link to="/profile" className="desktop-nav-link">Account</Link>
          </nav>
        </div>

        {/* Center: Brand Name */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', justifyContent: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ 
              fontSize: '1.4rem', 
              fontWeight: 400, 
              letterSpacing: '0.4em', 
              color: 'var(--color-text-main)', 
              margin: 0,
              marginLeft: '0.4em', /* Compensate for letter-spacing to ensure absolute center */
              textTransform: 'none',
              textAlign: 'center'
            }}>
              LuqmanGo
            </h1>
          </Link>
        </div>

        {/* Right: Cart, Search & Admin */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>

          {!loading && isAdmin && (
            <Link to="/admin" className="hide-on-mobile" style={{ background: 'none', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer', padding: '0.4rem', display: 'flex', alignItems: 'center' }}>
              <LayoutDashboard size={20} strokeWidth={1.5} />
            </Link>
          )}

          <button 
            onClick={onOpenSearch} 
            className="hide-on-mobile"
            style={{ background: 'none', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer', padding: '0.4rem', display: 'flex', alignItems: 'center' }}
          >
            <Search size={22} strokeWidth={2} />
          </button>

          <Link to="/cart" style={{ position: 'relative', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', padding: '0.4rem' }}>
            <ShoppingBag size={22} strokeWidth={1.5} />
            {getCartCount() > 0 && (
              <span style={{ 
                position: 'absolute', top: '-4px', right: '-4px', 
                backgroundColor: '#00C853', color: 'white', 
                borderRadius: '50%', width: '16px', height: '16px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '9px', fontWeight: 'bold',
                boxShadow: '0 2px 5px rgba(0,200,83,0.3)'
              }}>
                {getCartCount()}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

