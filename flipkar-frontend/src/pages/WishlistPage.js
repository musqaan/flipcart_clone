// src/pages/WishlistPage.js
import React, { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);

  return (
    <div className="container mx-auto p-4">
      
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map((product) => (
            <div key={product.id} className="relative">
              <Link to={`/product/${product.id}`}>
                <ProductCard product={product} />
              </Link>
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
