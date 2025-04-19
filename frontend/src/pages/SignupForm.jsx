import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation

const SignupForm = () => {
    // State for form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Added Confirm Password
    const [profilePicture, setProfilePicture] = useState(null); // State for the selected file object
    const [previewUrl, setPreviewUrl] = useState(''); // State for image preview URL

    // State for messages and loading
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle file input change and create preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            // Create a temporary URL for preview
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setProfilePicture(null);
            setPreviewUrl('');
        }
    };

    // Clean up the preview URL when component unmounts or file changes
    useEffect(() => {
        // This is important to prevent memory leaks
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

        // --- Password Confirmation Check ---
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return; // Stop submission if passwords don't match
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password); // Send the actual password
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        try {
            // --- Send data to backend ---
            // !!! IMPORTANT: Replace with your actual Render backend URL if deployed !!!
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Use env variable or default
            const response = await axios.post(`${apiUrl}/api/users/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage(response.data.message + " You can now login."); // Show success message
            setError(''); // Clear any previous error
            // Reset form fields
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setProfilePicture(null);
            setPreviewUrl('');
            e.target.reset(); // Reset file input visually

        } catch (err) {
            console.error("Signup Error:", err.response?.data || err.message);
            setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Signup failed. Please try again.');
             setMessage(''); // Clear any previous success message
        } finally {
            setLoading(false);
        }
    };

    // --- JSX with Tailwind CSS ---
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>

                {/* Display Messages */}
                {message && <p className="mb-4 text-sm text-center text-green-600 bg-green-100 p-2 rounded">{message}</p>}
                {error && <p className="mb-4 text-sm text-center text-red-600 bg-red-100 p-2 rounded">{error}</p>}

                <form onSubmit={handleSubmit} noValidate>
                    {/* Name Input */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            aria-label="Full Name"
                        />
                    </div>

                    {/* Email Input */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            aria-label="Email Address"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            minLength="6"
                            required
                            aria-label="Password"
                        />
                         <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters.</p>
                    </div>

                     {/* Confirm Password Input */}
                    <div className="mb-6"> {/* Increased bottom margin */}
                        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            minLength="6"
                            required
                            aria-label="Confirm Password"
                        />
                    </div>

                    {/* Profile Picture Input */}
                    <div className="mb-6">
                        <label htmlFor="profilePicture" className="block text-gray-700 text-sm font-bold mb-2">
                            Profile Picture (Optional)
                        </label>
                        <input
                            type="file"
                            id="profilePicture"
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            aria-label="Profile Picture"
                        />
                         {/* Image Preview */}
                        {previewUrl && (
                            <div className="mt-4">
                                <img src={previewUrl} alt="Profile Preview" className="w-20 h-20 rounded-full object-cover border border-gray-300" />
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full ${loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out`}
                            aria-busy={loading}
                        >
                            {loading ? 'Registering...' : 'Create Account'}
                        </button>
                    </div>
                </form>

                 {/* Link to Login */}
                 <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupForm;