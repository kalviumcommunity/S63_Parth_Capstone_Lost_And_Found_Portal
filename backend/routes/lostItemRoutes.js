const express = require("express");
const router = express.Router();
const LostItem = require("../models/LostItem"); // Import LostItem Schema

// 📌 POST Endpoint: Report a Lost Item
router.post("/", async (req, res) => {
  try {
    const { name, userGovtID, images, dateLost, locationLost, contactNo, description, createdBy } = req.body;

    // Create a new Lost Item entry
    const lostItem = new LostItem({
      name,
      userGovtID,
      images,
      dateLost,
      locationLost,
      contactNo,
      description,
      createdBy,
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
    const items = await LostItem.find().populate('createdBy', 'name email');
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
    const item = await LostItem.findById(req.params.id).populate('createdBy', 'name email');

    if (!updatedItem) {
      return res.status(404).json({ message: "Lost item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// 🗑 DELETE lost item by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await LostItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Lost item not found' });
    }
    res.json({ message: 'Lost item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting item', error: error.message });
  }
});

module.exports = router;
