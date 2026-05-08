import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';

// Pages where the floating cart should NOT appear
const HIDDEN_PATHS = [
  '/cart',
  '/profile',
  '/signin',
  '/register',
  '/about',
  '/privacy',
  '/terms',
  '/delivery-policy'
];

const FloatingCart = ({ isDrawerOpen = false, isSearchOpen = false }) => {
  const { cart, getCartTotal, getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const totalItems = getCartCount();
  const totalPrice = getCartTotal();

  // Hide conditions
  const isAdminPage = location.pathname.startsWith('/admin');
  const isHiddenPage = HIDDEN_PATHS.some(path => location.pathname.startsWith(path));
  const shouldHide = totalItems === 0 || isAdminPage || isHiddenPage || isDrawerOpen || isSearchOpen;

  return (
    <AnimatePresence>
      {!shouldHide && (
        <motion.div
          key="floating-cart"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          style={{
            position: 'fixed',
            top: '80px',
            left: 0,
            right: 0,
            width: 'fit-content',
            margin: '0 auto',
            zIndex: 9990,
            pointerEvents: 'auto'
          }}
        >
          <button
            onClick={() => navigate('/cart')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.75rem 0.4rem 0.5rem',
              backgroundColor: 'rgba(220, 215, 190, 0.95)',
              color: '#000000',
              borderRadius: '50px',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              whiteSpace: 'nowrap'
            }}
          >
            {/* Item count badge */}
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#000000',
              color: '#DCD7BE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 800,
              flexShrink: 0
            }}>
              {totalItems}
            </div>

            {/* Total price */}
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '-0.01em'
            }}>
              {formatCurrency(totalPrice)}
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCart;
