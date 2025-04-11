const express = require("express");
const router = express.Router();
const LostItem = require("../models/LostItem"); // Import LostItem Schema

// 📌 POST Endpoint: Report a Lost Item
router.post("/", async (req, res) => {
  try {
    const { name, userGovtID, images, dateLost, locationLost, contactNo, description } = req.body;

    // Create a new Lost Item entry
    const lostItem = new LostItem({
      name,
      userGovtID,
      images,
      dateLost,
      locationLost,
      contactNo,
      description,
    });

    // Save to the database
    await lostItem.save();
    res.status(201).json({ message: "Lost item reported successfully!", lostItem });

  } catch (error) {
    res.status(500).json({ error: "Failed to report lost item", details: error.message });
  }
});

module.exports = router;
