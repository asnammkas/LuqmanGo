import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { ShoppingBag, LayoutDashboard, Search, Moon, Sun, Phone, Menu, X } from 'lucide-react';

const categories = ['All', 'Electronics', 'Dresses', 'Groceries', 'Furniture', 'Home & Living'];

const Navbar = ({ onOpenDrawer }) => {
  const { getCartCount, toggleTheme, theme } = useShop();

  return (
    <header style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      backgroundColor: '#fff8f1', 
      borderBottom: '1px solid var(--color-border)',
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
        
        {/* Left: Mobile Menu */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <button 
            onClick={onOpenDrawer} 
            style={{ background: 'none', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer', padding: '0.5rem' }}
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
          
        </div>

        {/* Center: Brand Name */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ 
              fontSize: '1.4rem', 
              fontWeight: 400, 
              letterSpacing: '0.4em', 
              color: 'var(--color-text-main)', 
              margin: 0,
              textTransform: 'none',
              textAlign: 'center'
            }}>
              LuqmanGo
            </h1>
          </Link>
        </div>

        {/* Right: Cart & Admin */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/admin" className="hide-on-mobile" style={{ 
            fontSize: '0.75rem', 
            fontWeight: 500, 
            letterSpacing: '0.1em', 
            textTransform: 'uppercase', 
            color: 'var(--color-text-muted)',
            textDecoration: 'none'
          }}>
            Admin
          </Link>
          
          <Link to="/cart" style={{ position: 'relative', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center' }}>
            <ShoppingBag size={22} strokeWidth={1.5} />
            {getCartCount() > 0 && (
              <span style={{ 
                position: 'absolute', top: '-8px', right: '-8px', 
                backgroundColor: 'var(--color-text-main)', color: 'white', 
                borderRadius: '50%', width: '16px', height: '16px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '10px', fontWeight: 'bold' 
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
