import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth, functions } from '../config/firebase';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const loadedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      loadedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(loadedOrders);
    });
    return () => unsubscribe();
  }, []);

  const checkout = async (customerInfo, cartItems, cartTotal) => {
    // ─── Phase 1: Backend Security Implementation ───────────────────
    // Pre-validation is good for UX, but the REAL validation now happens 
    // on the server to prevent price or stock manipulation.
    const validateAndCreateOrder = httpsCallable(functions, 'validateAndCreateOrder');
    
    try {
      const result = await validateAndCreateOrder({
        cart: cartItems,
        customerInfo: {
          ...customerInfo,
          userId: auth.currentUser?.uid || null
        }
      });

      return result.data.orderId;
    } catch (e) {
      console.error("Secure Checkout Failed: ", e);
      throw e;
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await setDoc(doc(db, 'orders', orderId), { status: newStatus }, { merge: true });
    } catch (e) {
      console.error("Error updating order status: ", e);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, checkout, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};
