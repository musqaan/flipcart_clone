import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  // Check if user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin
  if (user.user_type !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
