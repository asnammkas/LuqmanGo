import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { db } from '../config/firebase';
import { query, collection, where, getDocs } from 'firebase/firestore';
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
  
  useEffect(() => {
    if (cart.length === 0) return;

    const verifyCartPrices = async () => {
      try {
        if (cart.length === 0) return;

        // Limit to first 30 items as 'in' query supports max 30 IDs
        // For a typical shopping cart 30 is more than enough.
        const ids = cart.slice(0, 30).map(item => item.id.toString());
        
        const q = query(
          collection(db, 'products'),
          where('__name__', 'in', ids)
        );

        const snapshot = await getDocs(q);
        const liveProducts = new Map(snapshot.docs.map(d => [d.id, d.data()]));
        
        let updated = false;
        const syncedCart = cart.map(item => {
          const liveData = liveProducts.get(item.id.toString());
          
          if (liveData) {
            const currentStock = liveData.stock || 0;
            const newQuantity = Math.min(item.quantity, currentStock);

            if (
              liveData.price !== item.price || 
              newQuantity !== item.quantity || 
              liveData.title !== item.title || 
              item.image !== liveData.image
            ) {
              updated = true;
              return { 
                ...item, 
                price: liveData.price, 
                title: liveData.title, 
                image: liveData.image, 
                stock: liveData.stock, 
                quantity: newQuantity 
              };
            }
            return item;
          } else {
            // Product not found in live data (was deleted)
            updated = true;
            return null;
          }
        }).filter(Boolean);

        if (updated) {
          setCart(syncedCart);
          logger.info("Cart batched synchronization complete.");
        }
      } catch (err) {
        logger.error("Failed to sync cart prices (batched):", err);
      }
    };

    verifyCartPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount to verify local storage cart

  useEffect(() => {
    localStorage.setItem('luqman_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.id === product.id);
      const stock = product.stock || 0;
      
      if (existing) {
        const newQuantity = Math.min(existing.quantity + quantity, stock);
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }
      
      const limitedQuantity = Math.min(quantity, stock);
      if (limitedQuantity <= 0) return prevCart; // Don't add if out of stock
      
      return [...prevCart, { ...product, quantity: limitedQuantity }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateCartQuantity = useCallback((id, quantity) => {
    const item = cart.find(i => i.id === id);
    const stock = item?.stock || 0;
    const clamped = Math.min(Math.max(Math.round(quantity), 0), stock);
    
    if (clamped <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: clamped } : item));
  }, [cart, removeFromCart]);

  const toggleCart = useCallback((product) => {
    setCart((prevCart) => {
      const exists = prevCart.find(item => item.id === product.id);
      if (exists) {
        return prevCart.filter(item => item.id !== product.id);
      }
      if (product.stock <= 0) {
        logger.info(`Cannot toggle out-of-stock item: ${product.title}`);
        return prevCart;
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
