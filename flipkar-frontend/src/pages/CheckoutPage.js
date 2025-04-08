import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const CheckoutPage = () => {
  const { cart, totalPrice, clearCart } = useContext(CartContext);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    paymentMethod: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading) {
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setError("Your cart is empty!");
      return;
    }

    if (!user) {
      setError("Please log in to place an order.");
      return;
    }

    if (!formData.address.trim() || !formData.name.trim() || !formData.paymentMethod) {
      setError("Please fill in all fields.");
      return;
    }

    const orderData = {
      userId: user.id,
      cartItems: cart.map((item) => ({
        id: item.id, // Match backend expectation
        quantity: item.quantity,
        price: Number(item.price), // Ensure number for backend
      })),
      address: formData.address.trim(),
      // Removed extra fields not used by backend yet
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        setError("");
        alert("Order placed successfully!");
        clearCart();
        navigate(`/order-history/${user.id}`);
      } else {
        setError(`Order failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setError(`Something went wrong. Please try again. Details: ${error.message}`);
    }
  };

  if (loading || authLoading) return <div className="container mx-auto p-4 text-center">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="flex flex-col md:flex-row gap-6">
        <form onSubmit={handlePlaceOrder} className="w-full md:w-1/2 bg-white shadow-lg rounded-lg p-6">
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          <div>
            <label className="block font-semibold mb-1">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select</option>
              <option value="card">Credit/Debit Card</option>
              <option value="netbanking">Net Banking</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded mt-4 hover:bg-blue-700 transition"
          >
            Place Order
          </button>
        </form>

        <div className="w-full md:w-1/2 bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-bold mb-2">Order Summary</h3>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="space-y-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-contain rounded"
                      loading="lazy"
                    />
                    <span className="text-sm">{item.name} (x{item.quantity})</span>
                  </div>
                  <span className="text-sm">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 font-bold text-right">
                Total: ₹{totalPrice}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;