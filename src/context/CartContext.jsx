import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
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
        let updated = false;
        const syncedCart = await Promise.all(cart.map(async (item) => {
          const docRef = doc(db, 'products', item.id.toString());
          const snapshot = await getDoc(docRef);
          if (snapshot.exists()) {
            const liveData = snapshot.data();
            const currentStock = liveData.stock || 0;
            const newQuantity = Math.min(item.quantity, currentStock);

            if (
              liveData.price !== item.price || 
              newQuantity !== item.quantity || 
              liveData.title !== item.title || 
              item.image !== liveData.image
            ) {
              updated = true;
              logger.info(`Automatically updated stale cart item: ${item.title}`);
              return { 
                ...item, 
                price: liveData.price, 
                title: liveData.title, 
                image: liveData.image, 
                stock: liveData.stock, 
                quantity: newQuantity 
              };
            }
          } else {
            // Product was deleted from database
            updated = true;
            logger.info(`Removed deleted product from cart: ${item.title}`);
            return null;
          }
          return item;
        }));
        
        if (updated) {
           const finalCart = syncedCart.filter(Boolean);
           setCart(finalCart);
           logger.info("Cart fully synchronized with live server data.");
        }
      } catch(err) {
        logger.error("Failed to sync cart prices with server:", err);
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
