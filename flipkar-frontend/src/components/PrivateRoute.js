import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Ensure correct path to AuthContext

const PrivateRoute = ({ children }) => {
    const { user } = useAuth(); // Get user from AuthContext

    // If there is no user (i.e., not logged in), redirect to login page
    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
