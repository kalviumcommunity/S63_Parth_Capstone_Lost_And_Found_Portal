// src/pages/ItemDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // useParams to get ID from URL
import axios from 'axios';

// Placeholder: Get User ID (Replace later)
const getUserId = () => JSON.parse(localStorage.getItem('userData'))?._id || null;

const ItemDetailPage = () => {
    const { itemType, id } = useParams(); // Get 'itemType' (lost-items or found-items) and 'id' from URL
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- Claim Form State (Only for Found Items) ---
    const [claimName, setClaimName] = useState('');
    const [claimContact, setClaimContact] = useState('');
    const [claimDescription, setClaimDescription] = useState('');
    const [claimLoading, setClaimLoading] = useState(false);
    const [claimMessage, setClaimMessage] = useState('');
    const [claimError, setClaimError] = useState('');
    // --- End Claim Form State ---

    const loggedInUserId = getUserId(); // Get current user's ID

    useEffect(() => {
        // Validate itemType
        if (itemType !== 'lost-items' && itemType !== 'found-items') {
            setError("Invalid item type in URL.");
            setLoading(false);
            return;
        }

        const fetchItemDetails = async () => {
            setLoading(true);
            setError('');
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                // Fetch item details using the correct endpoint based on itemType
                const response = await axios.get(`${apiUrl}/api/${itemType}/${id}`);
                setItem(response.data);
            } catch (err) {
                console.error("Fetch Item Detail Error:", err);
                setError(`Failed to load item details (${err.response?.status || 'Network Error'}).`);
                if (err.response?.status === 404) {
                    setError("Item not found.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchItemDetails();
    }, [id, itemType]); // Re-fetch if ID or itemType changes

    // --- Handle Claim Submission ---
    const handleClaimSubmit = async (e) => {
        e.preventDefault();
        if (!loggedInUserId) {
            setClaimError("You must be logged in to submit a claim.");
            // Optionally redirect to login
            // navigate('/login');
            return;
        }
        if (itemType !== 'found-items') return; // Only claim found items

        setClaimLoading(true);
        setClaimMessage('');
        setClaimError('');

        try {
             const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
             // TODO: Create this backend endpoint POST /api/claims
             const response = await axios.post(`${apiUrl}/api/claims`, {
                 foundItemId: id, // ID of the item being claimed
                 claimantUserId: loggedInUserId, // ID of the user making the claim
                 claimantName: claimName,
                 contactNo: claimContact,
                 description: claimDescription,
             });
             setClaimMessage(response.data.message || "Claim submitted successfully! The finder has been notified.");
             // Clear form
             setClaimName('');
             setClaimContact('');
             setClaimDescription('');

        } catch (err) {
             console.error("Claim Submission Error:", err);
             setClaimError(err.response?.data?.message || "Failed to submit claim.");
        } finally {
             setClaimLoading(false);
        }
    };
    // --- End Handle Claim ---


    // --- Render Logic ---
    if (loading) {
        return <div className="text-center p-10">Loading item details...</div>;
    }

    if (error || !item) {
        return <div className="text-center text-red-600 p-10">{error || 'Item could not be loaded.'}</div>;
    }

    // Determine if the current logged-in user is the owner/finder
    const isOwnerOrFinder = loggedInUserId && item.createdBy?._id === loggedInUserId;
    // Determine if item type is 'found'
    const isFoundItem = itemType === 'found-items';

    // Image URLs
    const primaryImageUrl = item.images && item.images.length > 0
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${item.images[0]}`
        : '/placeholder-image.png'; // Add a placeholder image in public folder

    const govtIdImageUrl = item.userGovtID // Assuming backend sends this field name
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${item.userGovtID}`
        : null;

     const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = '/placeholder-image.png';
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">

                {/* Back Link */}
                 <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline text-sm mb-4">
                    ← Back to results
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {/* Image Gallery Section */}
                    <div className="md:col-span-1">
                        <h2 className="text-2xl font-bold mb-4">{item.name || 'Item Details'}</h2>
                        <img
                            src={primaryImageUrl}
                            alt={item.name || 'Item Image'}
                            className="w-full h-64 object-cover rounded-lg border mb-4 shadow"
                            onError={handleImageError}
                        />
                        {/* Display additional images if they exist */}
                        {item.images && item.images.length > 1 && (
                            <div className="flex flex-wrap gap-2">
                                {item.images.slice(1).map((imgFilename, index) => (
                                     <img
                                        key={index}
                                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${imgFilename}`}
                                        alt={`Item image ${index + 2}`}
                                        className="w-16 h-16 object-cover rounded border cursor-pointer hover:opacity-80" // Add onClick to show larger maybe
                                        onError={handleImageError}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="md:col-span-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${isFoundItem ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {isFoundItem ? 'Found Item' : 'Lost Item'}
                        </span>

                         <h3 className="text-lg font-semibold border-b pb-1 mb-3">Details</h3>
                         <dl className="space-y-2 text-sm text-gray-700">
                            <div className="flex justify-between">
                                <dt className="font-medium text-gray-500">{isFoundItem ? 'Date Found:' : 'Date Lost:'}</dt>
                                <dd>{new Date(item.dateFound || item.dateLost).toLocaleDateString()}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="font-medium text-gray-500">{isFoundItem ? 'Location Found:' : 'Location Lost:'}</dt>
                                <dd>{item.locationFound || item.locationLost}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="font-medium text-gray-500">Reported By:</dt>
                                <dd>{item.createdBy?.name || 'Unknown User'}</dd> { /* Assumes populate worked */}
                            </div>
                             {/* Show contact number only if the viewer is the owner/finder OR if claiming */}
                            {(isOwnerOrFinder) && (
                                <div className="flex justify-between">
                                    <dt className="font-medium text-gray-500">Reporter's Contact:</dt>
                                    <dd>{item.contactNo}</dd>
                                </div>
                            )}
                             {/* Show Govt ID only if viewer is owner/finder (Security) */}
                             {isOwnerOrFinder && govtIdImageUrl && (
                                <div className="pt-2">
                                    <dt className="font-medium text-gray-500 mb-1">Reporter's Govt ID (Private):</dt>
                                    <dd><img src={govtIdImageUrl} alt="Govt ID" className="h-20 w-auto border rounded" onError={handleImageError}/></dd>
                                </div>
                             )}
                        </dl>

                         <h3 className="text-lg font-semibold border-b pb-1 mt-6 mb-3">Description</h3>
                         <p className="text-gray-700 whitespace-pre-wrap">{item.description || 'No description provided.'}</p>


                         {/* --- Claim Section (Only for Found Items & if user is NOT the finder) --- */}
                         {isFoundItem && !isOwnerOrFinder && (
                             <div className="mt-8 border-t pt-6">
                                <h3 className="text-xl font-semibold mb-4">Claim This Item</h3>
                                {claimMessage && <p className="mb-3 text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">{claimMessage}</p>}
                                {claimError && <p className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">{claimError}</p>}

                                {!claimMessage && ( // Hide form after successful claim
                                    <form onSubmit={handleClaimSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="claimName" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                            <input type="text" id="claimName" value={claimName} onChange={(e) => setClaimName(e.target.value)} className="input-style" required />
                                        </div>
                                        <div className="mb-3">
                                             <label htmlFor="claimContact" className="block text-sm font-medium text-gray-700 mb-1">Your Contact Number</label>
                                            <input type="tel" id="claimContact" value={claimContact} onChange={(e) => setClaimContact(e.target.value)} className="input-style" required />
                                        </div>
                                         <div className="mb-4">
                                            <label htmlFor="claimDescription" className="block text-sm font-medium text-gray-700 mb-1">Proof of Ownership / Description</label>
                                            <textarea id="claimDescription" value={claimDescription} onChange={(e) => setClaimDescription(e.target.value)} rows="3" className="input-style" required placeholder="Describe something unique about the item only the owner would know..."></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={claimLoading}
                                            className={`w-full md:w-auto ${claimLoading ? 'bg-orange-400' : 'bg-orange-500 hover:bg-orange-600'} text-white font-bold py-2 px-6 rounded-md transition duration-150`}
                                        >
                                            {claimLoading ? 'Submitting Claim...' : 'Submit Claim Request'}
                                        </button>
                                    </form>
                                )}
                            </div>
                         )}
                         {/* Message if user is the finder */}
                         {isFoundItem && isOwnerOrFinder && (
                              <p className="mt-6 text-sm text-blue-600 bg-blue-50 p-3 rounded border border-blue-200">
                                 You reported this found item. You will be notified if someone submits a claim.
                             </p>
                         )}

                    </div> {/* End Details Section */}
                </div> {/* End Grid */}
            </div> {/* End Card */}
             <style jsx>{`
                .input-style { @apply shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent; }
            `}</style>
        </div> // End Container
    );
};

export default ItemDetailPage;