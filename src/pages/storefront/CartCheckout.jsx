import { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Trash2, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartCheckout = () => {
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, checkout } = useShop();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', address: '', paymentMethod: 'Cash on Delivery' });

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    
    // 1. Format the cart items into a readable list
    let orderDetails = cart.map(item => `${item.quantity}x ${item.title} ($${item.price.toFixed(2)})`).join('%0A');
    
    // 2. Format the entire message
    const textMessage = `*NEW ORDER - LUQMANGO*%0A%0A*Customer Details:*%0AName: ${formData.name}%0AEmail: ${formData.email}%0AAddress: ${formData.address}%0A%0A*Payment Method:* ${formData.paymentMethod}%0A%0A*Order Summary:*%0A${orderDetails}%0A%0A*TOTAL: $${getCartTotal().toFixed(2)}*`;
    
    // 3. Open WhatsApp Direct Link to Vendor
    const vendorPhone = "94725065252"; 
    window.open(`https://wa.me/${vendorPhone}?text=${textMessage}`, '_blank');
    
    // 4. Clear cart and show success screen
    checkout(formData);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center', maxWidth: '600px', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: '#25D366' /* WhatsApp Green */ }}>
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
    <div className="container sidebar-layout animate-fade-in" style={{ padding: '4rem 1.5rem' }}>
      
      {/* Cart Items */}
      <div className="cart-items-section">
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Shopping Cart</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {cart.map(item => (
            <div key={item.id} className="card cart-item-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }} className="cart-item-inner">
                <img src={item.image} alt={item.title} className="cart-item-image" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
                <div style={{ flexGrow: 1, minWidth: 0 }} className="cart-item-details">
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</h3>
                  <p style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem' }}>${item.price.toFixed(2)}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="cart-item-controls">
                    {/* Quantity Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                      <button style={{ width: '32px', height: '32px', border: 'none', background: 'var(--color-bg-main)', cursor: 'pointer', fontSize: '1.25rem', fontWeight: 700 }} onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>−</button>
                      <span style={{ padding: '0 0.75rem', fontWeight: 600, fontSize: '0.9rem' }}>{item.quantity}</span>
                      <button style={{ width: '32px', height: '32px', border: 'none', background: 'var(--color-bg-main)', cursor: 'pointer', fontSize: '1.25rem', fontWeight: 700 }} onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>+</button>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
          <span>Subtotal</span>
          <span>${getCartTotal().toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
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
              <input required type="text" className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input required type="email" className="input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
            </div>
            <div>
               <label className="label">Shipping Address</label>
               <textarea required className="input" rows="3" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="123 Main St..."></textarea>
            </div>
            
            <div style={{ marginTop: '0.5rem' }}>
              <label className="label">Payment Method</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, paymentMethod: 'Cash on Delivery'})}
                  style={{ 
                    padding: '0.75rem 0.5rem', 
                    borderRadius: 'var(--radius-md)', 
                    border: formData.paymentMethod === 'Cash on Delivery' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: formData.paymentMethod === 'Cash on Delivery' ? 'rgba(240, 125, 33, 0.05)' : 'transparent',
                    cursor: 'pointer',
                    fontWeight: formData.paymentMethod === 'Cash on Delivery' ? 600 : 400,
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                >
                  Cash on Delivery
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, paymentMethod: 'Credit Card'})}
                  style={{ 
                    padding: '0.75rem 0.5rem', 
                    borderRadius: 'var(--radius-md)', 
                    border: formData.paymentMethod === 'Credit Card' ? '2px solid var(--color-secondary)' : '1px solid var(--color-border)',
                    backgroundColor: formData.paymentMethod === 'Credit Card' ? 'rgba(43, 57, 144, 0.05)' : 'transparent',
                    cursor: 'pointer',
                    fontWeight: formData.paymentMethod === 'Credit Card' ? 600 : 400,
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                >
                  Credit Card
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, paymentMethod: 'Bank Transfer'})}
                  style={{ 
                    padding: '0.75rem 0.5rem', 
                    borderRadius: 'var(--radius-md)', 
                    border: formData.paymentMethod === 'Bank Transfer' ? '2px solid #10B981' : '1px solid var(--color-border)',
                    backgroundColor: formData.paymentMethod === 'Bank Transfer' ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                    cursor: 'pointer',
                    fontWeight: formData.paymentMethod === 'Bank Transfer' ? 600 : 400,
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                >
                  Bank Transfer
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-secondary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
               Confirm Order via WhatsApp
            </button>
          </form>
        )}
      </div>

    </div>
  );
};

export default CartCheckout;
