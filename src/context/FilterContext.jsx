import React, { createContext, useContext, useState, useMemo } from 'react';

const FilterContext = createContext();

export const useFilter = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const handleCategoryChange = (category) => {
    if (category === activeCategory) return;
    setActiveCategory(category);
  };

  const value = useMemo(() => ({
    searchQuery, setSearchQuery,
    activeCategory, setActiveCategory: handleCategoryChange
  }), [searchQuery, activeCategory]);

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};
