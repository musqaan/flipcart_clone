import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaHeart } from 'react-icons/fa'; // Added FaHeart for wishlist
import { CartContext } from '../context/CartContext';
import { SearchContext } from '../context/SearchContext';

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const { setGlobalSearch } = useContext(SearchContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [userType, setUserType] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { name, id, user_type } = JSON.parse(storedUser); // Changed userType to user_type to match backend
      setIsLoggedIn(true);
      setUsername(name);
      setUserId(id);
      setUserType(user_type);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // Also clear token for consistency
    setIsLoggedIn(false);
    setUsername("");
    setUserId("");
    setUserType("");
    navigate("/login");
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">Flipkart</Link>

        {/* Search */}
        <div className="flex-1 mx-4 hidden md:block">
          <input
            type="text"
            placeholder="Search for products, brands and more"
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full p-2 rounded-lg text-black focus:outline-none"
          />
        </div>

        {/* Right Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/products" className="hover:underline">Products</Link>

          {/* Wishlist (Visible to all) */}
          <Link to="/wishlist" className="flex items-center space-x-1 hover:underline">
            <FaHeart size={22} />
            <span>Wishlist</span>
          </Link>

          {/* Cart (Visible to all) */}
          <Link to="/cart" className="relative flex items-center space-x-1 hover:underline">
            <FaShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                {cartCount}
              </span>
            )}
            <span>Cart</span>
          </Link>

          {/* Customer-Specific Links */}
          {isLoggedIn && userType === "customer" && (
            <Link to={`/order-history/${userId}`} className="hover:underline">Orders</Link>
          )}

          {/* Admin-Specific Links */}
          {isLoggedIn && userType === "admin" && (
            <>
              <Link to="/admin-dashboard" className="hover:underline">Dashboard</Link>
             
            </>
          )}

          {/* Auth */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
              >
                <FaUserCircle size={18} />
                <span>{username}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-md z-10">
                  <Link to={`/profile/${userId}`} className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">
                <button className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200 transition">Login</button>
              </Link>
              <Link to="/signup">
                <button className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200 transition">Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;