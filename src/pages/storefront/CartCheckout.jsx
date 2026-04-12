import { useState } from 'react';
import DOMPurify from 'dompurify';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
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
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[0-9]{10,14}$/, "Phone must be 10-14 digits (e.g. +947XXXXXXXX)"),
  address: z.string().min(10, "Address is too short"),
  orderNotes: z.string().max(500, "Notes are too long").optional(),
  paymentMethod: z.literal('Cash on Delivery')
});

const CartCheckout = () => {
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, clearCart } = useCart();
  const { checkout } = useOrders();
  const toast = useToast();
  
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '+94', address: '', orderNotes: '', paymentMethod: 'Cash on Delivery' });
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
      
      const vendorPhone = import.meta.env.VITE_VENDOR_WHATSAPP || "94725065252"; 
      setTimeout(() => {
        window.open(`https://wa.me/${vendorPhone}?text=${textMessage}`, '_blank');
      }, 1500);
      
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
        <Link to="/" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: 700 }}>
          Continue Shopping
        </Link>
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
