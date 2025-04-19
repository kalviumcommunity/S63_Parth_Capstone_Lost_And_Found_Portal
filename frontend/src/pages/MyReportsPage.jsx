// src/pages/MyReportsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ItemCard from '../components/ItemCard'; // Reuse the ItemCard component

// Placeholder: Get User ID (Replace with Auth Context later)
const getUserIdAndToken = () => {
    const userDataString = localStorage.getItem('userData');
    const token = localStorage.getItem('authToken');
    if (userDataString) { // Removed token check for now, as not using it yet
        try {
            const userData = JSON.parse(userDataString);
            return { userId: userData._id, token }; // Return token even if not used yet
        } catch (e) {
            console.error("Error parsing user data", e);
            return { userId: null, token: null };
        }
    }
    return { userId: null, token: null };
};
// --- End Placeholder ---

// --- ClaimDetails Component (Displays a single claim) ---
const ClaimDetails = ({ claim, onApprove, onReject }) => {
    return (
        <div className="border border-yellow-300 bg-yellow-50 p-3 rounded-md mt-2 text-sm shadow-sm">
            <p>
                <strong className="font-semibold">Claimant:</strong> {claim.claimantName}
                {claim.claimantUserId?.name && ` (${claim.claimantUserId.name})`}{/* Show name if populated */}
            </p>
            <p><strong className="font-semibold">Contact:</strong> {claim.contactNo}</p>
            <p className="mt-1"><strong className="font-semibold">Message/Proof:</strong></p>
            <p className="whitespace-pre-wrap bg-white p-2 rounded border border-yellow-200 text-xs my-1 max-h-20 overflow-y-auto">
                {claim.description}
            </p>
            <p className="text-xs text-gray-500">Submitted: {new Date(claim.createdAt).toLocaleString()}</p>

            {/* Approve/Reject Buttons for Pending Claims */}
            {claim.status === 'Pending' && (
                <div className="mt-2 flex gap-2">
                    <button
                        onClick={() => onApprove(claim._id)} // Pass claim ID to handler
                        className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow transition duration-150 ease-in-out"
                        title="Approve this claim"
                    >
                        Approve ✅
                    </button>
                    <button
                         onClick={() => onReject(claim._id)} // Pass claim ID to handler
                         className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded shadow transition duration-150 ease-in-out"
                         title="Reject this claim"
                    >
                        Reject ❌
                    </button>
                </div>
            )}
            {/* Display status if not pending */}
            {claim.status !== 'Pending' && (
                 <p className={`mt-2 text-xs font-semibold ${claim.status === 'Approved' ? 'text-green-700' : 'text-red-700'}`}>
                     Status: {claim.status}
                 </p>
            )}
        </div>
    );
};
// --- END ClaimDetails Component ---


