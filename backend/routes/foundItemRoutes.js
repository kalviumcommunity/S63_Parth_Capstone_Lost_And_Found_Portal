const express = require("express");
const router = express.Router();
const FoundItem = require("../models/FoundItem"); // Import FoundItem Schema

// 📌 POST Endpoint: Report a Found Item
router.post("/", async (req, res) => {
  try {
    const { name, userGovtID, images, dateFound, locationFound, contactNo, description } = req.body;

    // Create a new Found Item entry
    const foundItem = new FoundItem({
      name,
      userGovtID,
      images,
      dateFound,
      locationFound,
      contactNo,
      description,
    });

    // Save to the database
    await foundItem.save();
    res.status(201).json({ message: "Found item reported successfully!", foundItem });

  } catch (error) {
    res.status(500).json({ error: "Failed to report found item", details: error.message });
  }
});

module.exports = router;
