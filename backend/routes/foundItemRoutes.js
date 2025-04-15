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

// Get all found items
router.get('/', async (req, res) => {
  try {
    const items = await FoundItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching found items.' });
  }
});

// Get found item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Found item not found.' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching item.' });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedItem = await FoundItem.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Found item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
