import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useOrders } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import { Trash2, ArrowRight, CheckCircle, Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../../components/storefront/Footer';

const CartCheckout = () => {
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, clearCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { checkout } = useOrders();
  const toast = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', paymentMethod: 'Cash on Delivery' });

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    
    // 1. Format the cart items into a readable list
    let orderDetails = cart.map(item => `${item.quantity}x ${item.title} ($${item.price.toFixed(2)})`).join('%0A');
    
    // 2. Format the entire message
    const textMessage = `*📦 NEW ORDER - LuqmanGo*%0A%0A*👤 Customer Details*%0A━━━━━━━━━━━━━━%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Phone:* ${formData.phone}%0A*Address:* ${formData.address}%0A%0A*💳 Payment Method:* ${formData.paymentMethod}%0A%0A*🛒 Order Summary*%0A━━━━━━━━━━━━━━%0A${orderDetails}%0A%0A*💰 TOTAL AMOUNT: $${getCartTotal().toFixed(2)}*%0A%0A_Thank you for shopping with LuqmanGo!_`;
    
    // 3. Open WhatsApp Direct Link to Vendor
    const vendorPhone = "94725065252"; 
    window.open(`https://wa.me/${vendorPhone}?text=${textMessage}`, '_blank');
    
    // 4. Clear cart and show success screen
    checkout(formData, cart, getCartTotal());
    clearCart();
    toast.success('Order placed successfully!', 'Thank you for your purchase');
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center', maxWidth: '600px', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: '#128C7E' /* Standard WhatsApp Teal-Green */ }}>
          <CheckCircle size={80} strokeWidth={1.5} />
        </div>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-secondary)' }}>Order Sent to WhatsApp!</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem', fontSize: '1.125rem', lineHeight: 1.6 }}>
          Thank you for shopping at LuqmanGo. Your order details have been securely passed to our WhatsApp. Our team will message you shortly to confirm delivery!
        </p>
        <Link to="/" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: 700 }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container animate-fade-in" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem' }}>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 5rem', maxWidth: '1280px', width: '100%', boxSizing: 'border-box', margin: '0 auto', flex: 1 }}>
        
        {/* Editorial Header - Unified Pattern */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
          <Link 
            to="/"
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem', textDecoration: 'none' }}
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </Link>
          <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>Boutique Bag</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '2.5rem' }}>
          A final review of your chosen pieces before they reach your doorstep.
        </p>

        <div className="cart-content-wrapper cart-desktop-grid" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Cart Items */}
      <div className="cart-items-section">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.map(item => (
            <div key={item.id} className="card cart-item-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }} className="cart-item-inner">
                <img src={item.image} alt={item.title} className="cart-item-image" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
                <div style={{ flexGrow: 1, minWidth: 0 }} className="cart-item-details">
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</h3>
                  <p style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem' }}>${item.price.toFixed(2)}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="cart-item-controls">
                    {/* Quantity Controls */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      border: '1px solid var(--color-border)', 
                      borderRadius: 'var(--radius-md)', 
                      overflow: 'hidden',
                      height: '36px',
                      backgroundColor: '#FBF5EC'
                    }}>
                      <button 
                        style={{ 
                          width: '36px', height: '100%', border: 'none', 
                          background: '#FBF5EC', cursor: 'pointer', 
                          fontSize: '1rem', color: '#113013',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          borderRight: '1px solid var(--color-border)'
                        }} 
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <input 
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val >= 1) {
                            updateCartQuantity(item.id, val);
                          }
                        }}
                        style={{ 
                          width: '45px', 
                          height: '100%',
                          border: 'none',
                          textAlign: 'center',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          backgroundColor: 'transparent',
                          color: '#113013',
                          outline: 'none'
                        }}
                      />
                      <button 
                        style={{ 
                          width: '36px', height: '100%', border: 'none', 
                          background: '#FBF5EC', cursor: 'pointer', 
                          fontSize: '1rem', color: '#113013',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          borderLeft: '1px solid var(--color-border)'
                        }} 
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    {/* Delete Button */}
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, padding: '0.4rem' }}
                    >
                      <Trash2 size={16} /> <span className="hide-on-mobile">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Summary Sidebar */}
      <div className="card cart-summary-card" style={{ padding: '2rem', position: 'sticky', top: '7rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Order Summary</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
          <span>Subtotal</span>
          <span>${getCartTotal().toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '1.5rem 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 700 }}>
          <span>Total</span>
          <span style={{ color: 'var(--color-primary)' }}>${getCartTotal().toFixed(2)}</span>
        </div>

        {!isCheckingOut ? (
          <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} onClick={() => setIsCheckingOut(true)}>
            Proceed to Checkout <ArrowRight size={18} />
          </button>
        ) : (
          <form onSubmit={handleCheckoutSubmit} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <label className="label">Full Name</label>
              <input 
                required type="text" 
                className="input" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="John Doe" 
                style={{ backgroundColor: '#FBF5EC', border: '1px solid var(--color-border)' }}
              />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input 
                required type="email" 
                className="input" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                placeholder="john@example.com" 
                style={{ backgroundColor: '#FBF5EC', border: '1px solid var(--color-border)' }}
              />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input 
                required type="tel" 
                className="input" 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})} 
                placeholder="+94 7X XXX XXXX" 
                style={{ backgroundColor: '#FBF5EC', border: '1px solid var(--color-border)' }}
              />
            </div>
            <div>
               <label className="label">Shipping Address</label>
               <textarea 
                required 
                className="input" 
                rows="3" 
                value={formData.address} 
                onChange={e => setFormData({...formData, address: e.target.value})} 
                placeholder="123 Main St..."
                style={{ backgroundColor: '#FBF5EC', border: '1px solid var(--color-border)', resize: 'none' }}
               ></textarea>
            </div>
            
            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', color: '#706F65' }}>
                Payment Method
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['Cash on Delivery', 'Credit Card', 'Bank Transfer'].map((method) => (
                  <label 
                    key={method}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '1rem', 
                      borderRadius: 'var(--radius-md)', 
                      border: formData.paymentMethod === method ? '1px solid #113013' : '1px solid var(--color-border)',
                      backgroundColor: formData.paymentMethod === method ? '#FBF5EC' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        width: '18px', 
                        height: '18px', 
                        borderRadius: '50%', 
                        border: '1px solid #113013',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {formData.paymentMethod === method && (
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#113013' }} />
                        )}
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: formData.paymentMethod === method ? 600 : 400, color: '#113013' }}>
                        {method}
                      </span>
                    </div>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value={method} 
                      checked={formData.paymentMethod === method} 
                      onChange={() => setFormData({...formData, paymentMethod: method})} 
                      style={{ display: 'none' }}
                    />
                  </label>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className="btn"
              style={{ 
                width: '100%', 
                height: '3.5rem',
                backgroundColor: '#113013',
                color: 'white',
                borderRadius: 'var(--radius-md)',
                marginTop: '2rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.8rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.871 0 01-5.031-1.378l-.361-.214-3.741.983.998-3.648-.235-.374a9.86 9.861 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Confirm Order via WhatsApp
            </button>
          </form>
        )}
      </div>
    </div>
  </div>
  <Footer />
</div>
);
};

export default CartCheckout;
