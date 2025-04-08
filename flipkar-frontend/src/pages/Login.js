import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust path

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const success = await login(formData.email, formData.password);

    if (success) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      console.log("Stored User:", storedUser);
      console.log("Stored Token:", localStorage.getItem("token"));

      if (storedUser.user_type === "admin") {
        console.log("Admin logged in");
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } else {
      setErrorMessage("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white w-[600px] h-[600px] shadow-lg rounded-lg flex">
        <div className="w-1/2 bg-blue-500 text-white p-8 rounded-l-lg flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold mb-4">Login</h1>
          <p>Get access to your Orders, Wishlist, and Recommendations.</p>
        </div>
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-lg font-semibold mb-4">Login to your Account</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 mb-2 w-full"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            {errorMessage && <p className="text-red-500 text-xs mb-2">{errorMessage}</p>}
            <button
              type="submit"
              className="bg-orange-500 text-white py-2 rounded-md w-full hover:bg-orange-600"
            >
              Log in
            </button>
          </form>
          <p
            className="text-sm text-blue-500 mt-4 cursor-pointer text-center"
            onClick={() => navigate("/signup")}
          >
            New to Flipkart? Create an account
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;