import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const OrderHistory = () => {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null); // For collapsible orders

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to view order history.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/orders/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch orders: ${errorText}`);
        }

        const data = await response.json();
        const formattedOrders = data.map((order) => ({
          ...order,
          total_price: parseFloat(order.total_price) || 0,
        }));
        setOrders(formattedOrders);
      } catch (error) {
        console.error("Order history error:", error);
        setError("Failed to load order history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const formatPrice = (price) => {
    return (parseFloat(price) || 0).toFixed(2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 text-lg">No orders found.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">
        Order History
      </h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300"
          >
            {/* Order Summary Header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-gray-100"
              onClick={() => toggleOrder(order.id)}
            >
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-800">
                  Order #{order.id}
                </p>
                <p className="text-sm text-gray-600">
                  {formatDate(order.order_date)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-medium text-gray-900">
                  ₹{formatPrice(order.total_price)}
                </p>
                <p
                  className={`text-sm ${
                    order.status === "Delivered"
                      ? "text-green-600"
                      : order.status === "Pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {order.status}
                </p>
              </div>
              <button className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none">
                {expandedOrder === order.id ? "▲" : "▼"}
              </button>
            </div>

            {/* Collapsible Order Details */}
            {expandedOrder === order.id && (
              <div className="p-4 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-700">
                      <span className="font-medium">Product ID:</span>{" "}
                      {order.product_id}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Quantity:</span>{" "}
                      {order.quantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      <span className="font-medium">Address:</span>{" "}
                      {order.address}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;