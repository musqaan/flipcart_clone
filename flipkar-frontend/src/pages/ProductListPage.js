// src/pages/ProductListPage.js
import React, { useEffect, useState, useMemo, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { SearchContext } from "../context/SearchContext";

const ProductListPage = () => {
  const { globalSearch } = useContext(SearchContext);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Fetch products from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setAllProducts(data);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Filter by category
  const filteredByCategory = useMemo(() => {
    if (selectedCategory === "all") return allProducts;
    return allProducts.filter(
      (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [selectedCategory, allProducts]);

  // Filter by global search from Navbar
  const filteredBySearch = useMemo(() => {
    if (!globalSearch.trim()) return filteredByCategory;
    const searchTerm = globalSearch.toLowerCase();
    return filteredByCategory.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        (p.des && p.des.toLowerCase().includes(searchTerm))
    );
  }, [globalSearch, filteredByCategory]);

  // Sorting
  const sortedProducts = useMemo(() => {
    let sorted = [...filteredBySearch];
    if (sortOption === "lowToHigh") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === "highToLow") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortOption === "newest") {
      sorted.sort((a, b) => b.id - a.id); // Assuming higher id = newer
    }
    return sorted;
  }, [sortOption, filteredBySearch]);

  // Update displayed products
  useEffect(() => {
    setProducts(sortedProducts);
    setCurrentPage(1);
  }, [sortedProducts]);

  // Pagination
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  }, [currentPage]);

  // Handlers
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        {/* Left Sidebar with fixed width */}
        <div className="hidden md:flex flex-col border-r pr-4 w-64">
          <h3 className="text-lg font-semibold mb-3">Filter & Sort</h3>
          {/* Category Filter */}
          <div className="mb-3">
            <label className="block font-semibold mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="border p-1 rounded w-full"
            >
              <option value="all">All</option>
              <option value="electronics">Electronics</option>
              <option value="grocery">Grocery</option>
              <option value="clothing">Clothing</option>
              <option value="footwear">Footwear</option>
            </select>
          </div>
          {/* Sort Options */}
          <div>
            <label className="block font-semibold mb-1">Sort By</label>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border p-1 rounded w-full"
            >
              <option value="">Select</option>
              <option value="lowToHigh">Price Low to High</option>
              <option value="highToLow">Price High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Right Section: Product Grid */}
        <div className="flex-grow">
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <ProductCard product={product} />
                </Link>
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 space-x-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
