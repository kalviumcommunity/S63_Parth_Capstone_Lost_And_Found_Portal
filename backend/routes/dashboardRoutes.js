// backend/routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const LostItem = require("../models/LostItem");
const FoundItem = require("../models/FoundItem");
const ClaimRequest = require("../models/ClaimRequest");

// GET /api/dashboard
// Get dashboard data for regular users
router.get("/", async (req, res) => {
  try {
    // Get total counts
    const totalLostItems = await LostItem.countDocuments();
    const totalFoundItems = await FoundItem.countDocuments();
    const totalClaims = await ClaimRequest.countDocuments();
    
    // Get recent lost items (limit to 5)
    const recentLostItems = await LostItem.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name email profilePicture');
    
    // Get recent found items (limit to 5)
    const recentFoundItems = await FoundItem.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name email profilePicture');
    
    // Get recent approved claims (successful matches, limit to 5)
    const recentApprovedClaims = await ClaimRequest.find({ status: 'Approved' })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('foundItemId')
      .populate('claimantUserId', 'name email profilePicture');
    
    // Return all data
    res.status(200).json({
      statistics: {
        totalLostItems,
        totalFoundItems,
        totalClaims,
        approvedClaims: await ClaimRequest.countDocuments({ status: 'Approved' }),
        pendingClaims: await ClaimRequest.countDocuments({ status: 'Pending' })
      },
      recentLostItems,
      recentFoundItems,
      recentApprovedClaims
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Error fetching dashboard data", details: error.message });
  }
});

// GET /api/dashboard/user/:userId
// Get dashboard data specific to a user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Get user-specific counts
    const userLostItems = await LostItem.countDocuments({ createdBy: userId });
    const userFoundItems = await FoundItem.countDocuments({ createdBy: userId });
    
    // Get claims made by the user
    const userClaims = await ClaimRequest.countDocuments({ claimantUserId: userId });
    
    // Get claims on items found by the user
    const foundItemIds = await FoundItem.find({ createdBy: userId }).distinct('_id');
    const claimsOnUserItems = await ClaimRequest.countDocuments({ 
      foundItemId: { $in: foundItemIds } 
    });
    
    // Get user's recent lost items
    const recentUserLostItems = await LostItem.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .limit(3);
    
    // Get user's recent found items
    const recentUserFoundItems = await FoundItem.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .limit(3);
    
    // Return user-specific dashboard data
    res.status(200).json({
      userStatistics: {
        lostItems: userLostItems,
        foundItems: userFoundItems,
        claimsMade: userClaims,
        claimsReceived: claimsOnUserItems,
        approvedClaimsMade: await ClaimRequest.countDocuments({ 
          claimantUserId: userId, 
          status: 'Approved' 
        }),
        pendingClaimsMade: await ClaimRequest.countDocuments({ 
          claimantUserId: userId, 
          status: 'Pending' 
        })
      },
      recentUserLostItems,
      recentUserFoundItems
    });
  } catch (error) {
    console.error("Error fetching user dashboard data:", error);
    res.status(500).json({ error: "Error fetching user dashboard data", details: error.message });
  }
});

module.exports = router;