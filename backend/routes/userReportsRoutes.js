const express = require("express");
const router = express.Router();
const LostItem = require("../models/LostItem");
const FoundItem = require("../models/FoundItem");

// 🔍 GET /api/user/:userId/reports
router.get("/:userId/reports", async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch lost items created by the user
    const lostItems = await LostItem.find({ createdBy: userId }).populate('createdBy', 'name email');

    // Fetch found items created by the user
    const foundItems = await FoundItem.find({ createdBy: userId }).populate('createdBy', 'name email');

    res.status(200).json({ lostItems, foundItems });
  } catch (error) {
    res.status(500).json({ error: "Error fetching user reports", details: error.message });
  }
});

module.exports = router;
