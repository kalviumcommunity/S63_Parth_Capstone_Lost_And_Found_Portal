// backend/routes/claimRoutes.js
const express = require('express');
const router = express.Router();
const ClaimRequest = require('../models/ClaimRequest'); // <<<--- IMPORT the new model
// Optional: Import FoundItem if you need to check if it exists before saving claim
// const FoundItem = require('../models/FoundItem');

// @route   POST /api/claims
// @desc    Submit a claim request for a found item and save to DB
// @access  Private (should be protected later)
router.post('/', async (req, res) => {
    // Destructure data from the request body
    const { foundItemId, claimantUserId, claimantName, contactNo, description } = req.body;

    // --- Basic Input Validation ---
    if (!foundItemId || !claimantUserId || !claimantName || !contactNo || !description) {
        return res.status(400).json({ message: 'Missing required claim information.' });
    }
    // Optional: Add more specific validation (e.g., check if IDs are valid ObjectId format)
    // --- End Validation ---

    try {
        // Optional: Check if the foundItem actually exists
        // const itemExists = await FoundItem.findById(foundItemId);
        // if (!itemExists) {
        //     return res.status(404).json({ message: 'The item being claimed does not exist.' });
        // }

        // Create a new ClaimRequest document using the model
        const newClaim = new ClaimRequest({
            foundItemId,
            claimantUserId,
            claimantName,
            contactNo,
            description,
            status: 'Pending' // Set initial status
        });

        // --- Save the claim to the database ---
        const savedClaim = await newClaim.save(); // <<<--- SAVE TO MONGODB

        // TODO: Notify the finder of the item (itemExists.createdBy) - this requires more logic (e.g., websockets or email)

        // Respond with success message and the saved claim data
        res.status(201).json({
            message: 'Claim submitted successfully and saved. The item reporter will be notified.',
            claim: savedClaim // Send back the created claim object
        });

    } catch (error) {
        console.error("Claim submission database error:", error);
        // Check for Mongoose validation errors
        if (error.name === 'ValidationError') {
             return res.status(400).json({ message: 'Claim validation failed.', errors: error.errors });
        }
        res.status(500).json({ message: 'Server error while submitting claim.' });
    }
});

// TODO: Add routes later to GET claims (e.g., for a specific item or by a user)
// TODO: Add routes later to UPDATE claim status (e.g., PATCH /api/claims/:claimId/approve)

module.exports = router;