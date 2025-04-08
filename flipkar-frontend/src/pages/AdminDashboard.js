import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBox, FaShoppingCart, FaUsers, FaSignOutAlt, FaBars, FaChartPie ,FaUserShield} from "react-icons/fa";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    salesData: [],
    returnsData: [],
    months: [],
    categorySales: [],
    categories: [],
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized access. Please login.");
        setLoading(false);
        return;
      }

      try {
        const analyticsResponse = await fetch("http://localhost:5000/api/admin/analytics", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!analyticsResponse.ok) {
          throw new Error(`Analytics HTTP error! Status: ${analyticsResponse.status}`);
        }

        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);

        const usersResponse = await fetch("http://localhost:5000/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!usersResponse.ok) {
          throw new Error(`Users HTTP error! Status: ${usersResponse.status}`);
        }

        const usersData = await usersResponse.json();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Polling for real-time updates
  useEffect(() => {
    const checkUpdates = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const interval = setInterval(async () => {
        try {
          // Check for new orders
          const newOrdersResponse = await fetch("http://localhost:5000/api/orders?status=Pending", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!newOrdersResponse.ok) {
            throw new Error(`Failed to fetch new orders: ${newOrdersResponse.status} - ${newOrdersResponse.statusText}`);
          }
          const newOrdersText = await newOrdersResponse.text(); // Get raw response
          const newOrders = newOrdersText ? JSON.parse(newOrdersText) : [];
          if (newOrders.length > 0 && newOrders.length !== analytics.totalOrders) {
            toast.info(`New order${newOrders.length > 1 ? 's' : ''} received! (${newOrders.length})`, {
              position: "top-right",
              autoClose: 5000,
            });
          }

          // Check for low stock products
          const lowStockResponse = await fetch("http://localhost:5000/api/products?stock_lt=5", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!lowStockResponse.ok) {
            throw new Error(`Failed to fetch low stock: ${lowStockResponse.status} - ${lowStockResponse.statusText}`);
          }
          const lowStockText = await lowStockResponse.text();
          const lowStockProducts = lowStockText ? JSON.parse(lowStockText) : [];
          if (lowStockProducts.length > 0) {
            toast.warning(`Stock below threshold for ${lowStockProducts.length} product${lowStockProducts.length > 1 ? 's' : ''}!`, {
              position: "top-right",
              autoClose: 5000,
            });
          }

          // Check for updated orders
          const updatedOrdersResponse = await fetch("http://localhost:5000/api/orders?updated=true", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!updatedOrdersResponse.ok) {
            throw new Error(`Failed to fetch updated orders: ${updatedOrdersResponse.status} - ${updatedOrdersResponse.statusText}`);
          }
          const updatedOrdersText = await updatedOrdersResponse.text();
          const updatedOrders = updatedOrdersText ? JSON.parse(updatedOrdersText) : [];
          if (updatedOrders.length > 0) {
            toast.success(`Order status changed for ${updatedOrders.length} order${updatedOrders.length > 1 ? 's' : ''}!`, {
              position: "top-right",
              autoClose: 5000,
            });
          }
        } catch (error) {
          console.error("Error checking updates:", error);
          if (error.message.includes("404")) {
            toast.error("API endpoint not found. Please check server configuration.", {
              position: "top-right",
              autoClose: 5000,
            });
          } else if (error.message.includes("500")) {
            toast.error("Server error while checking updates. Please try again later.", {
              position: "top-right",
              autoClose: 5000,
            });
          } else {
            toast.error("Failed to check updates. Please try again.", {
              position: "top-right",
              autoClose: 5000,
            });
          }
        }
      }, 30000); // Poll every 30 seconds

      return () => clearInterval(interval); // Cleanup interval on unmount
    };

    checkUpdates();
  }, [analytics.totalOrders]);

  const comparisonChartData = {
    labels: analytics.months,
    datasets: [
      {
        label: "Sales",
        data: analytics.salesData,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Returns",
        data: analytics.returnsData,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const pieChartData = {
    labels: analytics.categories,
    datasets: [
      {
        data: analytics.categorySales,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className={`bg-blue-900 text-white w-64 p-5 space-y-6 ${isSidebarOpen ? "block" : "hidden"} md:block`}>
        <h2 className="text-2xl font-bold text-center mb-4">Admin Panel</h2>
        <nav className="space-y-4">
          <Link to="/admin/manage-products" className="flex items-center space-x-2 p-2 hover:bg-blue-700 rounded-md">
            <FaBox /> <span>Manage Products</span>
          </Link>
          <Link to="/admin/orders" className="flex items-center space-x-2 p-2 hover:bg-blue-700 rounded-md">
            <FaShoppingCart /> <span>Manage Orders</span>
          </Link>
          <Link to="/admin/users" className="flex items-center space-x-2 p-2 hover:bg-blue-700 rounded-md">
            <FaUsers /> <span>Manage Users</span>
          </Link>
          <Link
                to="/admin/admins"
                className="flex items-center space-x-2 p-2 hover:bg-blue-700 rounded-md"
              >
                <FaUserShield /> <span>Manage Admins</span>
              </Link>
          <Link to="/" className="flex items-center space-x-2 p-2 hover:bg-blue-700 rounded-md">
            <FaSignOutAlt /> <span>Logout</span>
          </Link>
        </nav>
      </div>

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center bg-white p-4 shadow-md">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
            <FaBars size={24} />
          </button>
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>

        {loading && <div className="text-center my-4">Loading data...</div>}
        {error && !loading && <div className="text-red-500 text-center my-4">{error}</div>}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white p-5 shadow-md rounded-md">
                <h3 className="text-lg font-bold flex items-center space-x-2">
                  <FaUsers className="text-blue-500" /> <span>Total Users</span>
                </h3>
                <p className="text-2xl font-semibold mt-2">{analytics.totalUsers}</p>
              </div>
              <div className="bg-white p-5 shadow-md rounded-md">
                <h3 className="text-lg font-bold flex items-center space-x-2">
                  <FaShoppingCart className="text-green-500" /> <span>Total Orders</span>
                </h3>
                <p className="text-2xl font-semibold mt-2">{analytics.totalOrders}</p>
              </div>
              <div className="bg-white p-5 shadow-md rounded-md">
                <h3 className="text-lg font-bold flex items-center space-x-2">
                  <FaChartPie className="text-purple-500" /> <span>Total Revenue</span>
                </h3>
                <p className="text-2xl font-semibold mt-2">₹{analytics.totalRevenue}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white p-5 shadow-md rounded-md">
                <h3 className="text-lg font-bold mb-4">Sales vs Returns (Month-over-Month)</h3>
                <Bar
                  data={comparisonChartData}
                  options={{
                    responsive: true,
                    scales: { y: { beginAtZero: true } },
                    plugins: { legend: { position: "top" } },
                  }}
                />
              </div>
              <div className="bg-white p-5 shadow-md rounded-md">
                <h3 className="text-lg font-bold mb-4">Category-wise Sales</h3>
                <Pie
                  data={pieChartData}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: "top" } },
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-5 shadow-md rounded-md mt-6">
              <h3 className="text-lg font-bold mb-4">User List</h3>
              {users.length > 0 ? (
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2">ID</th>
                      <th className="border p-2">Email</th>
                      <th className="border p-2">User Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="border p-2">{user.id}</td>
                        <td className="border p-2">{user.email}</td>
                        <td className="border p-2">{user.user_type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No users found.</p>
              )}
            </div>
          </>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default AdminDashboard;