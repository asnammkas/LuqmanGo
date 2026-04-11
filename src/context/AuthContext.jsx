import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { logger } from '../utils/logger';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sign up with email, password, and display name
  const signup = useCallback(async (name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Set display name immediately after creation
    await updateProfile(userCredential.user, { displayName: name });
    return userCredential;
  }, []);

  // Sign in with email and password
  const login = useCallback(async (email, password, remember = false) => {
    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      logger.error("Login Error:", error);
      throw error;
    }
  }, []);

  // Sign out
  const logout = useCallback(() => {
    return signOut(auth);
  }, []);

  // Reset password
  const resetPassword = useCallback((email) => {
    return sendPasswordResetEmail(auth, email);
  }, []);

  // Login with Google
  const loginWithGoogle = useCallback(() => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }, []);

  // Check if user is admin by looking up in 'admins' collection
  const checkAdminStatus = useCallback(async (uid) => {
    try {
      const adminDoc = await getDoc(doc(db, 'admins', uid));
      return adminDoc.exists();
    } catch (error) {
      logger.error('Error checking admin status:', error);
      return false;
    }
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Always reset admin status immediately when auth state changes
      setIsAdmin(false);
      setCurrentUser(user);
      
      if (user) {
        const adminStatus = await checkAdminStatus(user.uid);
        setIsAdmin(adminStatus);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [checkAdminStatus]);

  const value = useMemo(() => ({
    currentUser,
    isAdmin,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    loginWithGoogle
  }), [currentUser, isAdmin, loading, signup, login, logout, resetPassword, loginWithGoogle]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
