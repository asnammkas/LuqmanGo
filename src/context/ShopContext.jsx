import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockProducts } from '../data/mockProducts';
import { db } from '../config/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const ShopContext = createContext();

export const useShop = () => {
  return useContext(ShopContext);
};

export const ShopProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  // Sync state to local storage for cart and orders (Products are now in Firebase)

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('luqman_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('luqman_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState([]);

  // Products Firebase Listener & Auto-Seeder
  useEffect(() => {
    console.log("Initializing Firebase Product Listener...");
    // Add a fallback timeout if Firebase is slow or fails due to invalid keys
    const fallbackTimer = setTimeout(() => {
      if (isProductsLoading) {
        console.warn("Firebase connection timed out (15s). Falling back to mock data.");
        setProducts(mockProducts);
        setIsProductsLoading(false);
      }
    }, 15000);

    try {
      const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
        console.log("Firebase Snapshot received!", snapshot.empty ? "Empty" : "Data found");
        clearTimeout(fallbackTimer);
        if (snapshot.empty) {
          console.log("Seeding database with mock data...");
          // If database is completely empty, seed it with mockProducts automatically
          const seedDatabase = async () => {
            try {
              for (const p of mockProducts) {
                 // Use the existing mock ID so image links and categories stay intact
                 await setDoc(doc(db, 'products', p.id.toString()), p);
              }
              console.log("Database seeded successfully.");
            } catch (err) {
              console.error("Seeding failed:", err.message);
              // If seeding fails, we still need to finish loading
              setProducts(mockProducts);
              setIsProductsLoading(false);
            }
          };
          seedDatabase();
        } else {
          const loadedProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setProducts(loadedProducts);
          setIsProductsLoading(false);
        }
      }, (error) => {
        clearTimeout(fallbackTimer);
        console.error("Firebase Snapshot Error:", error.message, error.code);
        setProductsError(error.message);
        // Fallback on error too
        setProducts(mockProducts);
        setIsProductsLoading(false);
      });
      
      return () => {
        unsubscribe();
        clearTimeout(fallbackTimer);
      };
    } catch (err) {
      console.error("Error setting up onSnapshot:", err.message);
      setProducts(mockProducts);
      setIsProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('luqman_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('luqman_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Orders Firebase Listener
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const loadedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort to show newest orders first
      loadedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(loadedOrders);
    });
    return () => unsubscribe();
  }, []);

  // Product Actions (Firebase CRUD)
  const addProduct = async (product) => {
    try {
      const newId = Date.now().toString();
      await setDoc(doc(db, 'products', newId), { ...product, id: newId });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      await setDoc(doc(db, 'products', id), updatedFields, { merge: true });
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      // Also remove from cart if it was there
      setCart(prev => prev.filter(item => item.id !== id));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  // Cart Actions
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
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map(item => item.id === id ? { ...item, quantity } : item));
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

  // Wishlist Actions
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (id) => {
    return !!wishlist.find(item => item.id === id);
  };

  // Order Actions (Firebase CRUD)
  const checkout = async (customerInfo) => {
    const orderId = `ord_${Date.now()}`;
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      customer: customerInfo,
      items: [...cart],
      total: getCartTotal(),
      status: 'Processing',
      userId: currentUser?.uid || null
    };
    
    try {
      await setDoc(doc(db, 'orders', orderId), newOrder);
      clearCart();
    } catch (e) {
      console.error("Error creating order: ", e);
    }
    return orderId;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await setDoc(doc(db, 'orders', orderId), { status: newStatus }, { merge: true });
    } catch (e) {
      console.error("Error updating order status: ", e);
    }
  };

  // Search and Category Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);

  // Custom setter for category that introduces a graceful loading state
  const handleCategoryChange = (category) => {
    if (category === activeCategory) return;
    setIsCategoryLoading(true);
    setActiveCategory(category);
    setTimeout(() => {
      setIsCategoryLoading(false);
    }, 500); // 500ms simulated loading time
  };

  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('luqman_theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('luqman_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value = {
    products, addProduct, updateProduct, deleteProduct,
    cart, addToCart, toggleCart, isInCart, updateCartQuantity, removeFromCart, clearCart, getCartTotal, getCartCount,
    wishlist, toggleWishlist, isInWishlist,
    orders, checkout, updateOrderStatus,
    searchQuery, setSearchQuery,
    activeCategory, setActiveCategory: handleCategoryChange,
    isCategoryLoading, isProductsLoading, productsError,
    theme, toggleTheme
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};
