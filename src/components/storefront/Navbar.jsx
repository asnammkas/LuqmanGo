import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { ShoppingCart, LayoutDashboard, Search, Moon, Sun, Phone, Menu, X } from 'lucide-react';

const categories = ['All', 'Electronics', 'Dresses', 'Groceries', 'Furniture', 'Home & Living'];

const Navbar = () => {
  const { getCartCount, searchQuery, setSearchQuery, activeCategory, setActiveCategory, theme, toggleTheme } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
      {/* Top Bar - Main Header */}
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', padding: '0.75rem 0', borderBottom: '1px solid rgba(229, 231, 235, 0.5)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', height: '4rem' }}>
          
          {/* Logo with Text */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0, textDecoration: 'none' }}>
            <img src="/images/logo.jpg" alt="LuqmanGo Logo" style={{ height: '60px', objectFit: 'contain' }} />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-secondary)', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                LuqmanGo.lk
              </span>
              <span style={{ fontSize: '0.65rem', color: '#9CA3AF', fontWeight: 500 }}>
                Shop. Click. Done.
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="nav-search-desktop" style={{ position: 'relative', flexGrow: 1, maxWidth: '600px', display: 'flex' }}>
            <input 
              type="text" 
              placeholder="Search for products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%',
                padding: '0 3.5rem 0 1.25rem', 
                borderRadius: '999px', 
                height: '44px', 
                fontSize: '0.9rem', 
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
              position: 'absolute', right: '4px', top: '4px', bottom: '4px', width: '36px', 
              background: 'linear-gradient(135deg, var(--color-primary), #E8651A)', 
              border: 'none', color: 'white', borderRadius: '50%',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Search size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Right Icons (Matching Reference) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
            
            {/* Cart */}
            <Link to="/cart" style={{ position: 'relative', color: '#4B5563', display: 'flex', alignItems: 'center', borderRight: '1px solid #E5E7EB', paddingRight: '1.25rem' }}>
              <ShoppingCart size={24} strokeWidth={1.5} />
              <span style={{ position: 'absolute', top: '-6px', right: '12px', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                {getCartCount()}
              </span>
            </Link>

            {/* User & Theme Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '0.25rem' }}>
              <button 
                onClick={toggleTheme} 
                style={{ background: 'none', border: 'none', color: '#4B5563', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                aria-label="Toggle Theme"
                title="Toggle Dark Mode"
              >
                {theme === 'light' ? <Moon size={20} strokeWidth={1.5} /> : <Sun size={20} strokeWidth={1.5} />}
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 600 }}>
                <Link to="/admin" style={{ color: 'var(--color-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Admin
                </Link>
                <span style={{ color: '#E5E7EB' }}>|</span>
                <Link to="/profile" style={{ color: 'var(--color-text-main)', textDecoration: 'none' }}>Profile</Link>
                <span style={{ color: '#E5E7EB' }}>|</span>
                <Link to="/signin" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Sign In</Link>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="nav-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'none', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer', display: 'none' }}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div style={{ backgroundColor: 'var(--color-secondary)' }}>
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
                {/* Subtle divider line between categories (except after All and last) */}
                {category !== 'All' && idx < categories.length - 1 && (
                  <div style={{ width: '1px', height: '14px', backgroundColor: 'rgba(255,255,255,0.15)' }}></div>
                )}
              </div>
            ))}
          </div>
          <a href="tel:0725065252" className="nav-callus-desktop" style={{ color: 'white', fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.35rem', paddingRight: '1rem' }}>
            Call Us: <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>072 506 5252</span>
          </a>
        </div>
      </div>

      {/* Mobile Search - shown below bars */}
      <div className="nav-search-mobile" style={{ display: 'none', backgroundColor: 'var(--color-bg-card)', padding: '0.5rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search for products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input" 
            style={{ paddingRight: '2.5rem', borderRadius: 'var(--radius-md)', height: '2.25rem', fontSize: '0.8rem', border: '2px solid var(--color-primary)' }}
          />
          <button style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '2.25rem', backgroundColor: 'var(--color-primary)', border: 'none', borderRadius: '0 var(--radius-md) var(--radius-md) 0', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Search size={14} />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="nav-mobile-dropdown" style={{ backgroundColor: 'var(--color-bg-card)', borderBottom: '2px solid var(--color-primary)', padding: '1rem' }}>
          <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 0', fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
            <LayoutDashboard size={16} /> Admin Dashboard
          </Link>
          <a href="tel:0725065252" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 0', fontSize: '0.9rem', color: 'var(--color-primary)' }}>
            <Phone size={16} /> 072 506 5252
          </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;
