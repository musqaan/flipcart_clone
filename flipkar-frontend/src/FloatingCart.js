import React, { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";

const FloatingCart = () => {
  // Sample cart items count
  const [cartCount, setCartCount] = useState(3); // Replace with actual cart state

  return (
    <div className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-50">
      <button className="relative bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition">
        <FaShoppingCart size={24} />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default FloatingCart;
