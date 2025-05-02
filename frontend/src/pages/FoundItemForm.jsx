// src/pages/FoundItemForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FoundItemForm = () => {
    // State for form fields
    const [name, setName] = useState('');
    const [dateFound, setDateFound] = useState(''); // Keep specific name
    const [locationFound, setLocationFound] = useState(''); // Keep specific name
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

    // --- Get User ID (Placeholder) ---
    const getUserIdFromLocalStorage = () => { /* ... same as LostItemForm ... */ };
    // --- ---

    // Handle Govt ID file change
    const handleGovtIdChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setGovtIdFile(file);
            const reader = new FileReader();
            reader.onloadend = () => { setGovtIdPreview(reader.result); };
            reader.readAsDataURL(file);
        } else { setGovtIdFile(null); setGovtIdPreview(''); }
    };

    // Handle Item Images file change
    const handleItemImagesChange = (e) => {
        const files = Array.from(e.target.files).slice(0, 5); // Limit to 5
        if (files.length > 0) {
            setItemFiles(files);
            // Clean up old previews before creating new ones
            itemImagePreviews.forEach(url => URL.revokeObjectURL(url));
            const previewUrls = files.map(file => URL.createObjectURL(file));
            setItemImagePreviews(previewUrls);
        } else {
            itemImagePreviews.forEach(url => URL.revokeObjectURL(url)); // Cleanup if selection cleared
            setItemFiles([]); setItemImagePreviews([]);
        }
    };

    // Clean up item image preview URLs on unmount
    useEffect(() => {
        return () => { itemImagePreviews.forEach(url => URL.revokeObjectURL(url)); };
    }, [itemImagePreviews]);

    // Handle form submission (Logic remains the same, uses /api/found-items)
    const handleSubmit = async (e) => { /* ... same logic as before ... */ };

    // --- Enhanced JSX with Tailwind CSS ---
    return (
        // Use a different gradient for visual distinction maybe? Or keep consistent.
        <div className="bg-gradient-to-br from-gray-100 to-green-50 min-h-[calc(100vh-80px)] px-4 py-12 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-3xl">
                {/* Updated Title */}
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 border-b pb-4">Report a Found Item</h2>

                {/* Feedback Messages */}
                {message && <p className="mb-5 text-sm text-center text-green-700 bg-green-100 p-3 rounded-md border border-green-200">{message}</p>}
                {error && <p className="mb-5 text-sm text-center text-red-700 bg-red-100 p-3 rounded-md border border-red-200">{error}</p>}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                        {/* Item Name (Full Width) */}
                        <div className="md:col-span-2">
                            <label htmlFor="name" className="form-label">Item Name <span className="text-red-500">*</span></label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="form-input" required placeholder="E.g., Blue Backpack, Silver Ring" />
                        </div>

                        {/* Date Found */}
                        <div>
                             <label htmlFor="dateFound" className="form-label">Date Found <span className="text-red-500">*</span></label>
                            <input type="date" id="dateFound" value={dateFound} onChange={(e) => setDateFound(e.target.value)} className="form-input" required max={new Date().toISOString().split("T")[0]} />
                        </div>

                        {/* Location Found */}
                         <div>
                             <label htmlFor="locationFound" className="form-label">General Location Found <span className="text-red-500">*</span></label>
                            <input type="text" id="locationFound" value={locationFound} onChange={(e) => setLocationFound(e.target.value)} placeholder="E.g., Library 2nd Floor, Bus Route 5 Stop" className="form-input" required />
                        </div>

                         {/* Contact Number */}
                         <div>
                             <label htmlFor="contactNo" className="form-label">Your Contact Number <span className="text-red-500">*</span></label>
                            <input type="tel" id="contactNo" value={contactNo} onChange={(e) => setContactNo(e.target.value)} placeholder="How the owner can reach you" className="form-input" required pattern="^[+]?[0-9]{10,15}$" title="Enter a valid phone number" />
                        </div>

                         {/* Government ID Upload */}
                        <div>
                            <label htmlFor="govtIdFile" className="form-label">Government ID <span className="text-red-500">*</span><span className="block text-xs text-gray-500 font-normal">(Verification only, kept private)</span></label>
                            <input type="file" id="govtIdFile" accept="image/png, image/jpeg, image/jpg" onChange={handleGovtIdChange} className="form-file-input" required />
                            {govtIdPreview && <div className="mt-2 p-2 border rounded-md bg-gray-50 inline-block"><img src={govtIdPreview} alt="Govt ID Preview" className="h-16 w-auto max-w-[100px] object-contain rounded" /></div>}
                        </div>

                         {/* Item Images Upload (Full Width) */}
                         <div className="md:col-span-2">
                             <label htmlFor="itemFiles" className="form-label">Item Images <span className="text-red-500">*</span><span className="block text-xs text-gray-500 font-normal">(Upload 1-5 clear images)</span></label>
                             <input type="file" id="itemFiles" accept="image/png, image/jpeg, image/jpg" onChange={handleItemImagesChange} className="form-file-input" required multiple />
                             {itemImagePreviews.length > 0 && <div className="mt-2 p-2 border rounded-md bg-gray-50 flex flex-wrap gap-2">{itemImagePreviews.map((url, index) => ( <img key={index} src={url} alt={`Preview ${index + 1}`} className="h-16 w-16 object-cover rounded border border-gray-300 shadow-sm" /> ))}</div>}
                        </div>

                        {/* Description (Full Width) */}
                        <div className="md:col-span-2">
                            <label htmlFor="description" className="form-label">Detailed Description <span className="text-red-500">*</span></label>
                            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the item found, its condition, and any distinguishing features..." className="form-input min-h-[100px]" required ></textarea>
                        </div>
                    </div> {/* End Grid */}

                    {/* Submit Button */}
                    <div className="mt-8 pt-5 border-t border-gray-200 flex items-center justify-center">
                        {/* Changed button color to Green */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full md:w-auto inline-flex items-center justify-center gap-2 ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-2.5 px-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out shadow-md hover:shadow-lg`}
                            aria-busy={loading}
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                {loading
                                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                }
                            </svg>
                            {/* Updated Button Text */}
                            {loading ? 'Submitting...' : 'Submit Found Item Report'}
                        </button>
                    </div>
                </form>
            </div>
            {/* Use global styles defined elsewhere or repeat style block */}
            <style jsx global>{`
                 .form-label { @apply block text-gray-700 text-sm font-semibold mb-1.5; }
                 .form-input { @apply shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400; }
                 .form-file-input { @apply block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent; }
            `}</style>
        </div>
    );
};

export default FoundItemForm;