// src/pages/LoginForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <<<--- IMPORT useAuth

// Remove the old saveAuthData function if it's still in this file

const LoginForm = () => {
    // State for form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // --- Use Auth Context ---
    // Get the login function and any loading/error state from the context
    const { login, isLoadingAuth, error: authError } = useAuth();
    // --- ---

    // Local error state specifically for this form's interaction (optional)
    const [formError, setFormError] = useState('');

    const navigate = useNavigate(); // Hook for redirection

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(''); // Clear previous form-specific errors

        // --- Call the login function from AuthContext ---
        const success = await login(email, password); // login handles API call, state update, localStorage
        // --- ---

        if (success) {
            console.log("Login successful via context, navigating to profile...");
            navigate('/profile'); // Navigate on successful login
        } else {
             // Error message is likely already set in the AuthContext's 'error' state (authError)
             // You could set a local error too if needed
             setFormError(authError || "Login failed. Please check credentials."); // Use error from context if available
             console.log("Login failed via context.");
        }
    };

    // --- JSX with Tailwind CSS ---
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-100 px-4 py-12">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Log In</h2>

                {/* Display Error Messages (Use error from context OR local form error) */}
                {(authError || formError) && (
                    <p className="mb-4 text-sm text-center text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                        {authError || formError}
                    </p>
                )}


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
                            className="input-style" // Re-use style defined elsewhere or add classes
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
                            className="input-style"
                            required
                            aria-label="Password"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={isLoadingAuth} // Disable button while context is loading/logging in
                            className={`w-full ${isLoadingAuth ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-2.5 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out`}
                            aria-busy={isLoadingAuth}
                        >
                            {isLoadingAuth ? 'Logging In...' : 'Log In'}
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
             {/* Reusable input style */}
             <style jsx>{`
                .input-style { @apply shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent; }
            `}</style>
        </div>
    );
};

export default LoginForm;