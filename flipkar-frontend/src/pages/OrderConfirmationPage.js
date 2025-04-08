import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { name, address } = location.state || {};

  const [orderCancelled, setOrderCancelled] = useState(false);

  // Current date and time
  const currentDate = new Date().toLocaleString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Expected delivery date (5 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  const formattedDeliveryDate = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Handle Cancel Order
  const handleCancelOrder = () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel your order?"
    );

    if (confirmCancel) {
      setOrderCancelled(true);
    }
  };

  if (orderCancelled) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="bg-red-100 p-6 rounded-md shadow-md">
          <h1 className="text-2xl font-bold text-red-600">Order Cancelled!</h1>
          <p className="mt-2 text-gray-700">
            Your order has been successfully canceled.
          </p>
        </div>

        {/* Back to Home Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition transform hover:scale-105"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-green-100 p-6 rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-green-600">Order Confirmed!</h1>
        <p className="mt-2 text-gray-700">
          Your order was placed on <strong>{currentDate}</strong>.<br />
          Expected delivery by <strong>{formattedDeliveryDate}</strong>.
        </p>
      </div>

      {/* Delivery Address */}
      <div className="mt-6 bg-white p-4 border rounded-md">
        <h2 className="text-lg font-semibold mb-2">Delivery Address</h2>
        <p><strong>{name || "Customer"}</strong></p>
        <p>{address || "Address not provided"}</p>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 text-center space-x-4">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition transform hover:scale-105"
        >
          Back to Home
        </button>

        <button
          onClick={handleCancelOrder}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition transform hover:scale-105"
        >
          Cancel Order
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
