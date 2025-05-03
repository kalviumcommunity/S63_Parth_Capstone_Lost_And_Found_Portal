// backend/config/cloudinaryConfig.js
const cloudinary = require('cloudinary').v2; // Use v2 API
require('dotenv').config(); // Ensure environment variables are loaded

// Check if required environment variables are present
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("❌ Error: Cloudinary environment variables (CLOUD_NAME, API_KEY, API_SECRET) are missing!");
  // Optionally exit the process if config is critical for startup
  // process.exit(1);
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true // Recommended: Force HTTPS URLs
  });
  console.log("☁️ Cloudinary Configured. Cloud Name:", cloudinary.config().cloud_name);
}

module.exports = cloudinary; // Export the configured cloudinary instance