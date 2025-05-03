const express = require("express");
const router = express.Router();
const LostItem = require("../models/LostItem"); // Import LostItem Schema
const upload = require("../middleware/uploadMiddleware");
const { uploadToCloudinary } = require('../utills/cloudinaryHelper');

// 📌 POST Endpoint: Report a Lost Item
router.post(
  "/",
  upload.fields([ // Use multer first
    { name: "userGovtID", maxCount: 1 },
    { name: "images", maxCount: 5 } // Allows up to 5 item images
  ]),
  async (req, res) => {
    // Check for uploaded files
    const govtIdFile = req.files?.userGovtID?.[0];
    const itemImageFiles = req.files?.images; // This will be an array

    if (!govtIdFile || !itemImageFiles || itemImageFiles.length === 0) {
      return res.status(400).json({ message: 'Government ID and at least one Item Image are required.' });
    }

    try {
      // Get text fields (assuming simple string location for now)
      const { name, dateLost, locationLost, contactNo, description, createdBy } = req.body;

      // --- Upload files to Cloudinary ---
      let govtIdUploadUrl = null;
      let itemImageUrls = [];
      const uploadPromises = [];

      // Prepare Govt ID upload promise
      uploadPromises.push(
          uploadToCloudinary(govtIdFile.buffer, 'founders_hub/govt_ids')
            .then(result => { govtIdUploadUrl = result.secure_url; }) // Store URL on success
      );

      // Prepare Item Images upload promises
      itemImageFiles.forEach(file => {
          uploadPromises.push(
              uploadToCloudinary(file.buffer, 'founders_hub/item_images')
                .then(result => itemImageUrls.push(result.secure_url)) // Add URL to array on success
          );
      });

      // Execute all uploads in parallel
      await Promise.all(uploadPromises);
      // --- End Cloudinary Upload ---

      // Check if all uploads were successful (basic check)
       if (!govtIdUploadUrl || itemImageUrls.length !== itemImageFiles.length) {
          console.error("One or more Cloudinary uploads failed.");
          // Optional: Attempt to delete successfully uploaded files if some failed (complex)
          return res.status(500).json({ error: "File upload process failed." });
      }

      // Create new LostItem with Cloudinary URLs
      const lostItem = new LostItem({
        name,
        userGovtID: govtIdUploadUrl, // <<<--- Save Cloudinary URL
        images: itemImageUrls,      // <<<--- Save Array of Cloudinary URLs
        dateLost,
        locationLost, // Save simple string location
        contactNo,
        description,
        createdBy,
      });

      await lostItem.save();
      res.status(201).json({ message: "Lost item reported successfully!", lostItem });

    } catch (error) {
      console.error("Error reporting lost item with Cloudinary:", error);
      res.status(500).json({ error: "Failed to report lost item", details: error.message });
    }
  }
);

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
