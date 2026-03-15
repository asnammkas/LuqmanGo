import { Link } from 'react-router-dom';
import { X, Moon, Sun, Phone, Mail, Award, LayoutDashboard, ChevronRight, UserPlus, LogIn } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const SideDrawer = ({ isOpen, onClose }) => {
  const { activeCategory, setActiveCategory, theme, toggleTheme } = useShop();
  const categories = ['All', 'Electronics', 'Dresses', 'Groceries', 'Furniture', 'Home & Living'];

  if (!isOpen) return null;

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
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '85%',
        maxWidth: '320px',
        backgroundColor: 'var(--color-bg-card)',
        zIndex: 200,
        boxShadow: '4px 0 25px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '1.5rem', 
          borderBottom: '1px solid var(--color-border)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          backgroundColor: 'var(--color-secondary)',
          color: 'white'
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.5px', marginBottom: '2px' }}>
              <span style={{ color: 'white' }}>Luqman</span>
              <span style={{ color: 'var(--color-primary)' }}>Go</span>
            </div>
            <div style={{ fontSize: '0.7rem', opacity: 0.9, fontWeight: 500 }}>Shop. Click. Done.</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Categories Section */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 0' }}>
          <div style={{ padding: '0 1.5rem 0.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '1px' }}>
            Shop by Category
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); onClose(); }}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                border: 'none',
                background: activeCategory === cat ? 'rgba(240, 125, 33, 0.1)' : 'none',
                color: activeCategory === cat ? 'var(--color-primary)' : 'var(--color-text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: activeCategory === cat ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                borderLeft: activeCategory === cat ? '4px solid var(--color-primary)' : '4px solid transparent'
              }}
            >
              {cat}
              <ChevronRight size={16} opacity={0.5} />
            </button>
          ))}

          <div style={{ height: '1.5rem' }} />

          {/* More Links Section */}
          <div style={{ padding: '0 1.5rem 0.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '1px' }}>
            My Account
          </div>
          <Link to="/signin" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem', color: 'var(--color-text-main)', textDecoration: 'none', fontSize: '0.95rem' }}>
            <LogIn size={20} color="var(--color-primary)" /> Sign In
          </Link>
          <Link to="/register" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem', color: 'var(--color-text-main)', textDecoration: 'none', fontSize: '0.95rem' }}>
            <UserPlus size={20} color="var(--color-primary)" /> Create Account
          </Link>
          <Link to="/admin" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem', color: 'var(--color-text-main)', textDecoration: 'none', fontSize: '0.95rem' }}>
            <LayoutDashboard size={20} color="var(--color-secondary)" /> Admin Panel
          </Link>
          <div 
            onClick={() => { toggleTheme(); onClose(); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem', color: 'var(--color-text-main)', cursor: 'pointer', fontSize: '0.95rem' }}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </div>

          <div style={{ height: '1.5rem' }} />

          {/* Legal Section */}
          <div style={{ padding: '0 1.5rem 0.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '1px' }}>
            Information
          </div>
          {[
            { label: 'About LuqmanGo', path: '#' },
            { label: 'Privacy Policy', path: '#' },
            { label: 'Terms of Service', path: '#' },
            { label: 'Delivery Policy', path: '#' }
          ].map((item) => (
            <Link key={item.label} to={item.path} onClick={onClose} style={{ display: 'block', padding: '0.85rem 1.5rem', color: 'var(--color-text-main)', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8 }}>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Support Section - Premium Stick to Bottom */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-main)' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-text-main)' }}>Need Help?</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a href="tel:0725065252" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
                <Phone size={18} /> 072 506 5252
              </a>
              <a href="mailto:info@luqmango.lk" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
                <Mail size={18} /> info@luqmango.lk
              </a>
              <a href="https://wa.me/94725065252" target="_blank" rel="noreferrer" style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
                backgroundColor: '#128C7E', color: 'white', padding: '0.6rem', borderRadius: 'var(--radius-md)',
                textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700, marginTop: '0.25rem'
              }}>
                Order via WhatsApp
              </a>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.65rem', color: 'var(--color-text-muted)', opacity: 0.8 }}>
            <Award size={14} /> Official LuqmanGo Partner Store
          </div>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
