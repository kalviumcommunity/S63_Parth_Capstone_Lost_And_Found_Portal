// backend/routes/userReportsRoutes.js
const express = require("express");
const router = express.Router();
const LostItem = require("../models/LostItem");
const FoundItem = require("../models/FoundItem");
const ClaimRequest = require("../models/ClaimRequest"); // <<<--- IMPORT ClaimRequest model

// 🔍 GET /api/user/:userId/reports - MODIFIED
router.get("/:userId/reports", async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch lost items created by the user (populate creator)
        const lostItems = await LostItem.find({ createdBy: userId })
            .populate('createdBy', 'name email profilePicture')
            .sort({ createdAt: -1 }); // Optional: sort by newest first

        // Fetch found items created by the user (populate creator)
        const foundItems = await FoundItem.find({ createdBy: userId })
            .populate('createdBy', 'name email profilePicture')
            .sort({ createdAt: -1 }); // Optional: sort by newest first

        // --- NEW: Fetch claims for the found items ---
        // Create an array of the IDs of the found items
        const foundItemIds = foundItems.map(item => item._id);

        // Find all claims where the 'foundItemId' is in the list of IDs we found
        const claims = await ClaimRequest.find({
            foundItemId: { $in: foundItemIds }
        })
        .populate('claimantUserId', 'name email profilePicture') // Get claimant details
        .sort({ createdAt: -1 });

        // --- Organize claims by foundItemId for easy access on frontend ---
        const claimsByItem = {};
        claims.forEach(claim => {
            const itemIdString = claim.foundItemId.toString(); // Convert ObjectId to string for key
            if (!claimsByItem[itemIdString]) {
                claimsByItem[itemIdString] = [];
            }
            claimsByItem[itemIdString].push(claim);
        });
        // --- END NEW ---

        // Send back lost items, found items, and the organized claims
        res.status(200).json({
            lostItems,
            foundItems,
            claimsByItem // Send the claims object
        });

    } catch (error) {
        console.error("Error fetching user reports and claims:", error);
        res.status(500).json({ error: "Error fetching user reports", details: error.message });
    }
});

module.exports = router;