import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { FilterProvider } from './FilterContext';
import { WishlistProvider } from './WishlistContext';
import { CartProvider } from './CartContext';
import { ProductProvider } from './ProductContext';
import { CategoryProvider } from './CategoryContext';
import { OrderProvider } from './OrderContext';

export const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <FilterProvider>
        <WishlistProvider>
          <CartProvider>
            <ProductProvider>
              <CategoryProvider>
                <OrderProvider>
                  {children}
                </OrderProvider>
              </CategoryProvider>
            </ProductProvider>
          </CartProvider>
        </WishlistProvider>
      </FilterProvider>
    </ThemeProvider>
  );
};
