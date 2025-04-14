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

// Get all lost items
router.get('/', async (req, res) => {
  try {
    const items = await LostItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching lost items.' });
  }
});
// Get lost item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Lost item not found.' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching item.' });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const updatedItem = await LostItem.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Lost item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
module.exports = router;
