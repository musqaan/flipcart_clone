// src/components/ProductCard.js
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import { FaHeart, FaStar } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const { addToWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
    navigate("/wishlist");
  };

  return (
    <div
      className="rounded-md overflow-hidden group relative hover:shadow-md transition"
      style={{ maxWidth: "14rem" }}
    >
      <Link to={`/product/${product.id}`}>
        <div className="h-32 flex justify-center items-center">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-auto object-contain"
            loading="lazy"
          />
        </div>
        <div className="py-2 text-center">
          <h3 className="text-sm font-semibold">{product.name}</h3>
          <div className="flex justify-center items-center mt-1">
            <FaStar className="text-yellow-400 mr-1" size={12} />
            <span className="text-xs">{product.rating}</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">₹{product.price}</p>
        </div>
      </Link>
      <button
        onClick={handleWishlistClick}
        className="absolute bottom-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        <FaHeart size={12} />
      </button>
    </div>
  );
};

export default ProductCard;
