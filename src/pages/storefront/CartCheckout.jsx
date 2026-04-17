import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { formatCurrency } from '../../utils/formatters';
import Footer from '../../components/storefront/Footer';
import CartItem from '../../components/storefront/CartItem';
import CheckoutForm from '../../components/storefront/CheckoutForm';
import styles from './CartCheckout.module.css';

// Define Robust Validation Schema
const checkoutSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address").or(z.literal('')).optional(),
  phone: z.string().regex(/^\+?[0-9]{10,14}$/, "Phone must be 10-14 digits (e.g. +947XXXXXXXX)"),
  address: z.string().min(10, "Address is too short"),
  orderNotes: z.string().max(500, "Notes are too long").optional(),
  paymentMethod: z.literal('Cash on Delivery')
});

const CartCheckout = () => {
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, clearCart } = useCart();
  const { checkout } = useOrders();
  const toast = useToast();
  const { currentUser } = useAuth();
  
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  const [formData, setFormData] = useState({ 
    name: currentUser?.displayName || '', 
    email: currentUser?.email || '', 
    phone: '+94', 
    address: '', 
    orderNotes: '', 
    paymentMethod: 'Cash on Delivery' 
  });
  
  // Update if auth resolves after mount
  useEffect(() => {
    if (currentUser && (!formData.email || formData.email !== currentUser.email)) {
      setFormData(prev => ({ 
        ...prev, 
        email: prev.email || currentUser.email || '', 
        name: prev.name || currentUser.displayName || '' 
      }));
    }
  }, [currentUser]); // Note: Excluding formData from deps purposefully to avoid infinite loops if it is edited later

  const [errors, setErrors] = useState({});

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const sanitizedData = {
      name: DOMPurify.sanitize(formData.name),
      email: DOMPurify.sanitize(formData.email),
      phone: DOMPurify.sanitize(formData.phone),
      address: DOMPurify.sanitize(formData.address),
      orderNotes: DOMPurify.sanitize(formData.orderNotes),
      paymentMethod: formData.paymentMethod
    };
    
    const validation = checkoutSchema.safeParse(sanitizedData);
    if (!validation.success) {
      const formattedErrors = validation.error.format();
      const newErrors = {};
      Object.keys(formattedErrors).forEach(key => {
        if (formattedErrors[key]._errors) {
          newErrors[key] = formattedErrors[key]._errors[0];
        }
      });
      setErrors(newErrors);
      toast.error('Please fix form errors', 'Checkout could not proceed');
      return;
    }

    setIsSubmitting(true); 
    
    try {
      const res = await checkout(sanitizedData, cart);
      const generatedOrderId = res;
      setOrderId(generatedOrderId);
      
      let orderDetails = cart.map(item => `${item.quantity}x ${item.title} (${formatCurrency(item.price)})`).join('%0A');
      const textMessage = `*📦 NEW ORDER - LuqmanGo*%0A%0A*👤 Customer Details*%0A━━━━━━━━━━━━━━%0A*Name:* ${sanitizedData.name}%0A*Email:* ${sanitizedData.email}%0A*Phone:* ${sanitizedData.phone}%0A*Address:* ${sanitizedData.address}%0A*Notes:* ${sanitizedData.orderNotes || "None"}%0A%0A*💳 Payment Method:* ${sanitizedData.paymentMethod}%0A%0A*🛒 Order Summary*%0A━━━━━━━━━━━━━━%0A${orderDetails}%0A%0A*💰 TOTAL AMOUNT: ${formatCurrency(getCartTotal())}*%0A%0A_Order ID: ${generatedOrderId}_%0A%0A_Thank you for shopping with LuqmanGo!_`;
      
      // Trigger WhatsApp immediately to avoid popup blockers
      const vendorPhone = import.meta.env.VITE_VENDOR_WHATSAPP || "94725065252"; 
      window.open(`https://wa.me/${vendorPhone}?text=${textMessage}`, '_blank', 'noopener,noreferrer');
      
      // Store message for fallback button in case popup was blocked
      window._lastOrderWA = `https://wa.me/${vendorPhone}?text=${textMessage}`;
      
      clearCart();
      toast.success('Order placed successfully!', 'Your stock is secured and vendor notified');
      setIsSuccess(true);
    } catch (e) {
      console.error("Checkout Error:", e);
      toast.error(
        e.message || 'Payment or Stock Validation Failed', 
        'Please check your items or contact support.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successIconWrapper}>
          <CheckCircle size={80} strokeWidth={1.5} />
        </div>
        <h2 className={styles.successTitle}>Order Sent to WhatsApp!</h2>
        <p className={styles.successDesc}>
          Thank you for shopping at LuqmanGo. Your order details have been securely passed to our WhatsApp. Our team will message you shortly to confirm delivery!
        </p>
        <div className={styles.orderIdBox}>
           <span className={styles.orderIdLabel}>Order ID: </span>
           <span className={styles.orderIdValue}>{orderId}</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <button 
            onClick={() => window.open(window._lastOrderWA, '_blank', 'noopener,noreferrer')}
            className="btn btn-secondary" 
            style={{ 
              backgroundColor: '#25D366', 
              color: 'white', 
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Resend to WhatsApp
          </button>
          
          <Link to="/" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: 700 }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className={`animate-fade-in ${styles.emptyContainer}`}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem' }}>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={`animate-fade-in ${styles.mainContainer}`}>
        
        {/* Editorial Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
          <Link to="/" className={styles.headerBackLink}>
            <ArrowLeft size={18} strokeWidth={2} />
          </Link>
          <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>Boutique Bag</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '2.5rem' }}>
          A final review of your chosen pieces before they reach your doorstep.
        </p>

        <div className={styles.cartGrid}>
      
          {/* Cart Items */}
          <div style={{ flex: 2 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.map(item => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  updateCartQuantity={updateCartQuantity} 
                  removeFromCart={removeFromCart} 
                />
              ))}
            </div>
          </div>

          {/* Checkout Summary Sidebar */}
          <div className={`card ${styles.summaryCard}`} style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
              <span>Subtotal</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#706F65' }}>LKR</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                  {Math.round(getCartTotal()).toLocaleString()}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '1.5rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 700 }}>
              <span>Total</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {formatCurrency(getCartTotal())}
                </span>
              </div>
            </div>

            <CheckoutForm 
              showForm={showCheckoutForm}
              setShowForm={setShowCheckoutForm}
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              isSubmitting={isSubmitting}
              onSubmit={handleCheckoutSubmit}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartCheckout;
