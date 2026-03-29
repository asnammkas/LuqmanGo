import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, LayoutDashboard, Search, Moon, Sun, Phone, Menu, X } from 'lucide-react';

const categories = ['All', 'Electronics', 'Dresses', 'Groceries', 'Furniture', 'Home & Living'];

const Navbar = ({ onOpenDrawer }) => {
  const { getCartCount, toggleTheme, theme } = useShop();
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/category/All?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
      setSearchQuery('');
    }
  };

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
              marginLeft: '0.4em', /* Compensate for letter-spacing to ensure absolute center */
              textTransform: 'none',
              textAlign: 'center'
            }}>
              LuqmanGo
            </h1>
          </Link>
        </div>

        {/* Right: Cart & Admin */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.2rem' }}>
          
          {/* Search Icon & Expanding Input */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: isSearchExpanded ? 'white' : 'transparent',
                border: isSearchExpanded ? '1px solid rgba(0,0,0,0.1)' : 'none',
                padding: isSearchExpanded ? '0.5rem 0.8rem' : '0',
                borderRadius: '50px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                width: isSearchExpanded ? '220px' : '30px',
                overflow: 'hidden',
                boxShadow: isSearchExpanded ? '0 2px 10px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <button 
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer', padding: '0.4rem', display: 'flex', alignItems: 'center' }}
              >
                <Search size={20} strokeWidth={1.5} />
              </button>
              {isSearchExpanded && (
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Search store..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  onBlur={() => !searchQuery && setIsSearchExpanded(false)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '0.85rem',
                    color: '#001d04',
                    outline: 'none',
                    width: '100%',
                    marginLeft: '0.5rem'
                  }}
                />
              )}
            </div>
          </div>

          {!loading && isAdmin && (
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
          )}
          
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
