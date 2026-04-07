import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

const FilterContext = createContext();

export const useFilter = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const handleCategoryChange = useCallback((category) => {
    if (category === activeCategory) return;
    setActiveCategory(category);
  }, [activeCategory]);

  const value = useMemo(() => ({
    searchQuery, setSearchQuery,
    activeCategory, setActiveCategory: handleCategoryChange
  }), [searchQuery, setSearchQuery, activeCategory, handleCategoryChange]);

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};
