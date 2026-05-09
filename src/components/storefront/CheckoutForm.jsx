import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../../pages/storefront/CartCheckout.module.css';
import LocationPickerMap from './LocationPickerMap';

const CheckoutForm = ({ formData, setFormData, errors, isSubmitting, onSubmit, showForm, setShowForm, currentUser }) => {
  const location = useLocation();

  if (!showForm) {
    if (!currentUser) {
      return (
        <div style={{ textAlign: 'center', padding: '1.5rem', background: '#F9F7F2', borderRadius: '16px', border: '1px dashed var(--color-accent-sage)' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', marginBottom: '1.25rem', fontWeight: 500 }}>
            Sign in to your account to complete your purchase and secure your items.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <Link to="/signin" state={{ from: location }} className="btn btn-primary" style={{ padding: '0.8rem' }}>
              Sign In
            </Link>
            <Link to="/register" state={{ from: location }} className="btn btn-outline" style={{ padding: '0.8rem', background: 'white' }}>
              Create Account
            </Link>
          </div>
        </div>
      );
    }

    return (
      <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} onClick={() => setShowForm(true)}>
        Proceed to Checkout <ArrowRight size={18} />
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`animate-fade-in ${styles.checkoutForm}`}>
      <div>
        <label className="label" htmlFor="checkout-name">Full Name</label>
        <input 
          id="checkout-name"
          required type="text" className={`input ${styles.formInput}`}
          value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
          placeholder="John Doe" style={{ border: errors.name ? '1px solid #EF4444' : '1px solid var(--color-border)' }}
        />
        {errors.name && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name}</p>}
      </div>
      <div>
        <label className="label" htmlFor="checkout-email">Email Address <span style={{fontSize: '0.8rem', color: '#9CA3AF', fontWeight: 'normal'}}>(Optional)</span></label>
        <input 
          id="checkout-email"
          type="email" className={`input ${styles.formInput}`}
          value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} 
          placeholder="john@example.com" style={{ border: errors.email ? '1px solid #EF4444' : '1px solid var(--color-border)' }}
        />
        {errors.email && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email}</p>}
      </div>
      <div>
        <label className="label" htmlFor="checkout-phone">Phone Number</label>
        <input 
          id="checkout-phone"
          required type="tel" className={`input ${styles.formInput}`}
          value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} 
          placeholder="+94 7X XXX XXXX" style={{ border: errors.phone ? '1px solid #EF4444' : '1px solid var(--color-border)' }}
        />
        {errors.phone && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.phone}</p>}
      </div>
      <div>
        <label className="label" htmlFor="checkout-address">Shipping Address</label>
        <textarea 
          id="checkout-address"
          required className={`input ${styles.formInput}`} rows="3" 
          value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} 
          placeholder="123 Main St..." style={{ border: errors.address ? '1px solid #EF4444' : '1px solid var(--color-border)', resize: 'none' }}
        />
        {errors.address && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.address}</p>}
      </div>

      <div style={{ marginTop: '0.5rem', background: '#f5f4ef', borderRadius: '8px', padding: '1rem', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: formData.shareLocation ? '1rem' : '0' }}>
          <input 
            type="checkbox" 
            id="checkout-share-location" 
            checked={formData.shareLocation || false}
            onChange={(e) => setFormData({...formData, shareLocation: e.target.checked})}
            style={{ accentColor: '#113013', width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <label htmlFor="checkout-share-location" style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            📌 Pin exact delivery location on map
          </label>
        </div>
        
        {formData.shareLocation && (
          <div className="animate-fade-in">
            <LocationPickerMap 
              initialLocation={formData.deliveryLocation}
              onLocationSelect={(loc) => setFormData({ ...formData, deliveryLocation: loc })} 
            />
          </div>
        )}
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <label className="label" htmlFor="checkout-notes">Special Instructions / Order Notes (Optional)</label>
        <textarea 
          id="checkout-notes"
          className={`input ${styles.formInput}`} rows="2" 
          value={formData.orderNotes} onChange={e => setFormData({...formData, orderNotes: e.target.value})} 
          placeholder="e.g., Leave package at the back door..." style={{ border: errors.orderNotes ? '1px solid #EF4444' : '1px solid var(--color-border)', resize: 'none' }}
        />
        {errors.orderNotes && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.orderNotes}</p>}
      </div>
      
      <div className={styles.paymentMethodBlock}>
        <label className={styles.paymentMethodLabel}>Payment Method</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {['Cash on Delivery', 'Credit Card', 'Bank Transfer'].map((method) => {
            const isActive = formData.paymentMethod === method;
            return (
              <label key={method} className={`${styles.paymentRadioOption} ${isActive ? styles.paymentRadioOptionActive : styles.paymentRadioOptionInactive}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: method !== 'Cash on Delivery' ? 0.5 : 1 }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1px solid #113013', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isActive && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#113013' }} />}
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 400, color: '#113013' }}>
                    {method} {method !== 'Cash on Delivery' && '(Coming Soon)'}
                  </span>
                </div>
                <input 
                  type="radio" name="paymentMethod" value={method} checked={isActive} disabled={method !== 'Cash on Delivery'}
                  onChange={e => setFormData({...formData, paymentMethod: e.target.value})} style={{ display: 'none' }}
                />
              </label>
            );
          })}
        </div>
      </div>

      <button 
        type="submit" disabled={isSubmitting} className={styles.submitBtn}
        style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
      >
        {isSubmitting ? (
          <>
            <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            Validating Secure Order...
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.871 0 01-5.031-1.378l-.361-.214-3.741.983.998-3.648-.235-.374a9.86 9.861 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Confirm Order via WhatsApp
          </>
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;
