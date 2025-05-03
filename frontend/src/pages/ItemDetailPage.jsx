import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Placeholder: Get User ID (Replace with Auth Context later)
const getUserId = () => JSON.parse(localStorage.getItem('userData'))?._id || null;

const ItemDetailPage = () => {
    const { itemType, id } = useParams(); // Get type (lost-items/found-items) and id
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Claim Form State (for found items)
    const [claimName, setClaimName] = useState('');
    const [claimContact, setClaimContact] = useState('');
    const [claimDescription, setClaimDescription] = useState('');
    const [claimLoading, setClaimLoading] = useState(false);
    const [claimMessage, setClaimMessage] = useState('');
    const [claimError, setClaimError] = useState('');

    // "I Have This Item" Form State (for lost items)
    const [foundContact, setFoundContact] = useState('');
    const [foundDescription, setFoundDescription] = useState('');
    const [foundLocation, setFoundLocation] = useState('');
    const [foundDate, setFoundDate] = useState('');
    const [foundImages, setFoundImages] = useState([]);
    const [foundImagePreviews, setFoundImagePreviews] = useState([]);
    const [foundLoading, setFoundLoading] = useState(false);
    const [foundMessage, setFoundMessage] = useState('');
    const [foundError, setFoundError] = useState('');

    const loggedInUserId = getUserId();
    const isFoundItemPage = itemType === 'found-items'; // Check if it's a found item page
    const isLostItemPage = itemType === 'lost-items'; // Check if it's a lost item page

    // Fetch item details on component mount or when id/itemType changes
    useEffect(() => {
        if (itemType !== 'lost-items' && itemType !== 'found-items') {
            setError("Invalid item type specified in URL."); setLoading(false); return;
        }
        const fetchItemDetails = async () => {
            setLoading(true); setError(''); setItem(null); // Reset state
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const response = await axios.get(`${apiUrl}/api/${itemType}/${id}`);
                setItem(response.data);
            } catch (err) {
                console.error("Fetch Item Detail Error:", err);
                setError(`Failed to load item details (${err.response?.status || 'Network Error'}).`);
                if (err.response?.status === 404) setError("Item not found.");
            } finally { setLoading(false); }
        };
        fetchItemDetails();
    }, [id, itemType]);

    // Handle image file selection for "I Have This Item" form
    const handleFoundImagesChange = (e) => {
        const files = Array.from(e.target.files).slice(0, 5); // Limit to 5 files
        if (files.length > 0) {
            setFoundImages(files);
            // Clean up old previews before creating new ones
            foundImagePreviews.forEach(url => URL.revokeObjectURL(url));
            const previewUrls = files.map(file => URL.createObjectURL(file));
            setFoundImagePreviews(previewUrls);
        } else {
            foundImagePreviews.forEach(url => URL.revokeObjectURL(url)); // Cleanup if selection cleared
            setFoundImages([]); 
            setFoundImagePreviews([]);
        }
    };

    // Clean up image preview URLs on unmount
    useEffect(() => {
        return () => {
            foundImagePreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [foundImagePreviews]);

    // Handle Claim Form Submission (for found items)
    const handleClaimSubmit = async (e) => {
        e.preventDefault();
        if (!loggedInUserId) { setClaimError("Please log in to submit a claim."); return; }
        if (!isFoundItemPage) return; // Should not happen, but safety check

        setClaimLoading(true); setClaimMessage(''); setClaimError('');
        try {
             const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
             const response = await axios.post(`${apiUrl}/api/claims`, {
                 foundItemId: id,
                 claimantUserId: loggedInUserId,
                 claimantName: claimName,
                 contactNo: claimContact,
                 description: claimDescription,
             }/*, { headers: { Authorization: `Bearer ${token}` }} // Add later */);
             setClaimMessage(response.data.message || "Claim submitted successfully!");
             setClaimName(''); setClaimContact(''); setClaimDescription(''); // Clear form
        } catch (err) {
             console.error("Claim Submission Error:", err);
             setClaimError(err.response?.data?.message || "Failed to submit claim.");
        } finally { setClaimLoading(false); }
    };

    // Handle "I Have This Item" Form Submission (for lost items)
    const handleFoundItemSubmit = async (e) => {
        e.preventDefault();
        if (!loggedInUserId) { setFoundError("Please log in to report a found item."); return; }
        if (!isLostItemPage) return; // Should not happen, but safety check
        if (foundImages.length === 0) { setFoundError("Please upload at least one image of the item."); return; }

        setFoundLoading(true); setFoundMessage(''); setFoundError('');
        
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            
            // Create FormData for file uploads
            const formData = new FormData();
            formData.append('name', item.name); // Use the lost item's name
            formData.append('dateFound', foundDate);
            formData.append('locationFound', foundLocation);
            formData.append('contactNo', foundContact);
            formData.append('description', foundDescription);
            formData.append('createdBy', loggedInUserId);
            formData.append('relatedLostItem', id); // Reference to the lost item
            
            // Append each image file
            foundImages.forEach((file) => {
                formData.append('images', file);
            });
            
            // Add government ID (required for found items)
            // Note: In a real implementation, you might want to handle this differently
            // For now, we're assuming the user already has a govt ID on file or will upload it later
            
            const response = await axios.post(`${apiUrl}/api/found-items/match-lost`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            setFoundMessage(response.data.message || "Your report has been submitted successfully! The owner will be notified.");
            
            // Clear form
            setFoundContact('');
            setFoundDescription('');
            setFoundLocation('');
            setFoundDate('');
            setFoundImages([]);
            setFoundImagePreviews([]);
            
        } catch (err) {
            console.error("Found Item Submission Error:", err);
            setFoundError(err.response?.data?.message || "Failed to submit your report. Please try again.");
        } finally {
            setFoundLoading(false);
        }
    };

    // Helper for image errors
     const handleImageError = (e) => {
        e.target.onerror = null; e.target.src = '/placeholder-image.png'; // Add placeholder in /public
    };

    // --- Render Logic ---
    if (loading) return <div className="text-center p-10">Loading...</div>;
    if (error) return <div className="text-center text-red-600 bg-red-50 p-5 rounded-md border border-red-200 container mx-auto mt-5">{error}</div>;
    if (!item) return <div className="text-center p-10">Item data could not be loaded.</div>; // Should be caught by error state, but good fallback

    const isOwnerOrFinder = loggedInUserId && item.createdBy?._id === loggedInUserId;
    const itemDate = new Date(item.dateFound || item.dateLost).toLocaleDateString();
    const primaryImageUrl = item.images?.[0] ? item.images[0] : '/placeholder-image.png';
    const govtIdImageUrl = item.userGovtID ? item.userGovtID : null;


    return (
        <div className="container mx-auto px-4 py-8">
             <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline text-sm mb-6 inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back
            </button>

            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                    {/* --- Image Section --- */}
                    <div className="md:col-span-1">
                        <img
                            src={primaryImageUrl}
                            alt={item.name || 'Item Image'}
                            className="w-full h-64 md:h-80 object-cover rounded-lg border border-gray-200 shadow-sm mb-4 bg-gray-100"
                            onError={handleImageError}
                        />
                        {/* Thumbnails */}
                        {item.images && item.images.length > 1 && (
                            <div className="flex flex-wrap gap-2">
                                {item.images.map((imgFilename, index) => ( // Show all images as thumbs
                                     <img
                                        key={index}
                                        src={imgFilename}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-16 h-16 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                                        onError={handleImageError}
                                        // Optional: onClick to change main image
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* --- Details Section --- */}
                    <div className="md:col-span-2">
                         <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${isFoundItemPage ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            Status: {isFoundItemPage ? 'Found' : 'Lost'}
                        </span>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{item.name || 'Item Details'}</h1>

                         <dl className="space-y-3 text-sm text-gray-700 mb-6 border-t border-b py-4">
                             <div className="flex"><dt className="w-28 font-medium text-gray-500 shrink-0">{isFoundItemPage ? 'Date Found:' : 'Date Lost:'}</dt><dd>{itemDate}</dd></div>
                             <div className="flex"><dt className="w-28 font-medium text-gray-500 shrink-0">{isFoundItemPage ? 'Location Found:' : 'Location Lost:'}</dt><dd>{item.locationFound || item.locationLost}</dd></div>
                             <div className="flex"><dt className="w-28 font-medium text-gray-500 shrink-0">Reported By:</dt><dd>{item.createdBy?.name || 'N/A'}</dd></div>
                             {/* Show contact only if viewer owns the report */}
                             {isOwnerOrFinder && <div className="flex"><dt className="w-28 font-medium text-gray-500 shrink-0">My Contact #:</dt><dd>{item.contactNo}</dd></div>}
                        </dl>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                        <p className="text-gray-600 whitespace-pre-wrap leading-relaxed mb-6">{item.description || 'No description.'}</p>

                         {/* Show Govt ID privately if viewer owns the report */}
                         {isOwnerOrFinder && govtIdImageUrl && (
                             <div className="mt-4 p-3 bg-gray-50 border rounded">
                                <p className="text-xs font-medium text-gray-500 mb-1">My Govt ID (Private View):</p>
                                <img src={govtIdImageUrl} alt="Govt ID" className="h-20 w-auto border rounded" onError={handleImageError}/>
                             </div>
                         )}

                        {/* --- Claim Section (for found items) --- */}
                         {isFoundItemPage && !isOwnerOrFinder && (
                             <div className="mt-8 border-t-2 border-dashed border-gray-200 pt-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Claim This Item</h3>
                                {claimMessage && <p className="mb-3 text-sm text-green-600 bg-green-50 p-3 rounded border border-green-200">{claimMessage}</p>}
                                {claimError && <p className="mb-3 text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">{claimError}</p>}

                                {!claimMessage && ( // Hide form after successful claim
                                    <form onSubmit={handleClaimSubmit} className="space-y-4">
                                        <div>
                                            <label htmlFor="claimName" className="block text-sm font-medium text-gray-700 mb-1">Your Full Name <span className="text-red-500">*</span></label>
                                            <input type="text" id="claimName" value={claimName} onChange={(e) => setClaimName(e.target.value)} className="input-style" required />
                                        </div>
                                        <div>
                                             <label htmlFor="claimContact" className="block text-sm font-medium text-gray-700 mb-1">Your Contact Number <span className="text-red-500">*</span></label>
                                            <input type="tel" id="claimContact" value={claimContact} onChange={(e) => setClaimContact(e.target.value)} className="input-style" required />
                                        </div>
                                         <div>
                                            <label htmlFor="claimDescription" className="block text-sm font-medium text-gray-700 mb-1">Proof of Ownership / Identifying Details <span className="text-red-500">*</span></label>
                                            <textarea id="claimDescription" value={claimDescription} onChange={(e) => setClaimDescription(e.target.value)} rows="3" className="input-style" required placeholder="Describe something unique..."></textarea>
                                            <p className="text-xs text-gray-500 mt-1">Help the finder verify it's yours.</p>
                                        </div>
                                        <button
                                            type="submit" disabled={claimLoading}
                                            className={`w-full sm:w-auto ${claimLoading ? 'bg-orange-300' : 'bg-orange-500 hover:bg-orange-600'} text-white font-bold py-2 px-6 rounded-md transition duration-150`}
                                        >
                                            {claimLoading ? 'Submitting...' : 'Submit Claim'}
                                        </button>
                                    </form>
                                )}
                            </div>
                         )}

                        {/* --- "I Have This Item" Section (for lost items) --- */}
                        {isLostItemPage && !isOwnerOrFinder && (
                            <div className="mt-8 border-t-2 border-dashed border-gray-200 pt-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">I Have This Item</h3>
                                {foundMessage && <p className="mb-3 text-sm text-green-600 bg-green-50 p-3 rounded border border-green-200">{foundMessage}</p>}
                                {foundError && <p className="mb-3 text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">{foundError}</p>}

                                {!foundMessage && ( // Hide form after successful submission
                                    <form onSubmit={handleFoundItemSubmit} className="space-y-4">
                                        <div>
                                            <label htmlFor="foundContact" className="block text-sm font-medium text-gray-700 mb-1">Your Contact Number <span className="text-red-500">*</span></label>
                                            <input type="tel" id="foundContact" value={foundContact} onChange={(e) => setFoundContact(e.target.value)} className="input-style" required placeholder="How the owner can reach you" />
                                        </div>
                                        <div>
                                            <label htmlFor="foundDate" className="block text-sm font-medium text-gray-700 mb-1">Date Found <span className="text-red-500">*</span></label>
                                            <input 
                                                type="date" 
                                                id="foundDate" 
                                                value={foundDate} 
                                                onChange={(e) => setFoundDate(e.target.value)} 
                                                className="input-style" 
                                                required 
                                                max={new Date().toISOString().split("T")[0]} 
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="foundLocation" className="block text-sm font-medium text-gray-700 mb-1">Location Found <span className="text-red-500">*</span></label>
                                            <input 
                                                type="text" 
                                                id="foundLocation" 
                                                value={foundLocation} 
                                                onChange={(e) => setFoundLocation(e.target.value)} 
                                                className="input-style" 
                                                required 
                                                placeholder="Where you found the item" 
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="foundDescription" className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                                            <textarea 
                                                id="foundDescription" 
                                                value={foundDescription} 
                                                onChange={(e) => setFoundDescription(e.target.value)} 
                                                rows="3" 
                                                className="input-style" 
                                                required 
                                                placeholder="Describe the item you found and any identifying details..."
                                            ></textarea>
                                            <p className="text-xs text-gray-500 mt-1">Include details that would help the owner confirm it's their item.</p>
                                        </div>
                                        <div>
                                            <label htmlFor="foundImages" className="block text-sm font-medium text-gray-700 mb-1">
                                                Item Images <span className="text-red-500">*</span>
                                                <span className="block text-xs text-gray-500 font-normal">(Upload 1-5 clear images of the item)</span>
                                            </label>
                                            <input 
                                                type="file" 
                                                id="foundImages" 
                                                accept="image/png, image/jpeg, image/jpg" 
                                                onChange={handleFoundImagesChange} 
                                                className="form-file-input" 
                                                required 
                                                multiple 
                                            />
                                            {/* Image Previews */}
                                            {foundImagePreviews.length > 0 && (
                                                <div className="mt-2 p-2 border rounded-md bg-gray-50 flex flex-wrap gap-2">
                                                    {foundImagePreviews.map((url, index) => (
                                                        <img 
                                                            key={index} 
                                                            src={url} 
                                                            alt={`Preview ${index + 1}`} 
                                                            className="h-16 w-16 object-cover rounded border border-gray-300 shadow-sm" 
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="submit" 
                                            disabled={foundLoading}
                                            className={`w-full sm:w-auto ${foundLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-2 px-6 rounded-md transition duration-150`}
                                        >
                                            {foundLoading ? 'Submitting...' : 'I Have This Item'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}

                         {/* Message if user is the finder */}
                         {isFoundItemPage && isOwnerOrFinder && (
                              <p className="mt-6 text-sm text-blue-700 bg-blue-50 p-3 rounded border border-blue-200">
                                 You reported this item. Claims submitted by others will appear on your "My Reports" page.
                             </p>
                         )}
                         {/* Message if user is viewing their own lost item */}
                         {!isFoundItemPage && isOwnerOrFinder && (
                              <p className="mt-6 text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
                                 This is your lost item report. You can manage it from the "My Reports" page.
                             </p>
                         )}

                    </div> {/* End Details Section */}
                </div> {/* End Grid */}
            </div> {/* End Card */}
            {/* Reusable input styles */}
             <style jsx>{`
                .input-style { @apply shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent; }
                .form-file-input { @apply block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent; }
             `}</style>
        </div> // End Container
    );
};

export default ItemDetailPage;