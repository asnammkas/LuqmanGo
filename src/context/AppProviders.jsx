import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { FilterProvider } from './FilterContext';
import { WishlistProvider } from './WishlistContext';
import { CartProvider } from './CartContext';
import { ProductProvider } from './ProductContext';
import { CategoryProvider } from './CategoryContext';
import { OrderProvider } from './OrderContext';
import { AuthProvider } from './AuthContext';

export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <FilterProvider>
          <ProductProvider>
            <CategoryProvider>
              <WishlistProvider>
                <CartProvider>
                  <OrderProvider>
                    {children}
                  </OrderProvider>
                </CartProvider>
              </WishlistProvider>
            </CategoryProvider>
          </ProductProvider>
        </FilterProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};
