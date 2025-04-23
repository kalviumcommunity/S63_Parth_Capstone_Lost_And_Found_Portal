// src/pages/MyReportsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ItemCard from '../components/ItemCard';

// --- Corrected Function to Get User ID and Token ---
const getUserIdAndToken = () => {
    const defaultState = { userId: null, token: null }; // Define default return
    try {
        const token = localStorage.getItem('authToken');
        const userDataString = localStorage.getItem('userData');

        // Check if both items exist in localStorage
        if (token && userDataString) {
            const userData = JSON.parse(userDataString);
            // Ensure the parsed data has an _id
            if (userData && userData._id) {
                return { userId: userData._id, token }; // Return valid data
            }
        }
    } catch (error) {
        // Log error if JSON parsing fails or localStorage access fails
        console.error("Error retrieving auth data from localStorage:", error);
    }
    // If checks fail or an error occurs, return the default null state
    return defaultState;
};
// --- End Corrected Function ---


// --- ClaimDetails Component ---
const ClaimDetails = ({ claim, onApprove, onReject }) => {
    return (
        <div className="border border-yellow-300 bg-yellow-50 p-3 rounded-md mt-2 text-sm shadow-sm">
            <p><strong className="font-semibold">Claimant:</strong> {claim.claimantName}</p>
            <p><strong className="font-semibold">Contact:</strong> {claim.contactNo}</p>
            <p className="mt-1"><strong className="font-semibold">Message/Proof:</strong></p>
            <p className="whitespace-pre-wrap bg-white p-2 rounded border border-yellow-200 text-xs my-1 max-h-20 overflow-y-auto">
                {claim.description}
            </p>
            <p className="text-xs text-gray-500">Submitted: {new Date(claim.createdAt).toLocaleString()}</p>
            {claim.status === 'Pending' && (
                <div className="mt-2 flex gap-2">
                    <button onClick={() => onApprove(claim._id)} className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow transition duration-150 ease-in-out" title="Approve claim"> Approve ✅ </button>
                    <button onClick={() => onReject(claim._id)} className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded shadow transition duration-150 ease-in-out" title="Reject claim"> Reject ❌ </button>
                </div>
            )}
            {claim.status !== 'Pending' && ( <p className={`mt-2 text-xs font-semibold ${claim.status === 'Approved' ? 'text-green-700' : 'text-red-700'}`}> Status: {claim.status} </p>)}
        </div>
    );
};
// --- End ClaimDetails Component ---


