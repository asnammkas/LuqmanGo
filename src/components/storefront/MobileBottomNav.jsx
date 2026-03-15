import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, User, Menu } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const MobileBottomNav = ({ onOpenDrawer }) => {
  const location = useLocation();
  const { getCartCount } = useShop();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Categories', onClick: onOpenDrawer, icon: Menu },
    { name: 'Cart', path: '/cart', icon: ShoppingCart, badge: getCartCount() },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="show-on-mobile" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '70px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(229, 231, 235, 0.5)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 100,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        const content = (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: isActive ? 'var(--color-primary)' : '#6B7280',
            position: 'relative',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span style={{ fontSize: '0.65rem', fontWeight: isActive ? 700 : 500 }}>{item.name}</span>
            {item.badge > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '4px',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white'
              }}>
                {item.badge}
              </span>
            )}
            {isActive && (
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)'
              }} />
            )}
          </div>
        );

        if (item.path) {
          return <Link key={item.name} to={item.path} style={{ textDecoration: 'none' }}>{content}</Link>;
        }
        return <div key={item.name} onClick={item.onClick}>{content}</div>;
      })}
    </nav>
  );
};

export default MobileBottomNav;
