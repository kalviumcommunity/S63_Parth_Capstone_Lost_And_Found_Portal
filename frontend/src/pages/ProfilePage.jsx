// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Use the auth context

const ProfilePage = () => {
    const { user, logout, isAuthenticated, isLoadingAuth } = useAuth();
    const navigate = useNavigate();

    // --- Redirect Effect ---
    useEffect(() => {
        // --- CONDITION TO PREVENT LOOP ---
        // Only navigate if:
        // 1. Auth check is NOT loading anymore (isLoadingAuth is false)
        // 2. The user is definitively NOT authenticated (isAuthenticated is false)
        if (!isLoadingAuth && !isAuthenticated) {
            console.log("ProfilePage: Not authenticated (checked after loading), redirecting to login.");
            // Use replace: true to prevent adding the profile page to history when redirecting
            navigate('/login', { replace: true });
        }
        // --- DEPENDENCIES ---
        // This effect should ONLY re-run if the loading status or authenticated status changes.
        // 'navigate' is generally stable but included for completeness per linting rules.
    }, [isAuthenticated, isLoadingAuth, navigate]);

    // --- Image URL & Error Handler ---
    const profilePicUrl = user?.profilePicture
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${user.profilePicture}`
        : '/default-profile-placeholder.png';

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = '/default-profile-placeholder.png';
    };

    // --- Logout Handler ---
    const handleLogout = () => {
        logout(); // Call logout from context
        navigate('/login'); // Redirect after logout
    };

    // --- RENDER LOGIC ---

    // 1. Show loading spinner while auth context initializes
    if (isLoadingAuth) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-150px)]">
                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                 <span className="ml-3 text-gray-500">Loading profile...</span>
            </div>
        );
    }

    // 2. If not loading, BUT not authenticated (or user is null), render nothing or a minimal message.
    // The redirect should have happened, but this prevents rendering the profile content incorrectly.
    if (!isAuthenticated || !user) {
         // It's better to render null or a very minimal message here,
         // as the redirect should handle removing the user from this view.
         // Returning null prevents briefly flashing content before redirecting.
        return null;
        // Or: return <div className="text-center p-10">Redirecting to login...</div>;
    }

    // 3. If loading is done AND user is authenticated, show the profile
    return (
        <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-150px)]">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 border-b pb-3 text-gray-800">My Profile</h1>

            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-8">
                    {/* Profile Picture */}
                    <div className="flex-shrink-0">
                        <img
                            src={profilePicUrl}
                            alt={`${user.name}'s profile`}
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-200 shadow-md bg-gray-100"
                            onError={handleImageError}
                        />
                    </div>

                    {/* User Details */}
                    <div className="text-center sm:text-left flex-grow">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">{user.name}</h2>
                        <p className="text-gray-600 mt-1">{user.email}</p>
                        <p className="text-xs text-gray-400 mt-1">
                            Member since: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </p>

                        {/* Action Buttons */}
                        <div className="mt-5 flex flex-col sm:flex-row gap-3 items-center justify-center sm:justify-start">
                             <Link
                                to="/my-reports"
                                className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-5 rounded-md transition duration-150 ease-in-out"
                            >
                                View My Reports
                            </Link>
                             <button
                                onClick={handleLogout}
                                className="w-full sm:w-auto text-center bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-5 rounded-md transition duration-150 ease-in-out"
                             >
                                 Log Out
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;