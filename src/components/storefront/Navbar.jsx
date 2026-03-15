import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { ShoppingCart, LayoutDashboard, Search, Moon, Sun, Phone, Menu, X } from 'lucide-react';

const categories = ['All', 'Electronics', 'Dresses', 'Groceries', 'Furniture', 'Home & Living'];

const Navbar = ({ onOpenDrawer }) => {
  const { getCartCount, searchQuery, setSearchQuery, theme, toggleTheme } = useShop();

  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
      {/* Top Bar - Main Header */}
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', padding: '0.75rem 0', borderBottom: '1px solid rgba(229, 231, 235, 0.5)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', height: '4rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Mobile Menu Toggle */}
            <button className="show-on-mobile" onClick={onOpenDrawer} style={{ background: 'none', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer', padding: '0.5rem 0' }}>
              <Menu size={28} />
            </button>

            {/* Logo with Text */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0, textDecoration: 'none' }}>
              <img src="/images/logo.jpg" alt="LuqmanGo Logo" style={{ height: '50px', objectFit: 'contain' }} className="logo-img-header" />
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className="hide-on-mobile">
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-secondary)', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                  LuqmanGo.lk
                </span>
                <span style={{ fontSize: '0.6rem', color: '#9CA3AF', fontWeight: 500 }}>
                  Shop. Click. Done.
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="nav-search-desktop hide-on-mobile" style={{ position: 'relative', flexGrow: 1, maxWidth: '500px', display: 'flex' }}>
            <input 
              type="text" 
              placeholder="Search for products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%',
                padding: '0 3.5rem 0 1.25rem', 
                borderRadius: '999px', 
                height: '40px', 
                fontSize: '0.85rem', 
                border: '2px solid #E5E7EB',
                backgroundColor: '#F8F9FA',
                outline: 'none',
                color: 'var(--color-text-main)',
                transition: 'border-color 0.3s, box-shadow 0.3s'
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 4px rgba(240, 125, 33, 0.1)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
            />
            <button style={{ 
              position: 'absolute', right: '4px', top: '4px', bottom: '4px', width: '32px', 
              background: 'linear-gradient(135deg, var(--color-primary), #E8651A)', 
              border: 'none', color: 'white', borderRadius: '50%',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Search size={14} strokeWidth={2.5} />
            </button>
          </div>

          {/* Right Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
            
            {/* Theme Toggle - Desktop */}
            <button 
              onClick={toggleTheme} 
              className="hide-on-mobile"
              style={{ background: 'none', border: 'none', color: '#4B5563', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              {theme === 'light' ? <Moon size={20} strokeWidth={1.5} /> : <Sun size={20} strokeWidth={1.5} />}
            </button>

            {/* Cart - Desktop */}
            <Link to="/cart" className="hide-on-mobile" style={{ position: 'relative', color: '#4B5563', display: 'flex', alignItems: 'center', padding: '0 0.5rem' }}>
              <ShoppingCart size={22} strokeWidth={1.5} />
              <span style={{ position: 'absolute', top: '-6px', right: '0px', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                {getCartCount()}
              </span>
            </Link>

            {/* Account - Desktop */}
            <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', fontWeight: 600, borderLeft: '1px solid #E5E7EB', paddingLeft: '1rem' }}>
              <Link to="/admin" style={{ color: 'var(--color-secondary)', textDecoration: 'none' }}>Admin</Link>
              <Link to="/signin" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Sign In</Link>
            </div>

            {/* User Avatar - Mobile (Reference Style) */}
            <Link to="/profile" className="show-on-mobile" style={{ textDecoration: 'none' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '50%', 
                background: 'linear-gradient(135deg, var(--color-secondary), var(--color-primary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}>
                AS
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar - Desktop ONLY */}
      <div style={{ backgroundColor: 'var(--color-secondary)' }} className="hide-on-mobile">
        <div className="container nav-cat-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.5rem', overflowX: 'auto', minHeight: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {categories.map((category, idx) => (
              <div key={category} style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={() => setActiveCategory(category)}
                  style={{
                    background: activeCategory === category ? 'var(--color-primary)' : 'transparent',
                    border: 'none',
                    padding: category === 'All' ? '0 1.5rem' : '0 1.25rem',
                    height: '40px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: activeCategory === category ? '#1A1A2E' : 'white',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'background 0.2s',
                    fontFamily: 'inherit',
                  }}
                >
                  {category}
                </button>
                {category !== 'All' && idx < categories.length - 1 && (
                  <div style={{ width: '1px', height: '14px', backgroundColor: 'rgba(255,255,255,0.15)' }}></div>
                )}
              </div>
            ))}
          </div>
          <a href="tel:0725065252" style={{ color: 'white', fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.35rem', paddingRight: '1rem', textDecoration: 'none' }}>
            Call Us: <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>072 506 5252</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
