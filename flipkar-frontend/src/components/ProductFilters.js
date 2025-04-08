// src/components/ProductFilters.js
import React, { useState } from "react";

const ProductFilters = ({ setProducts, allProducts }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleFilter = () => {
    let filtered = allProducts;
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.des && product.des.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setProducts(filtered);
  };

  // Update filters on change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    handleFilter();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    handleFilter();
  };

  return (
    <div className="flex flex-col md:flex-row items-center mb-4 space-y-2 md:space-y-0 md:space-x-4">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="border p-2 rounded w-full md:w-64"
      />
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="border p-2 rounded"
      >
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="grocery">Grocery</option>
        <option value="clothing">Clothing</option>
        <option value="footwear">Footwear</option>
      </select>
    </div>
  );
};

export default ProductFilters;
