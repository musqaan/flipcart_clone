import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetails from "./pages/ProductDetails";
import CategoryPage from "./pages/CategoryPage";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";
import AdminDashboard from "./pages/AdminDashboard";
import ManageProducts from "./pages/ManageProducts";
import ManageUsers from "./pages/ManageUsers";
import OrderManagement from "./pages/OrderManagement"; // Import OrderManagement
import CartProvider from "./context/CartContext";
import SearchProvider from "./context/SearchContext";
import WishlistProvider from "./context/WishlistContext";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./components/AdminRoute"; // ✅ Using this now
import ManageAdmins from "./pages/ManageAdmins";

function AppContent() {
  const location = useLocation();

  const adminPages = [
    "/admin-dashboard",
    "/admin/manage-products",
    "/admin/users",
    "/admin/orders", // Add /admin/orders to hide footer for this page
  ];
  const authPages = ["/signup", "/login"];
  const hideFooter =
    adminPages.includes(location.pathname) || authPages.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/order-history/:userId" element={<OrderHistory />} />
          <Route path="/admin" element={<Navigate to="/admin-dashboard" />} />

          {/* Protected Routes */}
          <Route
            path="/checkout"
            element={<PrivateRoute><CheckoutPage /></PrivateRoute>}
          />
          <Route
            path="/order-confirmation"
            element={<PrivateRoute><OrderConfirmationPage /></PrivateRoute>}
          />

          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={<AdminRoute><AdminDashboard /></AdminRoute>}
          />
          <Route
            path="/admin/manage-products"
            element={<AdminRoute><ManageProducts /></AdminRoute>}
          />
          <Route
            path="/admin/users"
            element={<AdminRoute><ManageUsers /></AdminRoute>}
          />
          <Route
           path="/admin/manage-products"
            element={<AdminRoute><ManageProducts /></AdminRoute>} />

          <Route
           path="/admin/admins"
            element={<AdminRoute><ManageAdmins /></AdminRoute>} />
          <Route
            path="/admin/orders"
            element={<AdminRoute><OrderManagement /></AdminRoute>}
          /> {/* Add this route */}
        </Routes>
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <AppContent />
            </Router>
          </WishlistProvider>
        </CartProvider>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;