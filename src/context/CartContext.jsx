import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
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
    
    setTimeout(() => {
      setCart((prevCart) => {
        let updated = false;
        const syncedCart = prevCart.map(item => {
          const liveProduct = products.find(p => p.id === item.id);
          if (liveProduct && liveProduct.price !== item.price) {
            updated = true;
            logger.info(`Automatically updated stale price in cart for: ${item.title}`);
            return { ...item, price: liveProduct.price };
          }
          return item;
        });
  
        return updated ? syncedCart : prevCart;
      });
    }, 0);
  }, [products]);

  useEffect(() => {
    localStorage.setItem('luqman_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateCartQuantity = useCallback((id, quantity) => {
    const clamped = Math.min(Math.max(Math.round(quantity), 0), 99);
    if (clamped <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: clamped } : item));
  }, [removeFromCart]);

  const toggleCart = useCallback((product) => {
    setCart((prevCart) => {
      const exists = prevCart.find(item => item.id === product.id);
      if (exists) {
        return prevCart.filter(item => item.id !== product.id);
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  }, []);

  const isInCart = useCallback((id) => {
    return !!cart.find(item => item.id === id);
  }, [cart]);

  const clearCart = useCallback(() => setCart([]), []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const getCartCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const value = useMemo(() => ({
    cart, addToCart, toggleCart, isInCart, updateCartQuantity, removeFromCart, clearCart, getCartTotal, getCartCount
  }), [cart, addToCart, toggleCart, isInCart, updateCartQuantity, removeFromCart, clearCart, getCartTotal, getCartCount]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
