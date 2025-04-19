// src/components/ItemCard.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for navigation

const ItemCard = ({ item }) => {
    // --- Determine item type and setup links/styles ---
    // Check if backend explicitly sends 'type', otherwise infer from date fields
    // Ensure your backend search/list endpoints actually INCLUDE dateLost/dateFound
    let itemType = 'unknown'; // Default type
    if (item.type) {
        itemType = item.type === 'lost' ? 'lost-items' : 'found-items';
    } else if (item.dateLost) {
        itemType = 'lost-items';
    } else if (item.dateFound) {
        itemType = 'found-items';
    }

    const itemStatus = itemType === 'lost-items' ? 'Lost' : 'Found';
    const statusColor = itemType === 'lost-items' ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'; // Slightly stronger colors

    // Construct the link to the detail page
    // Make sure item._id is available
    const detailLink = item._id ? `/${itemType}/${item._id}` : '#'; // Fallback link if no ID

    // --- Image Handling ---
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const placeholderImg = '/placeholder-image.png'; // Ensure this exists in your /public folder

    const imageUrl = item.images && item.images.length > 0 && item.images[0]
        ? `${apiUrl}/uploads/${item.images[0]}`
        : placeholderImg;

    const handleImageError = (e) => {
        e.target.onerror = null; // Prevent infinite loops if placeholder also fails
        e.target.src = placeholderImg;
        e.target.style.objectFit = 'contain'; // Adjust fit style for placeholder
        console.warn(`Failed to load image: ${item.images?.[0]}`); // Log warning
    };
    // --- End Image Handling ---

    return (
        // --- Main Card Container ---
        // Added group class for potential hover effects on children
        <div className="group border rounded-lg overflow-hidden shadow-md bg-white flex flex-col transition-shadow duration-300 hover:shadow-xl h-full"> {/* Ensure full height */}

            {/* Image Section */}
            <Link to={detailLink} className="block w-full h-48 bg-gray-100 overflow-hidden"> {/* Make image clickable */}
                 <img
                    src={imageUrl}
                    alt={item.name || 'Item image'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" // Added hover effect
                    onError={handleImageError}
                 />
            </Link>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-grow"> {/* flex-grow pushes button to bottom */}
                {/* Item Name */}
                <h3 className="font-semibold text-lg mb-1 truncate" title={item.name || 'Unnamed Item'}>
                    {item.name || 'Unnamed Item'}
                </h3>

                {/* Status and Date */}
                <p className="text-xs text-gray-500 mb-2">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                        {itemStatus}
                    </span>
                    {' on '}
                    {/* Safely format date */}
                    {item.dateLost || item.dateFound ? new Date(item.dateLost || item.dateFound).toLocaleDateString() : 'N/A'}
                </p>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-4 line-clamp-3 flex-grow"> {/* Use flex-grow here */}
                    {item.description || 'No description provided.'}
                </p>

                {/* View Details / Claim Link */}
                <Link
                    to={detailLink}
                    className="mt-auto block text-center w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    View Details {itemType === 'found-items' ? '/ Claim' : ''}
                </Link>
            </div>
        </div>
    );
};

export default ItemCard;