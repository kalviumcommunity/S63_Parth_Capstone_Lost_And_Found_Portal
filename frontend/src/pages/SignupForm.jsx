// src/pages/SignupForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate

const SignupForm = () => {
    // State for form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    // State for messages and loading
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate(); // Hook for redirection

    // Handle file input change and create preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setProfilePicture(null);
            setPreviewUrl('');
        }
    };

    // Clean up preview URL
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.post(`${apiUrl}/api/users/`, formData, { // Ensure endpoint is correct (/api/users/)
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage(response.data.message + " Redirecting to login...");
            setError('');
            // Reset form fields (optional, as we redirect)
            // ... reset states ...
            // e.target.reset();

            // Redirect to login page after successful signup
            setTimeout(() => {
                navigate('/login'); // Redirect after 2 seconds
            }, 2000);


        } catch (err) {
            console.error("Signup Error:", err.response?.data || err.message);
            setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Signup failed. Please try again.');
             setMessage('');
        } finally {
            setLoading(false);
        }
    };

    // --- JSX with Tailwind CSS ---
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-100 px-4 py-12"> {/* Adjusted min-height */}
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"> {/* Increased shadow */}
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Your Account</h2>

                {message && <p className="mb-4 text-sm text-center text-green-600 bg-green-50 p-3 rounded-md border border-green-200">{message}</p>}
                {error && <p className="mb-4 text-sm text-center text-red-600 bg-red-50 p-3 rounded-md border border-red-200">{error}</p>}

                <form onSubmit={handleSubmit} noValidate>
                    {/* Name Input */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            aria-label="Full Name"
                        />
                    </div>

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
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            minLength="6"
                            required
                            aria-label="Password"
                        />
                         <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters.</p>
                    </div>

                     {/* Confirm Password Input */}
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-semibold mb-2">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            minLength="6"
                            required
                            aria-label="Confirm Password"
                        />
                    </div>

                    {/* Profile Picture Input */}
                    <div className="mb-6">
                        <label htmlFor="profilePicture" className="block text-gray-700 text-sm font-semibold mb-2">
                            Profile Picture (Optional)
                        </label>
                        <input
                            type="file"
                            id="profilePicture"
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-50 cursor-pointer"
                            aria-label="Profile Picture"
                        />
                         {previewUrl && (
                            <div className="mt-4">
                                <img src={previewUrl} alt="Profile Preview" className="w-20 h-20 rounded-full object-cover border-2 border-gray-300" />
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-2.5 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out`}
                            aria-busy={loading}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </div>
                </form>

                 <p className="mt-8 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupForm;