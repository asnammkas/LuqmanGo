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
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          position: 'fixed',
          bottom: '85px', // Above mobile bottom nav
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 2rem)',
          maxWidth: '500px',
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
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <ShoppingBag size={22} strokeWidth={2} />
              <div style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#000000',
                color: '#FFFFFF',
                fontSize: '0.65rem',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}>
                {totalItems}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Your Boutique Bag
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                {formatCurrency(totalPrice)}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem', position: 'relative' }}>
            Review Bag
            <ArrowRight size={18} />
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingCart;
