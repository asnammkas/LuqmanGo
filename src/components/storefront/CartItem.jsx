import React from 'react';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import styles from '../../pages/storefront/CartCheckout.module.css';

const CartItem = ({ item, updateCartQuantity, removeFromCart }) => {
  return (
    <div className={`card ${styles.itemCard}`}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <img 
          src={item.image} 
          alt={item.title} 
          loading="lazy"
          className={styles.itemImage} 
        />
        <div className={styles.itemDetails}>
          <h3 className={styles.itemTitle}>{item.title}</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem', marginBottom: '0.75rem' }}>
            <span className={styles.itemPrice}>
              {formatCurrency(item.price)}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Quantity Controls */}
            <div className={styles.quantityControl}>
              <button 
                className={`${styles.quantityBtn} ${styles.quantityBtnLeft}`}
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
                  if (!isNaN(val)) {
                    const clamped = Math.max(1, Math.min(val, item.stock || 0));
                    updateCartQuantity(item.id, clamped);
                  }
                }}
                className={styles.quantityInput}
              />
              <button 
                className={`${styles.quantityBtn} ${styles.quantityBtnRight}`}
                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>
            {/* Delete Button */}
            <button 
              onClick={() => removeFromCart(item.id)}
              className={styles.deleteBtn}
            >
              <Trash2 size={16} /> <span className="hide-on-mobile">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
