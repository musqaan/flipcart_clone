// src/components/CategorySection.js
import React from "react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Electronics", slug: "electronics", image: "/assets/mobiles.jpg" },
  { name: "Grocery", slug: "grocery", image: "/assets/kilos.jpg" },
  { name: "Clothing", slug: "clothing", image: "/assets/download.jpg" },
  { name: "Footwear", slug: "footwear", image: "/assets/p2.jpg" },
];

const CategorySection = () => {
  return (
    <div className="bg-gray-100 py-4">
      <div className="container mx-auto flex flex-wrap justify-around items-center">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className="flex flex-col items-center transform transition duration-300 hover:scale-105 m-2"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
            />
            <span className="mt-2 text-sm text-gray-700">{cat.name}</span>
          </Link>
        ))}
        {/* "View All Products" Link */}
        <Link
          to="/products"
          className="flex flex-col items-center transform transition duration-300 hover:scale-105 m-2"
        >
          <div className="w-16 h-16 flex items-center justify-center rounded-full border-2 border-gray-300 bg-white">
            <span className="text-xl font-bold text-blue-600">+</span>
          </div>
          <span className="mt-2 text-sm text-gray-700">View All</span>
        </Link>
      </div>
    </div>
  );
};

export default CategorySection;
