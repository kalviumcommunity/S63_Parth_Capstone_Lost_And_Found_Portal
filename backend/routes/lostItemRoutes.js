const express = require("express");
const LostItem = require("../models/LostItem");

const router = express.Router();

// Report Lost Item
router.post("/lost-item", async (req, res) => {
  try {
    const lostItem = new LostItem(req.body);
    await lostItem.save();
    res.status(201).json({ message: "Lost item reported successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to report lost item" });
  }
});

module.exports = router;
