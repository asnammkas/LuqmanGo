import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../context/AuthContext';
import React from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';

// Mock Firebase
vi.mock('firebase/auth', () => ({
  auth: {},
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
}));

vi.mock('../config/firebase', () => ({
  auth: {},
  db: {},
}));

const wrapper = ({ children }) => (
  <AuthProvider>
    {children}
  </AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.loading).toBe(true);
    expect(result.current.currentUser).toBe(null);
  });

  it('should update user state when auth changes', async () => {
    let authCallback;
    onAuthStateChanged.mockImplementation((auth, callback) => {
      authCallback = callback;
      return () => {};
    });

    getDoc.mockResolvedValue({ exists: () => false });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      authCallback({ uid: '123', email: 'test@test.com' });
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.currentUser).toEqual({ uid: '123', email: 'test@test.com' });
    expect(result.current.isAdmin).toBe(false);
  });

  it('should identify admin users', async () => {
    let authCallback;
    onAuthStateChanged.mockImplementation((auth, callback) => {
      authCallback = callback;
      return () => {};
    });

    getDoc.mockResolvedValue({ exists: () => true });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      authCallback({ uid: 'admin-uid', email: 'admin@test.com' });
    });

    expect(result.current.isAdmin).toBe(true);
  });

  it('should handle login', async () => {
    signInWithEmailAndPassword.mockResolvedValue({ user: { uid: '123' } });
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@test.com', 'password');
    });

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(undefined, 'test@test.com', 'password');
  });

  it('should handle logout', async () => {
    signOut.mockResolvedValue();
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(signOut).toHaveBeenCalled();
  });
});
