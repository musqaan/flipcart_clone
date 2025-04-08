import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { default as Skeleton } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useNavigate } from "react-router-dom";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    role: "Product Manager",
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch admins
  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/admins", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch admins");
        const data = await response.json();
        setAdmins(data);
      } catch (error) {
        console.error("Fetch admins error:", error);
        toast.error(`Error fetching admins: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, [token]);

  // Add new admin
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/admins", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAdmin),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAdmins([...admins, data]);
      toast.success("Admin added successfully!");
      setShowModal(false);
      setNewAdmin({ name: "", email: "", password: "", role: "Product Manager" });
    } catch (error) {
      console.error("Add admin error:", error);
      toast.error(`Error adding admin: ${error.message}`);
    }
  };

  // Update admin role or status
  const handleUpdateAdmin = async (id, updates) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admins/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update admin");
      const updatedAdmin = await response.json();
      setAdmins(admins.map(admin => admin.id === id ? updatedAdmin : admin));
      toast.success("Admin updated successfully!");
    } catch (error) {
      console.error("Update admin error:", error);
      toast.error(`Error updating admin: ${error.message}`);
    }
  };

  // Delete admin
  const handleDeleteAdmin = async (id) => {
    console.log("Attempting to delete admin with ID:", id); // Debug log
    if (window.confirm("Are you sure you want to delete this admin? This action cannot be undone.")) {
      try {
        const response = await fetch(`http://localhost:5000/api/admins/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        setAdmins(admins.filter(admin => admin.id !== id));
        toast.success("Admin deleted successfully!");
      } catch (error) {
        console.error("Delete admin error:", error);
        toast.error(`Error deleting admin: ${error.message}`);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Admins</h2>
      <button
        onClick={() => setShowModal(true)}
        className="bg-green-500 text-white p-2 rounded mb-4"
        data-tooltip-id="add-admin-tooltip"
      >
        Add New Admin
      </button>
      <Tooltip id="add-admin-tooltip" content="Add a new admin user" />

      {loading ? (
        <Skeleton count={5} height={40} className="mb-2" />
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border">
                <td className="border p-2">{admin.name}</td>
                <td className="border p-2">{admin.email}</td>
                <td className="border p-2">
                  {admin.role === "Super Admin" && (
                    <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                      Super Admin
                    </span>
                  )}
                  {admin.role}
                </td>
                <td className="border p-2">{admin.status || "Active"}</td>
                <td className="border p-2">
                  <button
                    data-tooltip-id={`edit-${admin.id}`}
                    onClick={() => handleUpdateAdmin(admin.id, { role: prompt("New role:", admin.role) })}
                    className="bg-blue-500 text-white p-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    data-tooltip-id={`deactivate-${admin.id}`}
                    onClick={() => handleUpdateAdmin(admin.id, { status: admin.status === "Active" ? "Inactive" : "Active" })}
                    className="bg-red-500 text-white p-1 rounded mr-2"
                  >
                    {admin.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    data-tooltip-id={`delete-${admin.id}`}
                    onClick={() => handleDeleteAdmin(admin.id)}
                    className="bg-red-700 text-white p-1 rounded"
                  >
                    Delete
                  </button>
                  <Tooltip id={`edit-${admin.id}`} content="Edit admin role" />
                  <Tooltip id={`deactivate-${admin.id}`} content={admin.status === "Active" ? "Deactivate admin" : "Activate admin"} />
                  <Tooltip id={`delete-${admin.id}`} content="Delete admin" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-1/2">
            <h3 className="text-xl font-bold mb-2">Add New Admin</h3>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block">Name:</label>
                <input
                  type="text"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block">Email:</label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block">Password:</label>
                <input
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block">Role:</label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                  className="border p-2 rounded w-full"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Order Manager">Order Manager</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white p-2 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                  Add Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Tooltip />
    </div>
  );
};

export default ManageAdmins;