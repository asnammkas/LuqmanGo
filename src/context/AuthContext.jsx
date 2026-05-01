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
  browserSessionPersistence,
  deleteUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { logger } from '../utils/logger';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState({ phone: '', address: '' });
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

  // Fetch user profile (phone, address) from Firestore
  const fetchUserProfile = useCallback(async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserProfile({
          phone: data.phone || '',
          address: data.address || ''
        });
      }
    } catch (error) {
      logger.error('Error fetching user profile:', error);
    }
  }, []);

  // Save phone & address to Firestore user profile
  const updateUserProfile = useCallback(async (profileData) => {
    if (!currentUser) return;
    try {
      await setDoc(doc(db, 'users', currentUser.uid), profileData, { merge: true });
      setUserProfile(prev => ({ ...prev, ...profileData }));
    } catch (error) {
      logger.error('Error updating user profile:', error);
    }
  }, [currentUser]);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Always reset admin status immediately when auth state changes
      setIsAdmin(false);
      setUserProfile({ phone: '', address: '' });
      setCurrentUser(user);
      
      if (user) {
        const adminStatus = await checkAdminStatus(user.uid);
        setIsAdmin(adminStatus);
        await fetchUserProfile(user.uid);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [checkAdminStatus, fetchUserProfile]);

  // Delete Account (GDPR Compliance)
  const deleteAccount = useCallback(async () => {
    if (!currentUser) return;
    try {
      // 1. Delete Firestore User Data first
      await deleteDoc(doc(db, 'users', currentUser.uid));
      // 2. Delete Auth Account (Requires recent login)
      await deleteUser(currentUser);
      logger.info("User account and data deleted successfully.");
    } catch (error) {
      logger.error("Account Deletion Error:", error);
      throw error;
    }
  }, [currentUser]);

  const value = useMemo(() => ({
    currentUser,
    isAdmin,
    userProfile,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    loginWithGoogle,
    deleteAccount,
    updateUserProfile
  }), [currentUser, isAdmin, userProfile, loading, signup, login, logout, resetPassword, loginWithGoogle, deleteAccount, updateUserProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
