import { Link, useLocation } from 'react-router-dom';
import { Heart, Store, User, Home, Search } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

const MobileBottomNav = ({ onOpenDrawer, onOpenSearch }) => {
  const { wishlist } = useWishlist();
  const location = useLocation();

  const navItems = [
    { name: 'HOME', path: '/', icon: Home },
    { name: 'STORES', path: '/stores', icon: Store },
    { name: 'SEARCH', onClick: onOpenSearch, icon: Search },
    { name: 'WISHLIST', path: '/wishlist', icon: Heart },
    { name: 'ACCOUNT', path: '/profile', icon: User },
  ];

  return (
    <nav className="show-on-mobile animate-fade-in" style={{
      position: 'fixed',
      bottom: '12px',
      left: '12px',
      right: '12px',
      height: '66px',
      backgroundColor: 'rgba(247, 243, 237, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 1000,
      paddingBottom: 0,
      boxShadow: '0 8px 32px rgba(0,29,4,0.12)',
    }}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.path && (
          (item.path === '/' && location.pathname === '/') || 
          (item.path !== '/' && location.pathname.startsWith(item.path))
        );
        
        const content = (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            color: isActive ? '#0C2311' : '#706F65',
            position: 'relative',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            width: '100%',
          }}>
            <Icon 
              size={22} 
              strokeWidth={isActive ? 2.5 : 1.8} 
              style={{ 
                color: (item.name === 'WISHLIST' && isActive) ? '#EF4444' : (isActive ? '#0C2311' : '#706F65'),
                transition: 'all 0.3s ease'
              }} 
              fill={(item.name === 'WISHLIST' && isActive) ? '#EF4444' : 'transparent'}
            />
            <span style={{ 
              fontSize: '0.58rem', 
              fontWeight: isActive ? 700 : 500, 
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              opacity: isActive ? 1 : 0.7,
              transition: 'all 0.3s ease'
            }}>
              {item.name}
            </span>
          </div>
        );

        if (item.onClick) {
          return (
            <button 
              key={item.name}
              onClick={item.onClick}
              style={{ 
                background: 'none', border: 'none', padding: 0, 
                color: 'inherit', flex: 1, display: 'flex', 
                justifyContent: 'center', height: '100%', cursor: 'pointer' 
              }}
            >
              {content}
            </button>
          );
        }

        return (
          <Link 
            key={item.name} 
            to={item.path} 
            style={{ 
              textDecoration: 'none', 
              color: 'inherit',
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              height: '100%'
            }}
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
};


export default MobileBottomNav;
