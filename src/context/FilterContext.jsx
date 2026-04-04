import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const useFilter = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);

  const handleCategoryChange = (category) => {
    if (category === activeCategory) return;
    setIsCategoryLoading(true);
    setActiveCategory(category);
    setTimeout(() => {
      setIsCategoryLoading(false);
    }, 500);
  };

  const value = {
    searchQuery, setSearchQuery,
    activeCategory, setActiveCategory: handleCategoryChange,
    isCategoryLoading
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};
