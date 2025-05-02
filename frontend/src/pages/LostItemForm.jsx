// src/pages/LostItemForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LostItemForm = () => {
    // State for form fields
    const [name, setName] = useState('');
    const [dateLost, setDateLost] = useState('');
    const [locationLost, setLocationLost] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [description, setDescription] = useState('');
    const [govtIdFile, setGovtIdFile] = useState(null);
    const [itemFiles, setItemFiles] = useState([]);
    const [govtIdPreview, setGovtIdPreview] = useState('');
    const [itemImagePreviews, setItemImagePreviews] = useState([]);

    // State for messages and loading
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // --- Get User ID (Placeholder - Replace with Auth Context later) ---
    const getUserIdFromLocalStorage = () => {
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
            try {
                const userData = JSON.parse(userDataString);
                return userData._id;
            } catch (e) {
                console.error("Error parsing user data from localStorage", e);
                return null;
            }
        }
        return null;
    };
    // --- End Placeholder ---


    // Handle Govt ID file change
    const handleGovtIdChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setGovtIdFile(file);
            // Generate preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setGovtIdPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setGovtIdFile(null);
            setGovtIdPreview('');
        }
    };

    // Handle Item Images file change (multiple)
    const handleItemImagesChange = (e) => {
        const files = Array.from(e.target.files).slice(0, 5); // Limit to 5 files
        if (files.length > 0) {
            setItemFiles(files);
            // Generate multiple preview URLs
            const previewUrls = files.map(file => URL.createObjectURL(file));
            setItemImagePreviews(previewUrls);
        } else {
            setItemFiles([]);
            setItemImagePreviews([]);
        }
    };

    // Clean up preview URLs for item images
    useEffect(() => {
        return () => {
            itemImagePreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [itemImagePreviews]);
    // Note: Data URL for Govt ID preview doesn't need explicit cleanup like object URLs

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); setError(''); setLoading(true);

        const userId = getUserIdFromLocalStorage();
        if (!userId) {
             setError("You must be logged in to report an item."); setLoading(false); return;
        }
        if (!govtIdFile || itemFiles.length === 0) {
            setError('Government ID and at least one Item Image are required.'); setLoading(false); return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('dateLost', dateLost);
        formData.append('locationLost', locationLost);
        formData.append('contactNo', contactNo);
        formData.append('description', description);
        formData.append('createdBy', userId);
        formData.append('userGovtID', govtIdFile);
        itemFiles.forEach((file) => { formData.append('images', file); });

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.post(`${apiUrl}/api/lost-items/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', /* TODO: Auth */ },
            });
            setMessage(response.data.message + " Redirecting...");
            setError('');
            setTimeout(() => { navigate('/my-reports'); }, 2000);
        } catch (err) {
            console.error("Report Lost Item Error:", err.response?.data || err.message);
            setError(err.response?.data?.error || err.response?.data?.details || 'Failed to submit report.');
            setMessage('');
        } finally { setLoading(false); }
    };

    // --- Enhanced JSX with Tailwind CSS ---
    return (
        <div className="bg-gradient-to-br from-gray-100 to-blue-50 min-h-[calc(100vh-80px)] px-4 py-12 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-3xl"> {/* Increased max-width, rounded-xl, shadow-xl */}
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 border-b pb-4">Report a Lost Item</h2>

                {/* Feedback Messages */}
                {message && <p className="mb-5 text-sm text-center text-green-700 bg-green-100 p-3 rounded-md border border-green-200">{message}</p>}
                {error && <p className="mb-5 text-sm text-center text-red-700 bg-red-100 p-3 rounded-md border border-red-200">{error}</p>}

                <form onSubmit={handleSubmit} noValidate>
                    {/* Using Grid for layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">

                        {/* Item Name (Full Width) */}
                        <div className="md:col-span-2">
                            <label htmlFor="name" className="form-label">
                                Item Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text" id="name" value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-input" required
                                placeholder="E.g., Black Leather Wallet, Set of Keys"
                            />
                        </div>

                        {/* Date Lost */}
                        <div>
                             <label htmlFor="dateLost" className="form-label">
                                Date Lost <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date" id="dateLost" value={dateLost}
                                onChange={(e) => setDateLost(e.target.value)}
                                className="form-input" required
                                // Optional: Set max date to today
                                max={new Date().toISOString().split("T")[0]}
                            />
                        </div>

                        {/* Location Lost */}
                         <div>
                             <label htmlFor="locationLost" className="form-label">
                                General Location Lost <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text" id="locationLost" value={locationLost}
                                onChange={(e) => setLocationLost(e.target.value)}
                                placeholder="E.g., Central Park near fountain, Metro Line 3"
                                className="form-input" required
                            />
                        </div>

                         {/* Contact Number */}
                         <div>
                             <label htmlFor="contactNo" className="form-label">
                                Your Contact Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel" id="contactNo" value={contactNo}
                                onChange={(e) => setContactNo(e.target.value)}
                                placeholder="Format: +91XXXXXXXXXX or XXXXXXXXXX"
                                className="form-input" required
                                pattern="^[+]?[0-9]{10,15}$" // Basic phone pattern validation
                                title="Enter a valid phone number (10-15 digits, optional +)"
                            />
                        </div>

                         {/* Government ID Upload */}
                        <div>
                            <label htmlFor="govtIdFile" className="form-label">
                                Government ID <span className="text-red-500">*</span>
                                <span className="block text-xs text-gray-500 font-normal">(For verification only, kept private)</span>
                            </label>
                            <input
                                type="file" id="govtIdFile"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleGovtIdChange}
                                className="form-file-input" required
                            />
                            {/* Preview Area */}
                            {govtIdPreview && (
                                <div className="mt-2 p-2 border rounded-md bg-gray-50 inline-block">
                                    <img src={govtIdPreview} alt="Govt ID Preview" className="h-16 w-auto max-w-[100px] object-contain rounded" />
                                </div>
                            )}
                        </div>

                         {/* Item Images Upload (Full Width) */}
                         <div className="md:col-span-2">
                             <label htmlFor="itemFiles" className="form-label">
                                Item Images <span className="text-red-500">*</span>
                                <span className="block text-xs text-gray-500 font-normal">(Upload 1-5 clear images of the item)</span>
                            </label>
                             <input
                                type="file" id="itemFiles"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleItemImagesChange}
                                className="form-file-input" required multiple
                            />
                             {/* Preview Area */}
                             {itemImagePreviews.length > 0 && (
                                <div className="mt-2 p-2 border rounded-md bg-gray-50 flex flex-wrap gap-2">
                                    {itemImagePreviews.map((url, index) => (
                                        <img key={index} src={url} alt={`Item Preview ${index + 1}`} className="h-16 w-16 object-cover rounded border border-gray-300 shadow-sm" />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description (Full Width) */}
                        <div className="md:col-span-2">
                            <label htmlFor="description" className="form-label">
                                Detailed Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description" value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Provide specific details: color, brand, size, material, any unique marks, scratches, or contents..."
                                className="form-input min-h-[100px]" required // Use min-height instead of fixed height
                            ></textarea>
                        </div>
                    </div> {/* End Grid */}

                    {/* Submit Button */}
                    <div className="mt-8 pt-5 border-t border-gray-200 flex items-center justify-center"> {/* Added border-t */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full md:w-auto inline-flex items-center justify-center gap-2 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-2.5 px-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out shadow-md hover:shadow-lg`}
                            aria-busy={loading}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                {loading
                                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                }
                            </svg>
                            {loading ? 'Submitting...' : 'Submit Lost Item Report'}
                        </button>
                    </div>
                </form>
            </div>
             {/* Define reusable styles in index.css or here */}
            <style jsx global>{`
                .form-label {
                    @apply block text-gray-700 text-sm font-semibold mb-1.5; /* Adjusted margin */
                }
                .form-input {
                    @apply shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400;
                }
                .form-file-input {
                     @apply block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
                }
                /* Add any other shared styles */
            `}</style>
        </div>
    );
};

export default LostItemForm;