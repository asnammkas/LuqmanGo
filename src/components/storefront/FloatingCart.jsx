import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingCart = () => {
  const { cart, getCartTotal, getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const totalItems = getCartCount();
  const totalPrice = getCartTotal();

  // Hide on checkout page or if cart is empty
  const isCheckoutPage = location.pathname === '/cart';
  const isAdminPage = location.pathname.startsWith('/admin');
  
  if (totalItems === 0 || isCheckoutPage || isAdminPage) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          position: 'fixed',
          top: '82px', // Below navbar
          left: '1.5rem',
          right: '1.5rem',
          maxWidth: '280px',
          margin: '0 auto', // Centering on larger screens
          zIndex: 9990,
          pointerEvents: 'auto'
        }}
      >
        <button
          onClick={() => navigate('/cart')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center', // Centralized
            gap: '1rem', // Reduced gap
            padding: '0.6rem 1rem', // Reduced padding
            backgroundColor: '#DCD7BE', 
            color: '#000000',
            borderRadius: '20px',
            border: 'none',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            cursor: 'pointer',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Subtle Ambient Background Light */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', position: 'relative' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              backgroundColor: '#000000', 
              color: '#DCD7BE', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '0.9rem',
              fontWeight: 800,
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              flexShrink: 0
            }}>
              {totalItems}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
              <span style={{ 
                fontSize: '0.55rem', 
                fontWeight: 700, 
                opacity: 0.6, 
                textTransform: 'uppercase', 
                letterSpacing: '0.15em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
                textAlign: 'center'
              }}>
                Boutique Bag
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 800, whiteSpace: 'nowrap', letterSpacing: '-0.02em' }}>
                {formatCurrency(totalPrice)}
              </span>
            </div>
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingCart;
