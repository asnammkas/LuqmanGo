import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { db, auth, functions } from '../config/firebase';
import { collection, onSnapshot, query, where, orderBy, doc, setDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { useAuth } from './AuthContext';
import { logger } from '../utils/logger';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const { currentUser, isAdmin } = useAuth();

  useEffect(() => {
    // Don't subscribe if no user is logged in
    if (!currentUser) {
      setOrders([]);
      return;
    }

    let q;
    if (isAdmin) {
      // Admins see all orders, sorted by date
      q = query(collection(db, 'orders'), orderBy('date', 'desc'));
    } else {
      // Regular users only see their own orders
      q = query(
        collection(db, 'orders'),
        where('customer.userId', '==', currentUser.uid),
        orderBy('date', 'desc')
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedOrders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setOrders(loadedOrders);
      },
      (error) => {
        // Gracefully handle permission errors instead of crashing
        logger.error('Orders subscription error:', error.code);
        setOrders([]);
      }
    );

    return () => unsubscribe();
  }, [currentUser, isAdmin]);

  const checkout = async (customerInfo, cartItems) => {
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
      logger.error("Secure Checkout Failed:", e);
      throw e;
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await setDoc(doc(db, 'orders', orderId), { status: newStatus }, { merge: true });
    } catch (e) {
      logger.error("Error updating order status:", e);
    }
  };

  const value = useMemo(() => ({
    orders, checkout, updateOrderStatus
  }), [orders]);

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
