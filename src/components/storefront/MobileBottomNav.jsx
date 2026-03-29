import { Link, useLocation } from 'react-router-dom';
import { Heart, Store, User, Home } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const MobileBottomNav = ({ onOpenDrawer }) => {
  const { wishlist } = useShop();
  const location = useLocation();

  const navItems = [
    { name: 'HOME', path: '/', icon: Home },
    { name: 'STORES', path: '/stores', icon: Store },
    { name: 'WISHLIST', path: '/wishlist', icon: Heart },
    { name: 'ACCOUNT', path: '/profile', icon: User },
  ];

  return (
    <nav className="show-on-mobile" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '80px',
      backgroundColor: '#F7F3ED',
      borderTop: '1px solid rgba(0,0,0,0.03)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)',
      boxShadow: '0 -1px 10px rgba(0,0,0,0.03)'
    }}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = (item.path === '/' && location.pathname === '/') || 
                        (item.path !== '/' && item.path && location.pathname.startsWith(item.path));
        
        const content = (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            color: isActive ? '#0C2311' : '#706F65',
            position: 'relative',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            padding: '10px 0'
          }}>
            <Icon 
              size={22} 
              strokeWidth={isActive ? 2 : 1.5} 
              style={{ 
                opacity: isActive ? 1 : 0.8,
                color: (item.name === 'WISHLIST' && isActive) ? '#EF4444' : (isActive ? '#0C2311' : '#706F65')
              }} 
              fill={(item.name === 'WISHLIST' && isActive) ? '#EF4444' : 'transparent'}
            />
            <span style={{ 
              fontSize: '0.65rem', 
              fontWeight: 500, 
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              {item.name}
            </span>
            
          </div>
        );

        if (item.path) {
          return <Link key={item.name} to={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>{content}</Link>;
        }
        return <div key={item.name} onClick={item.onClick}>{content}</div>;
      })}
    </nav>
  );
};

export default MobileBottomNav;
