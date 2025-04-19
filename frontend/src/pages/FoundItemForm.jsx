// src/pages/FoundItemForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FoundItemForm = () => {
    // State for form fields (adjusted names)
    const [name, setName] = useState('');
    const [dateFound, setDateFound] = useState(''); // Renamed
    const [locationFound, setLocationFound] = useState(''); // Renamed
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

    // Placeholder: Get User ID from storage
    const getUserIdFromLocalStorage = () => {
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
            try {
                const userData = JSON.parse(userDataString);
                return userData._id;
            } catch (e) { return null; }
        }
        return null;
    };

    // Handle Govt ID file change
    const handleGovtIdChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setGovtIdFile(file);
            setGovtIdPreview(URL.createObjectURL(file));
        } else {
            setGovtIdFile(null); setGovtIdPreview('');
        }
    };

    // Handle Item Images file change
    const handleItemImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setItemFiles(files);
            setItemImagePreviews(files.map(file => URL.createObjectURL(file)));
        } else {
            setItemFiles([]); setItemImagePreviews([]);
        }
    };

    // Clean up preview URLs
    useEffect(() => {
        return () => {
            if (govtIdPreview) URL.revokeObjectURL(govtIdPreview);
            itemImagePreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [govtIdPreview, itemImagePreviews]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); setError(''); setLoading(true);

        const userId = getUserIdFromLocalStorage();
        if (!userId) {
             setError("You must be logged in to report an item.");
             setLoading(false);
             return;
        }

        if (!govtIdFile || itemFiles.length === 0) {
            setError('Both Government ID and at least one Item Image are required.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('dateFound', dateFound); // Updated key
        formData.append('locationFound', locationFound); // Updated key
        formData.append('contactNo', contactNo);
        formData.append('description', description);
        formData.append('createdBy', userId);
        formData.append('userGovtID', govtIdFile); // Backend expects 'userGovtID'

        itemFiles.forEach((file) => {
            formData.append('images', file);
        });

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            // --- IMPORTANT: Updated API Endpoint ---
            const response = await axios.post(`${apiUrl}/api/found-items/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // TODO: Add Authorization header later
                },
            });

            setMessage(response.data.message + " Thank you for reporting!"); // Updated message
            setError('');
            // Optionally reset form
            // ... reset states ...
            // e.target.reset();

            setTimeout(() => {
                navigate('/my-reports'); // Redirect after success
            }, 2000);

        } catch (err) {
            console.error("Report Found Item Error:", err.response?.data || err.message);
            setError(err.response?.data?.error || err.response?.data?.details || 'Failed to submit report. Please try again.');
            setMessage('');
        } finally {
            setLoading(false);
        }
    };

    // --- JSX with Tailwind CSS (labels updated) ---
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-12">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                {/* Updated Title */}
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Report a Found Item</h2>

                {message && <p className="mb-4 text-sm text-center text-green-600 bg-green-50 p-3 rounded-md border border-green-200">{message}</p>}
                {error && <p className="mb-4 text-sm text-center text-red-600 bg-red-50 p-3 rounded-md border border-red-200">{error}</p>}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {/* Item Name */}
                        <div className="md:col-span-2">
                            <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-1">Item Name <span className="text-red-500">*</span></label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="input-style" required />
                        </div>

                        {/* Date Found */}
                        <div>
                             <label htmlFor="dateFound" className="block text-gray-700 text-sm font-semibold mb-1">Date Found <span className="text-red-500">*</span></label> {/* Updated Label */}
                            <input type="date" id="dateFound" value={dateFound} onChange={(e) => setDateFound(e.target.value)} className="input-style" required />
                        </div>

                        {/* Location Found */}
                         <div>
                             <label htmlFor="locationFound" className="block text-gray-700 text-sm font-semibold mb-1">Location Found <span className="text-red-500">*</span></label> {/* Updated Label */}
                            <input type="text" id="locationFound" value={locationFound} onChange={(e) => setLocationFound(e.target.value)} placeholder="E.g., Starbucks on Main St." className="input-style" required />
                        </div>

                         {/* Contact Number */}
                         <div>
                             <label htmlFor="contactNo" className="block text-gray-700 text-sm font-semibold mb-1">Your Contact Number <span className="text-red-500">*</span></label>
                            <input type="tel" id="contactNo" value={contactNo} onChange={(e) => setContactNo(e.target.value)} placeholder="How someone can contact you" className="input-style" required />
                        </div>

                         {/* Government ID Upload */}
                        <div>
                            <label htmlFor="govtIdFile" className="block text-gray-700 text-sm font-semibold mb-1">Government ID <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(Verification only)</span></label>
                            <input type="file" id="govtIdFile" accept="image/png, image/jpeg, image/jpg" onChange={handleGovtIdChange} className="file-input-style" required />
                            {govtIdPreview && <div className="mt-2"><img src={govtIdPreview} alt="Govt ID Preview" className="preview-image-single" /></div>}
                        </div>

                         {/* Item Images Upload */}
                         <div className="md:col-span-2">
                             <label htmlFor="itemFiles" className="block text-gray-700 text-sm font-semibold mb-1">Item Images <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(Upload up to 5)</span></label>
                             <input type="file" id="itemFiles" accept="image/png, image/jpeg, image/jpg" onChange={handleItemImagesChange} className="file-input-style" required multiple />
                             {itemImagePreviews.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {itemImagePreviews.map((url, index) => (
                                        <img key={index} src={url} alt={`Item Preview ${index + 1}`} className="preview-image-multiple" />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-gray-700 text-sm font-semibold mb-1">Description <span className="text-red-500">*</span></label>
                            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the item you found..." className="input-style h-24" required ></textarea>
                        </div>
                    </div> {/* End Grid */}

                    {/* Submit Button */}
                    <div className="mt-6 flex items-center justify-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full md:w-auto ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-2.5 px-8 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out`} // Changed button color
                            aria-busy={loading}
                        >
                            {loading ? 'Submitting Report...' : 'Submit Found Item Report'} {/* Updated Button Text */}
                        </button>
                    </div>
                </form>
            </div>
             {/* Reusable styles from LostItemForm */}
            <style jsx>{`
                .input-style { @apply shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent; }
                .file-input-style { @apply block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-50 cursor-pointer; }
                .preview-image-single { @apply h-16 w-auto mt-2 rounded border border-gray-300 object-contain; }
                .preview-image-multiple { @apply h-16 w-16 mt-2 rounded border border-gray-300 object-cover; }
            `}</style>
        </div>
    );
};

export default FoundItemForm;