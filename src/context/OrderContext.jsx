import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { db, auth, functions } from '../config/firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
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
      setTimeout(() => setOrders([]), 0);
      return;
    }

    let q;
    if (isAdmin) {
      // Admins see all orders. Sorted client-side to ensure nothing is excluded.
      q = query(collection(db, 'orders'));
    } else {
      // Regular users only see their own orders. 
      // Query without orderBy to avoid needing a composite index while it builds on the server.
      q = query(
        collection(db, 'orders'),
        where('customer.userId', '==', currentUser.uid)
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let loadedOrders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        
        // Sort client-side to ensure newest orders appear first for everyone
        loadedOrders.sort((a, b) => {
          const dateA = a.date?.toMillis ? a.date.toMillis() : 0;
          const dateB = b.date?.toMillis ? b.date.toMillis() : 0;
          // Fallback to ID sorting if timestamps are identical or missing
          if (dateA === dateB) {
            return a.id < b.id ? 1 : -1;
          }
          return dateB - dateA;
        });
        
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

  const checkout = useCallback(async (customerInfo, cartItems) => {
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
  }, []);

  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    try {
      const setStatusFunc = httpsCallable(functions, 'updateOrderStatus');
      await setStatusFunc({ orderId, newStatus });
    } catch (e) {
      logger.error("Error securely updating order status:", e);
      throw e;
    }
  }, []);

  const deleteOrder = useCallback(async (orderId) => {
    try {
      const manageOrderFunc = httpsCallable(functions, 'manageOrder');
      await manageOrderFunc({ action: 'delete', id: orderId });
    } catch (e) {
      logger.error("Error securely deleting order:", e);
      throw e;
    }
  }, []);

  const deleteAllOrders = useCallback(async () => {
    try {
      const manageOrderFunc = httpsCallable(functions, 'manageOrder');
      const result = await manageOrderFunc({ action: 'deleteAll' });
      return result.data.deletedCount;
    } catch (e) {
      logger.error("Error securely deleting all orders:", e);
      throw e;
    }
  }, []);

  const value = useMemo(() => ({
    orders, checkout, updateOrderStatus, deleteOrder, deleteAllOrders
  }), [orders, checkout, updateOrderStatus, deleteOrder, deleteAllOrders]);

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
