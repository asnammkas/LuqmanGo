import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../config/firebase';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';

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
    const orderId = `ord_${Date.now()}`;
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      customer: {
        ...customerInfo,
        userId: auth.currentUser?.uid || null
      },
      items: [...cartItems],
      total: cartTotal,
      status: 'Processing'
    };
    
    try {
      await setDoc(doc(db, 'orders', orderId), newOrder);
      return orderId;
    } catch (e) {
      console.error("Error creating order: ", e);
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
