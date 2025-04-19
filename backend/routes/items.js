// backend/routes/items.js (or searchRoutes.js)

const express = require('express');
const router = express.Router();
const LostItem = require('../models/LostItem'); // Import both models
const FoundItem = require('../models/FoundItem');

// --- Search Route ---
// @route   GET /api/search?query=...
// @desc    Search both lost and found items by name (case-insensitive)
// @access  Public
router.get('/search', async (req, res) => {
    const { query } = req.query; // Get the search term from query parameters

    if (!query) {
        return res.status(400).json({ message: 'Search query parameter is required.' });
    }

    try {
        // Create a case-insensitive regex search pattern
        const searchPattern = new RegExp(query, 'i'); // 'i' makes it case-insensitive

        // Find matching lost items
        const lostResults = await LostItem.find({
            name: searchPattern // Search the 'name' field
        }).populate('createdBy', 'name email profilePicture'); // Optional: Populate user data

        // Find matching found items
        const foundResults = await FoundItem.find({
            name: searchPattern // Search the 'name' field
        }).populate('createdBy', 'name email profilePicture'); // Optional: Populate user data

        // Combine results (add a 'type' if your frontend needs it)
        const combinedResults = [
            ...lostResults.map(item => ({ ...item.toObject(), type: 'lost' })), // Add type:'lost'
            ...foundResults.map(item => ({ ...item.toObject(), type: 'found' })) // Add type:'found'
        ];

        // Optional: Sort results if needed (e.g., by date)
        // combinedResults.sort((a, b) => new Date(b.dateLost || b.dateFound) - new Date(a.dateLost || a.dateFound));

        res.json(combinedResults); // Send combined results back

    } catch (error) {
        console.error("Search API Error:", error);
        res.status(500).json({ message: 'Server error during search.', error: error.message });
    }
});

// --- Add other item-related routes here if this is items.js ---

module.exports = router;