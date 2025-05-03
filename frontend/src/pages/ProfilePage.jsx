// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ProfilePage = () => {
    // Get user, logout, updateUser from context
    const { user, logout, isAuthenticated, isLoadingAuth, updateUser } = useAuth();
    const navigate = useNavigate();

    // State for file upload status
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');
    const fileInputRef = useRef(null); // Ref for hidden file input

    // Effect to redirect if not authenticated
    useEffect(() => {
        if (!isLoadingAuth && !isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, isLoadingAuth, navigate]);

    // Construct Image URL (using user from context)
    const profilePicUrl = user?.profilePicture
        ? user.profilePicture
        : '/default-profile-placeholder.png'; // Ensure this exists in /public

    // Image error handler
    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = '/default-profile-placeholder.png';
    };

    // Logout handler
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // --- Profile Picture Update Functions ---
    const handleEditPictureClick = () => {
        fileInputRef.current?.click(); // Trigger hidden file input
    };

    const handleFileSelected = (event) => {
        const file = event.target.files[0];
        if (file) {
            handlePictureUpload(file); // Upload immediately
            event.target.value = null; // Reset input value
        }
    };

    const handlePictureUpload = async (fileToUpload) => {
        if (!fileToUpload || !user?._id) return;

        setUploading(true); setUploadError(''); setUploadSuccess('');
        const formData = new FormData();
        formData.append('profilePicture', fileToUpload);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.patch(
                `${apiUrl}/api/users/${user._id}/picture`, // PATCH endpoint
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' /* Add Auth later */ } }
            );

            if (response.data && response.data.user) {
                updateUser(response.data.user); // Update context state
                setUploadSuccess('Picture updated!');
                setTimeout(() => setUploadSuccess(''), 3000); // Clear message
            } else { throw new Error("Update successful, but no user data returned."); }

        } catch (err) {
            console.error("Profile picture upload error:", err.response?.data || err.message);
            setUploadError(err.response?.data?.message || "Failed to upload.");
            setTimeout(() => setUploadError(''), 5000); // Clear message
        } finally {
            setUploading(false);
        }
    };
    // --- End Profile Picture Update Functions ---

    // --- Render Logic ---
    if (isLoadingAuth) {
         return ( <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"> <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div> <span className="ml-4 text-gray-600">Loading Profile...</span> </div> );
    }
    if (!isAuthenticated || !user) { return null; } // Redirect handled by useEffect

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-120px)] py-10 md:py-16">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
                    <div className="p-6 sm:p-8 md:p-10">
                        {/* Profile Header */}
                         <div className="text-center border-b border-gray-200 pb-6 mb-6">
                             <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Profile</h1>
                         </div>

                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
                            {/* Profile Picture & Actions */}
                            <div className="relative flex-shrink-0 w-full md:w-40 flex flex-col items-center">
                                {/* Image container with hover effect */}
                                 <div className="relative group w-32 h-32 md:w-40 md:h-40 mb-3">
                                     <img
                                        src={profilePicUrl}
                                        alt={`${user.name}'s profile`}
                                        className="w-full h-full rounded-full object-cover border-4 border-indigo-100 shadow-md bg-gray-200"
                                        onError={handleImageError}
                                    />
                                     {/* Clickable Overlay */}
                                     <button
                                         onClick={handleEditPictureClick}
                                         disabled={uploading}
                                         className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full transition-opacity duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                         title="Change profile picture"
                                         aria-label="Change profile picture"
                                    >
                                        {/* SVG Icon: Spinner or Camera */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 text-white opacity-0 group-hover:opacity-80 transition-opacity duration-200 ${uploading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                             {uploading
                                                 ? <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /> // Spinner icon
                                                 : ( // Fixed: Added () and Fragment <> </>
                                                     <> {/* Wrap adjacent paths */}
                                                         <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                         <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                     </>
                                                   )
                                             }
                                         </svg>
                                     </button>
                                </div>
                                 {/* Hidden File Input */}
                                 <input type="file" ref={fileInputRef} onChange={handleFileSelected} accept="image/png, image/jpeg, image/jpg" className="hidden" />

                                 {/* Upload Status Messages */}
                                 <div className="h-4 mt-1"> {/* Placeholder to prevent layout shift */}
                                     {uploadError && <p className="text-xs text-red-500 text-center">{uploadError}</p>}
                                     {uploadSuccess && <p className="text-xs text-green-500 text-center">{uploadSuccess}</p>}
                                </div>
                            </div>

                            {/* User Details & Buttons */}
                            <div className="flex-grow text-center md:text-left">
                                 <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1">{user.name}</h2>
                                 <p className="text-gray-600 mb-2">{user.email}</p>
                                 <p className="text-xs text-gray-400 mb-6"> Member since: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} </p>
                                 <hr className="my-5 border-gray-200"/>
                                 {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 items-center justify-center md:justify-start">
                                       <Link to="/my-reports" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-5 rounded-md transition duration-150 ease-in-out shadow-sm hover:shadow-md" > <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> My Reports </Link>
                                       <button onClick={handleLogout} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-center bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-5 rounded-md transition duration-150 ease-in-out shadow-sm hover:shadow-md" > <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> Log Out </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;