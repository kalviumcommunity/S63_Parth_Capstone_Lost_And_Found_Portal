const express = require("express");
const router = express.Router();
const LostItem = require("../models/LostItem"); // Import LostItem Schema
const upload = require("../middleware/uploadMiddleware");

// 📌 POST Endpoint: Report a Lost Item
router.post("/", upload.fields([
  { name: "userGovtID", maxCount: 1 },
  { name: "images", maxCount: 5 }
]), async (req, res) => {
  try {
    const { name, dateLost, locationLost, contactNo, description, createdBy } = req.body;

    const userGovtID = req.files.userGovtID?.[0].filename;
    const images = req.files.images?.map(file => file.filename);

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

    await lostItem.save();
    res.status(201).json({ message: "Lost item submitted!", lostItem });

  } catch (error) {
    res.status(500).json({ error: "Upload failed", details: error.message });
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
    // Add .populate() here
    const item = await LostItem.findById(req.params.id).populate('createdBy', 'name email');
    if (!item) return res.status(404).json({ message: 'Lost item not found.' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching lost item.', details: error.message });
  }
});

// Get found items related to a lost item
router.get('/:id/matches', async (req, res) => {
  try {
    const lostItemId = req.params.id;
    
    // Check if the lost item exists
    const lostItem = await LostItem.findById(lostItemId);
    if (!lostItem) {
      return res.status(404).json({ message: 'Lost item not found.' });
    }
    
    // Find all found items that reference this lost item
    const FoundItem = require('../models/FoundItem');
    const matches = await FoundItem.find({ relatedLostItem: lostItemId })
      .populate('createdBy', 'name email profilePicture')
      .sort({ createdAt: -1 });
    
    res.json({
      lostItem,
      matches
    });
  } catch (error) {
    console.error("Error fetching matches for lost item:", error);
    res.status(500).json({ error: 'Server error while fetching matches.', details: error.message });
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
    res.status(500).json({ message: "Server error", error: error.message }); 
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
