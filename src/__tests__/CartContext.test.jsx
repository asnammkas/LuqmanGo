import { render, act, renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CartProvider, useCart } from '../context/CartContext';
import { ProductContext } from '../context/ProductContext';
import React from 'react';

// Mock ProductContext for CartProvider
const mockProductContext = {
  products: [
    { id: '1', title: 'Test Product', price: 100, category: 'Test' }
  ],
  isProductsLoading: false,
  productsError: null,
};

const wrapper = ({ children }) => (
  <ProductContext.Provider value={mockProductContext}>
    <CartProvider>
      {children}
    </CartProvider>
  </ProductContext.Provider>
);

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should start with an empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cart).toEqual([]);
    expect(result.current.getCartCount()).toBe(0);
    expect(result.current.getCartTotal()).toBe(0);
  });

  it('should add a product to the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product = { id: '1', title: 'Test Product', price: 100 };

    act(() => {
      result.current.addToCart(product, 1);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].id).toBe('1');
    expect(result.current.getCartCount()).toBe(1);
    expect(result.current.getCartTotal()).toBe(100);
  });

  it('should increase quantity when adding the same product', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product = { id: '1', title: 'Test Product', price: 100 };

    act(() => {
      result.current.addToCart(product, 1);
      result.current.addToCart(product, 2);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(3);
    expect(result.current.getCartCount()).toBe(3);
    expect(result.current.getCartTotal()).toBe(300);
  });

  it('should remove a product from the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product = { id: '1', title: 'Test Product', price: 100 };

    act(() => {
      result.current.addToCart(product, 1);
    });
    expect(result.current.cart).toHaveLength(1);

    act(() => {
      result.current.removeFromCart('1');
    });

    expect(result.current.cart).toHaveLength(0);
  });

  it('should clear the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product = { id: '1', title: 'Test Product', price: 100 };

    act(() => {
      result.current.addToCart(product, 1);
      result.current.clearCart();
    });

    expect(result.current.cart).toEqual([]);
  });

  it('should update cart quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product = { id: '1', title: 'Test Product', price: 100 };

    act(() => {
      result.current.addToCart(product, 1);
    });

    act(() => {
      result.current.updateCartQuantity('1', 5);
    });

    expect(result.current.cart[0].quantity).toBe(5);
    expect(result.current.getCartTotal()).toBe(500);
  });

  it('should persist to localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product = { id: '1', title: 'Test Product', price: 100 };

    act(() => {
      result.current.addToCart(product, 2);
    });

    const saved = JSON.parse(localStorage.getItem('luqman_cart'));
    expect(saved).toHaveLength(1);
    expect(saved[0].quantity).toBe(2);
  });
});