const MyReportsPage = () => {
    const [lostItems, setLostItems] = useState([]);
    const [foundItems, setFoundItems] = useState([]);
    const [claimsByItem, setClaimsByItem] = useState({});
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // For claim approve/reject loading
    const [error, setError] = useState('');

    const { userId, token } = getUserIdAndToken(); // Uses the corrected function

    // Fetch initial data
    const fetchMyReportsAndClaims = useCallback(async () => {
        if (!userId) {
            setError("Please log in to view your reports."); setLoading(false); return;
        }
        setLoading(true); setError(''); setClaimsByItem({}); setLostItems([]); setFoundItems([]);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.get(`${apiUrl}/api/user/${userId}/reports`, {
                 // headers: { Authorization: `Bearer ${token}` }, // Add when auth implemented
            });
            setLostItems(response.data.lostItems || []);
            setFoundItems(response.data.foundItems || []);
            setClaimsByItem(response.data.claimsByItem || {});
            if (!response.data.lostItems?.length && !response.data.foundItems?.length) {
                 setError("You haven't reported any items yet.");
            }
        } catch (err) {
             console.error("Fetch My Reports Error:", err.response?.data || err.message);
             setError(`Failed to fetch your reports (${err.response?.status || 'Network Error'}). Please try again.`);
             setLostItems([]); setFoundItems([]); setClaimsByItem({});
        } finally { setLoading(false); }
    }, [userId]); // Dependency: userId

    useEffect(() => {
        fetchMyReportsAndClaims();
    }, [fetchMyReportsAndClaims]);


    // Handle Deleting a Report
    const handleDelete = async (itemId, itemType) => {
         if (!window.confirm(`Are you sure you want to delete this ${itemType} item report?`)) return;
        console.log(`Deleting ${itemType} item: ${itemId}`);
        // Add loading state for delete if needed
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const endpoint = itemType === 'lost' ? `/api/lost-items/${itemId}` : `/api/found-items/${itemId}`;
            await axios.delete(`${apiUrl}${endpoint}`, { /* headers: { Authorization: `Bearer ${token}` } */ });
            // Update state
            if (itemType === 'lost') setLostItems(prev => prev.filter(item => item._id !== itemId));
            else {
                setFoundItems(prev => prev.filter(item => item._id !== itemId));
                setClaimsByItem(prev => { const n = {...prev}; delete n[itemId]; return n; });
            }
            alert(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} item deleted successfully.`);
        } catch (err) { /* ... error handling ... */ }
        // finally { // Remove delete loading state }
    };

    // --- Function to Update Claim Status ---
    const updateClaimStatus = async (claimId, status) => {
        setActionLoading(claimId);
        console.log(`Updating claim ${claimId} to status: ${status}`);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.patch(`${apiUrl}/api/claims/${claimId}/status`, { status }, { /* headers */ });
            // Update Local State Immediately
            setClaimsByItem(prevClaimsByItem => {
                const updatedClaims = { ...prevClaimsByItem };
                for (const itemId in updatedClaims) {
                    const claimIndex = updatedClaims[itemId].findIndex(c => c._id === claimId);
                    if (claimIndex > -1) {
                        updatedClaims[itemId] = [
                            ...updatedClaims[itemId].slice(0, claimIndex),
                            response.data.claim,
                            ...updatedClaims[itemId].slice(claimIndex + 1),
                        ];
                        break;
                    }
                } return updatedClaims;
            });
            alert(`Claim successfully ${status.toLowerCase()}!`);
        } catch (err) { /* ... error handling ... */ }
        finally { setActionLoading(null); }
    };

    const handleApproveClaim = (claimId) => updateClaimStatus(claimId, 'Approved');
    const handleRejectClaim = (claimId) => updateClaimStatus(claimId, 'Rejected');
    // --- ---

    // --- Render Logic ---
    return (
        <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-150px)]">
            <h1 className="text-2xl md:text-3xl font-bold mb-8 border-b pb-3">My Reported Items</h1>

            {/* Loading / Error */}
            {loading && <p className="text-center text-gray-500 py-10">Loading your reports...</p>}
            {error && !loading && <p className="text-center text-yellow-700 bg-yellow-50 p-4 rounded-md border border-yellow-200">{error}</p>}

            {/* Lost Items */}
            {!loading && !error && lostItems.length >= 0 && (
                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Items You Reported Lost ({lostItems.length})</h2>
                    {lostItems.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {lostItems.map((item) => ( <div key={item._id} className="relative group"> <ItemCard item={{...item, type: 'lost'}} /> <div className="absolute top-2 right-2 flex gap-1 bg-white p-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200"> <button onClick={() => handleDelete(item._id, 'lost')} className="text-xs text-red-600 hover:text-red-800 p-1" title="Delete this report">🗑️ Delete</button> </div> </div> ))}
                        </div>
                    ) : ( <p className="text-gray-500 text-sm italic">You have not reported any lost items.</p> )}
                </section>
            )}

             {/* Found Items */}
            {!loading && !error && foundItems.length >= 0 && (
                 <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Items You Reported Found ({foundItems.length})</h2>
                     {foundItems.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {foundItems.map((item) => {
                                const itemClaims = claimsByItem[item._id] || [];
                                return (
                                     <div key={item._id} className="relative border border-gray-200 rounded-lg bg-gray-50 p-1 flex flex-col group">
                                         <ItemCard item={{...item, type: 'found'}} />
                                         <div className="absolute top-3 right-3 flex gap-1 bg-white p-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200"> <button onClick={() => handleDelete(item._id, 'found')} className="text-xs text-red-600 hover:text-red-800 p-1" title="Delete report">🗑️ Delete</button> </div>
                                         {/* Claims Section */}
                                         <div className="mt-2 px-2 pb-2 border-t border-gray-200 pt-2">
                                             <h4 className="text-sm font-semibold text-gray-600 mb-1">Claim Requests ({itemClaims.length})</h4>
                                             {itemClaims.length > 0 ? (
                                                 <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                                     {itemClaims.map(claim => ( <ClaimDetails key={claim._id} claim={claim} onApprove={handleApproveClaim} onReject={handleRejectClaim} /> ))}
                                                 </div>
                                              ) : ( <p className="text-xs text-gray-500 italic mt-1">No claims yet.</p> )}
                                         </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : ( <p className="text-gray-500 text-sm italic">You have not reported any found items.</p> )}
                </section>
            )}
            {/* Scrollbar style */}
            <style jsx>{`/* ... scrollbar style ... */`}</style>
        </div>
    );
};

export default MyReportsPage;