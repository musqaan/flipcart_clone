// src/pages/CategoryPage.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/category/${category}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching category products:", err));
  }, [category]);

  return (
    <div className="container mx-auto p-4">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to Home
      </Link>
      <h2 className="text-2xl font-bold mb-4 capitalize">{category} Products</h2>
      {products.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
