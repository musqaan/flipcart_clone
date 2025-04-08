import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { default as Skeleton } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/orders?status=${statusFilter === "All" ? "" : statusFilter}`,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        console.log("Fetched orders:", data);
        setOrders(data);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error(`Error fetching orders: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [statusFilter]);

  const handleOpenModal = (order) => {
    console.log("Selected Order:", order); // Debug the order object
    setSelectedOrder(order);
  };
  const handleCloseModal = () => setSelectedOrder(null);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
      toast.success("Status updated successfully!");
    } catch (error) {
      toast.error(`Error updating status: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>
      <div className="mb-4">
        <label className="mr-2">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
          data-tooltip-id="status-filter-tooltip"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <Tooltip id="status-filter-tooltip" content="Filter orders by their current status" />
      </div>
      {loading ? (
        <Skeleton count={5} height={40} className="mb-2" />
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">User ID</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border">
                <td className="border p-2">{order.id}</td>
                <td className="border p-2">{order.user_id}</td>
                <td className="border p-2">{order.status}</td>
                <td className="border p-2">
                  <button
                    data-tooltip-id={`view-${order.id}`}
                    onClick={() => handleOpenModal(order)}
                    className="bg-blue-500 text-white p-1 rounded mr-2"
                  >
                    View Details
                  </button>
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    className="border p-1 rounded"
                    data-tooltip-id={`update-${order.id}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <Tooltip id={`view-${order.id}`} content="View detailed order information" />
                  <Tooltip id={`update-${order.id}`} content="Quickly update the order status" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-1/2">
            <h3 className="text-xl font-bold mb-2">Order Details</h3>
            <p><strong>Order ID:</strong> {selectedOrder.id}</p>
            <p><strong>User ID:</strong> {selectedOrder.user_id}</p>
            <p><strong>Product ID:</strong> {selectedOrder.product_id}</p>
            <p><strong>Quantity:</strong> {selectedOrder.quantity || "N/A"}</p>
            <p><strong>Total Price:</strong> ₹{typeof selectedOrder.total_price === "string" ? parseFloat(selectedOrder.total_price).toFixed(2) : selectedOrder.total_price?.toFixed(2) || "N/A"}</p>
            <p><strong>Date:</strong> {selectedOrder.order_date || "N/A"}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Address:</strong> {selectedOrder.address || "N/A"}</p>
            <button
              data-tooltip-id="close-modal"
              onClick={handleCloseModal}
              className="mt-4 bg-red-500 text-white p-2 rounded"
            >
              Close
            </button>
            <Tooltip id="close-modal" content="Close the order details modal" />
          </div>
        </div>
      )}
      <Tooltip />
    </div>
  );
};

export default OrderManagement;