import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        userType: 'customer' // Default userType
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Form Validation
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.password.trim()) newErrors.password = 'Password is required';
        return newErrors;
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Signup successful! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setErrors({ general: data.message || 'Signup failed. Try again.' });
            }
        } catch (error) {
            setErrors({ general: 'Something went wrong. Please try again.' });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white w-[600px] h-auto shadow-lg rounded-lg flex flex-col p-8">
                <h2 className="text-lg font-semibold mb-4 text-center">Create an Account</h2>

                {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
                {errors.general && <p className="text-red-500 text-center">{errors.general}</p>}

                <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                    />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                    />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

                    {/* Password */}
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md p-2 mb-4 w-full"
                    />
                    {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}

                    {/* User Type Selection (For Testing, Hide in Production) */}
                    <label className="block text-sm font-medium text-gray-700">User Type</label>
                    <select
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md p-2 mb-4 w-full"
                    >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                    </select>

                    {/* Signup Button */}
                    <button type="submit" className="bg-orange-500 text-white py-2 rounded-md w-full hover:bg-orange-600">
                        Sign Up
                    </button>
                </form>

                <p className="text-sm text-blue-500 mt-4 cursor-pointer text-center" onClick={() => navigate('/login')}>
                    Already have an account? Log in
                </p>
            </div>
        </div>
    );
};

export default Signup;
