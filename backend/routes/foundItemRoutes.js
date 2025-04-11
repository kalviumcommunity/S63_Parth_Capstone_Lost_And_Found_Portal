const express = require("express");
const FoundItem = require("../models/FoundItem");

const router = express.Router();

// Report Found Item
router.post("/found-item", async (req, res) => {
  try {
    const foundItem = new FoundItem(req.body);
    await foundItem.save();
    res.status(201).json({ message: "Found item reported successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to report found item" });
  }
});

module.exports = router;
