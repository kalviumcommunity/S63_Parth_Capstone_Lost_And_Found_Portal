import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

// TODO: Replace this with actual context/state management later
// For now, just saving token to localStorage as an example
const saveAuthData = (token, user) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
    console.log("Auth data saved to localStorage"); // For debugging
}

const LoginForm = () => {
    // State for form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State for messages and loading
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate(); // Hook for redirection

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        setLoading(true);

        try {
            // --- Send data to backend ---
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            // Make sure the endpoint matches your backend route (/api/users/login)
            const response = await axios.post(`${apiUrl}/api/users/login`, {
                email,
                password,
            });

            // --- Handle Success ---
            if (response.data && response.data.token) {
                console.log("Login successful:", response.data);
                // Save token and user data (e.g., localStorage or context)
                saveAuthData(response.data.token, response.data.user);

                // TODO: Update global authentication state here

                // Redirect to a protected page (e.g., profile or dashboard)
                navigate('/profile'); // Or navigate('/') for home page
            } else {
                 setError('Login successful, but no token received.'); // Should not happen with correct backend
            }

        } catch (err) {
            // --- Handle Errors ---
            console.error("Login Error:", err.response?.data || err.message);
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false); // Stop loading indicator
        }
    };

    // --- JSX with Tailwind CSS ---
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-100 px-4 py-12">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Log In</h2>

                {/* Display Error Messages */}
                {error && <p className="mb-4 text-sm text-center text-red-600 bg-red-50 p-3 rounded-md border border-red-200">{error}</p>}

                <form onSubmit={handleSubmit} noValidate>
                    {/* Email Input */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            aria-label="Email Address"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            aria-label="Password"
                        />
                        {/* Optional: Forgot Password Link */}
                        {/* <div className="text-right mt-1">
                            <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline">
                                Forgot Password?
                            </Link>
                        </div> */}
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-2.5 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out`}
                            aria-busy={loading}
                        >
                            {loading ? 'Logging In...' : 'Log In'}
                        </button>
                    </div>
                </form>

                {/* Link to Signup */}
                <p className="mt-8 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;