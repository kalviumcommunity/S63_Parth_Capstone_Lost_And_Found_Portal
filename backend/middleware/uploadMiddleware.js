// backend/middleware/uploadMiddleware.js
const multer = require("multer");
const path = require("path");

// 1. --- Use memoryStorage instead of diskStorage ---
// This stores the file in memory as a Buffer (accessible via req.file.buffer)
const storage = multer.memoryStorage();
// --- Removed diskStorage configuration ---

// 2. --- Define a robust file filter ---
const fileFilter = (req, file, cb) => {
    // Allowed extensions and mime types
    const allowedExtensions = /jpeg|jpg|png|gif|webp/;
    const allowedMimeTypes = /image\/jpeg|image\/jpg|image\/png|image\/gif|image\/webp/;

    // Test extension and mime type
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimeTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true); // Accept the file
    } else {
        // Reject the file with a specific Error object
        cb(new Error('Invalid file type. Only JPEG, JPG, PNG, GIF, or WEBP images are allowed.'), false);
    }
};

// 3. --- Configure multer instance ---
const upload = multer({
    storage: storage, // Use memory storage
    fileFilter: fileFilter, // Use the defined file filter
    limits: {
        fileSize: 10 * 1024 * 1024 // Optional: Set file size limit (e.g., 10MB)
    }
});

// 4. --- Export the configured middleware ---
module.exports = upload;