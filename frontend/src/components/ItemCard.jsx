// src/components/ItemCard.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for navigation

const ItemCard = ({ item }) => {
    // Infer type and set up link based on backend structure
    // IMPORTANT: Check if your backend actually returns a 'type' field
    // If not, infer based on dateLost/dateFound existing
    const itemType = item.type || (item.dateLost ? 'lost-items' : 'found-items');
    const itemStatus = itemType === 'lost-items' ? 'Lost' : 'Found';
    const statusColor = itemType === 'lost-items' ? 'text-red-500 bg-red-50' : 'text-green-500 bg-green-50';
    // --- Dynamic Link Construction ---
    const detailLink = `/${itemType}/${item._id}`; // e.g., /lost-items/123 or /found-items/456

    const imageUrl = item.images && item.images.length > 0
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${item.images[0]}`
        : '/placeholder-image.png';

    const handleImageError = (e) => { /* ... same error handling ... */ };

    return (
        <div className="border rounded-lg overflow-hidden shadow-md bg-white flex flex-col transition-shadow duration-200 hover:shadow-xl">
            {/* Image */}
            <div className="w-full h-48 bg-gray-200">
                 <img src={imageUrl} alt={item.name || 'Item image'} className="w-full h-full object-cover" onError={handleImageError} />
            </div>
            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg mb-1 truncate">{item.name || 'Unnamed Item'}</h3>
                <p className="text-xs text-gray-500 mb-2">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>{itemStatus}</span>
                    {' on '} {new Date(item.dateLost || item.dateFound).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3 flex-grow">{item.description || 'No description.'}</p>
                {/* --- Updated Link --- */}
                <Link
                    to={detailLink} // Use the dynamically constructed link
                    className="mt-auto block text-center w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
                >
                    View Details {itemType === 'found-items' ? '/ Claim' : ''} {/* Adjust text */}
                </Link>
            </div>
        </div>
    );
};

export default ItemCard;