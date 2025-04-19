// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Placeholder: Get User Data (Replace with Auth Context later)
const getUserDataFromStorage = () => {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
        try {
            return JSON.parse(userDataString);
        } catch (e) {
            console.error("Error parsing user data from localStorage", e);
            return null;
        }
    }
    return null;
};
// --- End Placeholder ---

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const data = getUserDataFromStorage();
        if (data) {
            setUserData(data);
        } else {
            // If no user data found (e.g., not logged in according to localStorage),
            // redirect to login. This acts as a basic guard.
            console.log("No user data found in storage, redirecting to login.");
            navigate('/login');
        }
        setLoading(false);
    }, [navigate]); // Add navigate as dependency

    // Construct image URL
    const profilePicUrl = userData?.profilePicture
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${userData.profilePicture}`
        : '/default-profile-placeholder.png'; // Add a default placeholder in /public

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = '/default-profile-placeholder.png'; // Fallback placeholder
    };

    // --- Render Logic ---
    if (loading) {
        return <div className="text-center p-10">Loading profile...</div>;
    }

    if (!userData) {
        // This case might not be reached due to the redirect, but good practice
        return <div className="text-center p-10">Could not load user profile. Please log in.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 border-b pb-3">My Profile</h1>

            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    {/* Profile Picture */}
                    <div className="flex-shrink-0">
                        <img
                            src={profilePicUrl}
                            alt={`${userData.name}'s profile`}
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-200 shadow-sm bg-gray-100"
                            onError={handleImageError}
                        />
                        {/* Optional: Add Edit Picture Button Later */}
                         {/* <button className="mt-2 text-xs text-blue-600 hover:underline">Change Picture</button> */}
                    </div>

                    {/* User Details */}
                    <div className="text-center sm:text-left">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">{userData.name}</h2>
                        <p className="text-gray-600 mt-1">{userData.email}</p>
                        <p className="text-xs text-gray-400 mt-1">Member since: {new Date(userData.createdAt).toLocaleDateString()}</p> {/* Assuming createdAt is available */}

                        {/* Action Buttons */}
                        <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
                             <Link
                                to="/my-reports"
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out text-center"
                            >
                                View My Reports
                            </Link>
                             {/* Placeholder buttons */}
                             {/* <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out">
                                Edit Profile
                            </button> */}
                             {/* <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out">
                                Change Password
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;