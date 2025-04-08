// src/pages/CartPage.js
import React, { useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cart, updateCartQuantity, removeFromCart, totalPrice } = useContext(CartContext);

  useEffect(() => {
    console.log("CartPage - current cart:", cart);
  }, [cart]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>
          Your cart is empty.{" "}
          <Link to="/products" className="text-blue-600 underline">
            Go shopping
          </Link>
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between border p-4 rounded">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                    loading="lazy"
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">₹{item.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateCartQuantity(item.id, Number(e.target.value))
                    }
                    className="w-12 border p-1 text-center"
                  />
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-right">
            <h3 className="text-xl font-bold">Total: ₹{totalPrice}</h3>
            <Link
              to="/checkout"
              className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
