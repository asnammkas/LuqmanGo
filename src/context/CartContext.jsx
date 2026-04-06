import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProducts } from './ProductContext';
import { logger } from '../utils/logger';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('luqman_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const { products } = useProducts();

  useEffect(() => {
    if (!products || products.length === 0) return;
    
    let updated = false;
    const syncedCart = cart.map(item => {
      const liveProduct = products.find(p => p.id === item.id);
      if (liveProduct && liveProduct.price !== item.price) {
        updated = true;
        logger.info(`Automatically updated stale price in cart for: ${item.title}`);
        return { ...item, price: liveProduct.price };
      }
      return item;
    });

    if (updated) {
      setCart(syncedCart);
    }
  }, [products]);

  useEffect(() => {
    localStorage.setItem('luqman_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const updateCartQuantity = (id, quantity) => {
    const clamped = Math.min(Math.max(Math.round(quantity), 0), 99);
    if (clamped <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map(item => item.id === id ? { ...item, quantity: clamped } : item));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const toggleCart = (product) => {
    setCart((prevCart) => {
      const exists = prevCart.find(item => item.id === product.id);
      if (exists) {
        return prevCart.filter(item => item.id !== product.id);
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const isInCart = (id) => {
    return !!cart.find(item => item.id === id);
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart, addToCart, toggleCart, isInCart, updateCartQuantity, removeFromCart, clearCart, getCartTotal, getCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