const MyReportsPage = () => {
    const [lostItems, setLostItems] = useState([]);
    const [foundItems, setFoundItems] = useState([]);
    const [claimsByItem, setClaimsByItem] = useState({}); // <<<--- ADDED state for claims
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { userId, token } = getUserIdAndToken(); // Get user ID and token

    // --- Fetch Reports and Claims ---
    useEffect(() => {
        if (!userId) {
            setError("Please log in to view your reports.");
            setLoading(false);
            return;
        }

        const fetchMyReportsAndClaims = async () => {
            setLoading(true);
            setError('');
            setLostItems([]); // Clear previous data
            setFoundItems([]);
            setClaimsByItem({});

            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const response = await axios.get(`${apiUrl}/api/user/${userId}/reports`, {
                     // headers: { Authorization: `Bearer ${token}` }, // Uncomment when auth is implemented
                });

                // Store fetched data in state
                setLostItems(response.data.lostItems || []);
                setFoundItems(response.data.foundItems || []);
                setClaimsByItem(response.data.claimsByItem || {}); // <<<--- Store claims

                if (!response.data.lostItems?.length && !response.data.foundItems?.length) {
                     setError("You haven't reported any lost or found items yet.");
                }

            } catch (err) {
                console.error("Fetch My Reports Error:", err.response?.data || err.message);
                setError(`Failed to fetch your reports (${err.response?.status || 'Network Error'}). Please try again.`);
            } finally {
                setLoading(false);
            }
        };

        fetchMyReportsAndClaims();
    }, [userId]); // Dependency array


    // --- Handle Deleting a Report ---
    const handleDelete = async (itemId, itemType) => {
        if (!window.confirm(`Are you sure you want to delete this ${itemType} item report? This action cannot be undone.`)) {
            return;
        }
        console.log(`Deleting ${itemType} item: ${itemId}`);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const endpoint = itemType === 'lost' ? `/api/lost-items/${itemId}` : `/api/found-items/${itemId}`;
            await axios.delete(`${apiUrl}${endpoint}`, {
                 // headers: { Authorization: `Bearer ${token}` }, // Add auth later
            });

            // Update state to remove the deleted item visually
            if (itemType === 'lost') {
                setLostItems(prev => prev.filter(item => item._id !== itemId));
            } else {
                setFoundItems(prev => prev.filter(item => item._id !== itemId));
                // Also remove claims for the deleted found item from state (optional but good practice)
                setClaimsByItem(prevClaims => {
                    const newClaims = {...prevClaims};
                    delete newClaims[itemId];
                    return newClaims;
                });
            }
            alert(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} item deleted successfully.`);
        } catch (err) {
             console.error(`Delete ${itemType} Item Error:`, err.response?.data || err.message);
             alert(`Failed to delete ${itemType} item. Please try again.`);
        }
    };

    // --- Handle Approving/Rejecting Claims (Placeholders) ---
    const handleApproveClaim = async (claimId) => {
        // TODO: Implement Backend Call PATCH /api/claims/:claimId/status { status: 'Approved' }
        alert(`Approve claim ID: ${claimId} - Needs backend integration.`);
        // OPTIONAL: Update local state immediately for better UX
        // setClaimsByItem(prev => updateClaimStatus(prev, claimId, 'Approved'));
    };

    const handleRejectClaim = async (claimId) => {
         // TODO: Implement Backend Call PATCH /api/claims/:claimId/status { status: 'Rejected' }
         alert(`Reject claim ID: ${claimId} - Needs backend integration.`);
          // OPTIONAL: Update local state immediately
         // setClaimsByItem(prev => updateClaimStatus(prev, claimId, 'Rejected'));
    };
    // --- End Handlers ---


    // --- Render Logic ---
    return (
        <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-150px)]">
            <h1 className="text-2xl md:text-3xl font-bold mb-8 border-b pb-3">My Reported Items</h1>

            {/* Loading Indicator */}
            {loading && (
                 <div className="flex justify-center items-center p-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-500">Loading your reports...</span>
                </div>
            )}

            {/* Error Message */}
            {error && !loading && (
                <p className="text-center text-yellow-700 bg-yellow-50 p-4 rounded-md border border-yellow-200">{error}</p>
            )}

            {/* --- Lost Items Section --- */}
            {!loading && !error && lostItems.length >= 0 && ( // Render even if empty to show header
                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Items You Reported Lost ({lostItems.length})</h2>
                    {lostItems.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {lostItems.map((item) => (
                                <div key={item._id} className="relative group"> {/* Added group for hover effect on buttons */}
                                    <ItemCard item={{...item, type: 'lost'}} />
                                    {/* Edit/Delete Buttons */}
                                    <div className="absolute top-2 right-2 flex gap-1 bg-white p-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                         {/* <button className="text-xs text-blue-600 hover:text-blue-800 p-1" title="Edit report">✏️ Edit</button> */}
                                         <button
                                            onClick={() => handleDelete(item._id, 'lost')}
                                            className="text-xs text-red-600 hover:text-red-800 p-1"
                                            title="Delete this report"
                                         >
                                             🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm italic">You have not reported any lost items.</p>
                    )}
                </section>
            )}

             {/* --- Found Items Section (With Claims Display) --- */}
            {!loading && !error && foundItems.length >= 0 && ( // Render even if empty
                 <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Items You Reported Found ({foundItems.length})</h2>
                     {foundItems.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {foundItems.map((item) => {
                                // Get claims for THIS specific found item
                                const itemClaims = claimsByItem[item._id] || [];

                                return (
                                     <div key={item._id} className="relative border border-gray-200 rounded-lg bg-gray-50 p-1 flex flex-col group"> {/* Wrapper card + group */}
                                         {/* Item Card */}
                                         <ItemCard item={{...item, type: 'found'}} />

                                         {/* Edit/Delete Buttons for the Found Item Report */}
                                        <div className="absolute top-3 right-3 flex gap-1 bg-white p-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                             {/* <button className="text-xs text-blue-600 hover:text-blue-800 p-1" title="Edit report">✏️ Edit</button> */}
                                            <button
                                                onClick={() => handleDelete(item._id, 'found')}
                                                className="text-xs text-red-600 hover:text-red-800 p-1"
                                                title="Delete this report"
                                            >
                                                 🗑️ Delete
                                            </button>
                                        </div>

                                         {/* --- Display Claims Section --- */}
                                         <div className="mt-2 px-2 pb-2 border-t border-gray-200 pt-2">
                                             <h4 className="text-sm font-semibold text-gray-600 mb-1">
                                                 Claim Requests ({itemClaims.length})
                                             </h4>
                                             {itemClaims.length > 0 ? (
                                                 <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar"> {/* Scrollable claims */}
                                                     {itemClaims.map(claim => (
                                                         <ClaimDetails
                                                             key={claim._id}
                                                             claim={claim}
                                                             onApprove={handleApproveClaim} // Pass down handlers
                                                             onReject={handleRejectClaim}
                                                         />
                                                     ))}
                                                 </div>
                                              ) : (
                                                 <p className="text-xs text-gray-500 italic mt-1">No claims submitted yet.</p>
                                              )}
                                         </div>
                                         {/* --- End Claims Section --- */}
                                    </div> // End Wrapper card
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm italic">You have not reported any found items.</p>
                    )}
                </section>
            )}
             {/* Add custom scrollbar style */}
             <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px;}
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px;}
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #aaa; }
             `}</style>
        </div> // End container
    );
};

export default MyReportsPage;