// backend/routes/foundItemRoutes.js

const express = require("express");
const router = express.Router();
const FoundItem = require("../models/FoundItem"); // CORRECT: Ensure FoundItem model is imported
const upload = require("../middleware/uploadMiddleware"); // Assuming you need file uploads here too

// ---------------------------------------------------
// POST Endpoint: Report a Found Item - CORRECTED
// ---------------------------------------------------
router.post(
    "/",
    upload.fields([ // Middleware to handle file uploads
        { name: "userGovtID", maxCount: 1 }, // Expecting 'userGovtID' field for the ID image
        { name: "images", maxCount: 5 }      // Expecting 'images' field for item images
    ]),
    async (req, res) => {
        try {
            // Destructure expected fields from req.body
            const { name, dateFound, locationFound, contactNo, description, createdBy } = req.body;

            // Get filenames from uploaded files (if they exist)
            const userGovtIDFilename = req.files.userGovtID?.[0]?.filename; // Safely access filename
            const imageFilenames = req.files.images?.map((img) => img.filename) || []; // Get array of filenames or empty array

            // --- FIX WAS HERE: Use FoundItem, not LostItem ---
            // Create a new Found Item entry using the FoundItem model
            const foundItem = new FoundItem({
                name,
                userGovtID: userGovtIDFilename, // Save the filename from upload
                images: imageFilenames,       // Save the array of filenames from upload
                dateFound,
                locationFound,
                contactNo,
                description,
                createdBy, // Link to the user who reported it
            });
            // --- END FIX ---

            // Save the new found item report to the database
            await foundItem.save();
            res.status(201).json({ message: "Found item reported successfully!", foundItem });

        } catch (error) {
            // Log the detailed error for easier debugging on the server
            console.error("Error reporting found item:", error);
            res.status(500).json({ error: "Failed to report found item", details: error.message });
        }
    }
);

// ---------------------------------------------------
// GET Endpoints (Keep these as they were)
// ---------------------------------------------------

// Get all found items with user info
router.get('/', async (req, res) => {
  try {
    // Populate the 'createdBy' field to include user's name and email
    const items = await FoundItem.find().populate('createdBy', 'name email profilePicture'); // Added profilePicture
    res.json(items);
  } catch (error) {
    console.error("Error fetching found items:", error);
    res.status(500).json({ error: 'Server error while fetching found items.' });
  }
});

// Get found item by ID with user info
router.get('/:id', async (req, res) => {
  try {
    // Populate the 'createdBy' field
    const item = await FoundItem.findById(req.params.id).populate('createdBy', 'name email profilePicture'); // Added profilePicture
    if (!item) return res.status(404).json({ message: 'Found item not found.' });
    res.json(item);
  } catch (error) {
    console.error("Error fetching found item by ID:", error);
    res.status(500).json({ error: 'Server error while fetching item.' });
  }
});

// ---------------------------------------------------
// PUT Endpoint (Keep this as it was)
// ---------------------------------------------------
router.put("/:id", async (req, res) => {
    try {
        const updatedItem = await FoundItem.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true } // Options: return updated doc, run schema validation
        );

        if (!updatedItem) {
            return res.status(404).json({ message: "Found item not found" });
        }

        res.json({ message: "Found item updated successfully", item: updatedItem });
    } catch (error) {
        console.error("Error updating found item:", error);
        res.status(500).json({ message: "Server error while updating item", error: error.message });
    }
});

// ---------------------------------------------------
// DELETE Endpoint (Keep this as it was)
// ---------------------------------------------------
router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await FoundItem.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
        return res.status(404).json({ message: 'Found item not found' });
        }
        res.json({ message: 'Found item deleted successfully' });
    } catch (error) {
        console.error("Error deleting found item:", error);
        res.status(500).json({ message: 'Server error while deleting item', error: error.message });
    }
});


module.exports = router; // Make sure router is exported