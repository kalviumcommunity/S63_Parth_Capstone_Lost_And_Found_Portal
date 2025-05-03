// backend/utils/cloudinaryHelper.js
const cloudinary = require('../config/cloudinaryConfig'); // Import configured instance

/**
 * Uploads a file buffer to Cloudinary.
 * @param {Buffer} fileBuffer - The file buffer from req.file.buffer.
 * @param {string} folderName - The Cloudinary folder to upload into (e.g., 'profile_pics').
 * @returns {Promise<object>} - Promise resolving with Cloudinary upload result object (contains secure_url, public_id, etc.).
 */
const uploadToCloudinary = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    // Use upload_stream for buffers
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,       // Specify the folder in Cloudinary
        resource_type: "auto"   // Let Cloudinary detect the file type (image/video/raw)
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Stream Error:", error);
          return reject(new Error('Cloudinary upload failed.')); // Reject with a standard error
        }
        if (!result) {
             console.error("Cloudinary Upload Stream Error: No result returned.");
             return reject(new Error('Cloudinary upload failed: No result returned.'));
        }
        // console.log("Cloudinary Upload Success:", result.secure_url); // Log success URL
        resolve(result); // Resolve with the full result object
      }
    );

    // Write the buffer to the stream and end it
    uploadStream.end(fileBuffer);
  });
};

// Optional: Function to delete from Cloudinary using public_id
const deleteFromCloudinary = (publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                 console.error("Cloudinary Deletion Error:", error);
                return reject(new Error('Cloudinary deletion failed.'));
            }
             console.log("Cloudinary Deletion Result:", result);
             // result is usually { result: 'ok' } or { result: 'not found' }
            resolve(result);
        });
    });
};


module.exports = { uploadToCloudinary, deleteFromCloudinary }; // Export helper function(s)