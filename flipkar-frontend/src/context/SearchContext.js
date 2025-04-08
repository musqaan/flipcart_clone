// src/context/SearchContext.js
import React, { createContext, useState } from "react";

export const SearchContext = createContext();

const SearchProvider = ({ children }) => {
  const [globalSearch, setGlobalSearch] = useState("");

  return (
    <SearchContext.Provider value={{ globalSearch, setGlobalSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
