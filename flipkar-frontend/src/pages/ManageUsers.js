import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [newUser, setNewUser] = useState({ email: "", password: "", user_type: "user" });
    const [editUser, setEditUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, [navigate]);

    const fetchUsers = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/users", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to fetch users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:5000/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newUser),
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            setUsers([...users, { id: data.id, ...newUser }]);
            setNewUser({ email: "", password: "", user_type: "user" });
        } catch (error) {
            console.error("Error adding user:", error);
            setError("Failed to add user. Please try again.");
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:5000/api/users/${editUser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editUser),
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            await response.json();
            setUsers(users.map(u => u.id === editUser.id ? editUser : u));
            setEditUser(null);
        } catch (error) {
            console.error("Error updating user:", error);
            setError("Failed to update user. Please try again.");
        }
    };

    const handleDeleteUser = async (id) => {
        const token = localStorage.getItem("token");
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/users/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                await response.json();
                setUsers(users.filter(u => u.id !== id));
            } catch (error) {
                console.error("Error deleting user:", error);
                setError("Failed to delete user. Please try again.");
            }
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-4">Manage Users</h1>
            {loading && <div className="text-center my-4">Loading users...</div>}
            {error && !loading && <div className="text-red-500 text-center my-4">{error}</div>}
            {!loading && !error && (
                <>
                    {/* Add User Form */}
                    <div className="bg-white p-5 shadow-md rounded-md mb-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                            <FaPlus className="text-green-500" /> <span>Add New User</span>
                        </h3>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <input
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                placeholder="Email"
                                className="w-full p-2 border rounded"
                                required
                            />
                            <input
                                type="password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                placeholder="Password"
                                className="w-full p-2 border rounded"
                                required
                            />
                            <select
                                value={newUser.user_type}
                                onChange={(e) => setNewUser({ ...newUser, user_type: e.target.value })}
                                className="w-full p-2 border rounded"
                            >
                                <option value="customer">customer</option>
                                <option value="admin">Admin</option>
                            </select>
                            <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
                                Add User
                            </button>
                        </form>
                    </div>

                    {/* User List */}
                    <div className="bg-white p-5 shadow-md rounded-md">
                        <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                            <FaUsers className="text-blue-500" /> <span>User List</span>
                        </h3>
                        {users.length > 0 ? (
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border p-2">ID</th>
                                        <th className="border p-2">Email</th>
                                        <th className="border p-2">User Type</th>
                                        <th className="border p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td className="border p-2">{user.id}</td>
                                            <td className="border p-2">{user.email}</td>
                                            <td className="border p-2">{user.user_type}</td>
                                            <td className="border p-2">
                                                <button
                                                    onClick={() => setEditUser({ ...user })}
                                                    className="text-blue-500 mr-2"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="text-red-500"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No users found.</p>
                        )}
                    </div>

                    {/* Edit User Form (Modal or Inline) */}
                    {editUser && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-5 rounded shadow-md">
                                <h3 className="text-lg font-bold mb-4">Edit User</h3>
                                <form onSubmit={handleUpdateUser} className="space-y-4">
                                    <input
                                        type="email"
                                        value={editUser.email}
                                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                        placeholder="Email"
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                    <input
                                        type="password"
                                        value={editUser.password || ""}
                                        onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                                        placeholder="Password (leave blank to keep unchanged)"
                                        className="w-full p-2 border rounded"
                                    />
                                    <select
                                        value={editUser.user_type}
                                        onChange={(e) => setEditUser({ ...editUser, user_type: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="customer">customer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setEditUser(null)}
                                            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ManageUsers;