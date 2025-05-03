// backend/routes/userRoutes.js

const express = require("express");
const bcrypt = require("bcryptjs"); // For hashing and comparing passwords
const jwt = require("jsonwebtoken"); // For generating login tokens
const { body, validationResult } = require("express-validator"); // For input validation
const User = require("../models/User"); // Your User model
const upload = require("../middleware/uploadMiddleware"); // Your multer middleware for file uploads
const { uploadToCloudinary, deleteFromCloudinary } = require('../utills/cloudinaryHelper');

const router = express.Router();

// --- User Registration ---
// @route   POST /api/users/
// @desc    Register new user with profile picture
// @access  Public
router.post(
    "/",
    upload.single("profilePicture"), // Use multer first
    [ /* Validation rules... */ ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array() }); }

        try {
            const { name, email, password } = req.body;

            let user = await User.findOne({ email });
            if (user) { return res.status(400).json({ message: "User already exists" }); }

            // --- Upload Profile Picture to Cloudinary ---
            let profilePictureUrl = null;
            if (req.file) { // Check if multer processed a file
                console.log(`Uploading profile picture for ${email} to Cloudinary...`);
                try {
                    // Pass buffer and folder name to helper
                    const result = await uploadToCloudinary(req.file.buffer, 'founders_hub/profile_pics');
                    profilePictureUrl = result.secure_url; // Get the Cloudinary URL
                } catch (uploadError) {
                    console.warn("Cloudinary upload failed during registration:", uploadError.message);
                    // Continue registration without profile picture on upload failure
                }
            }
            // --- End Cloudinary Upload ---

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = new User({
                name,
                email,
                password: hashedPassword,
                profilePicture: profilePictureUrl, // <<<--- Save Cloudinary URL or null
            });

            await user.save();

            res.status(201).json({
                message: "User registered successfully",
                user: { /* user details excluding password */ }
            });
        } catch (error) {
            console.error("Registration Error:", error.message);
            res.status(500).json({ message: "Server error during registration" });
        }
    }
);


// --- User Login ---
// @route   POST /api/users/login
// @desc    Authenticate user and return token
// @access  Public
router.post( // <<<--- ADDED LOGIN ROUTE
    "/login", // Route path is '/login' relative to '/api/users'
    [
        // Basic validation for login
        body("email").isEmail().withMessage("Please include a valid email"),
        body("password").exists().withMessage("Password is required"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            console.log(`Login attempt for email: ${email}`); // Debug log
            const user = await User.findOne({ email });
            if (!user) {
                 console.log(`Login failed: User ${email} not found.`); // Debug log
                return res.status(400).json({ message: "Invalid Credentials" });
            }
            console.log(`Login attempt: User ${email} found. Comparing passwords...`); // Debug log
             console.log(`DB Hash: ${user.password}`); // Debug log - check if hash exists


            // --- COMPARE PASSWORD ---
            // Compare plaintext password from form (password) with hash from DB (user.password)
            const isMatch = await bcrypt.compare(password, user.password);
            console.log(`Password comparison result for ${email}: ${isMatch}`); // Debug log
            // --- END COMPARE ---

            if (!isMatch) {
                console.log(`Login failed: Password mismatch for ${email}.`); // Debug log
                return res.status(400).json({ message: "Invalid Credentials" });
            }

            // --- Generate JWT ---
            const payload = { user: { id: user.id } }; // Use user.id
            const jwtSecret = process.env.JWT_SECRET || 'yourDefaultJwtSecret'; // Use env var!

            jwt.sign(
                payload,
                jwtSecret,
                { expiresIn: '1h' }, // Token expires in 1 hour
                (err, token) => {
                    if (err) throw err;
                    console.log(`Login successful for ${email}. Token generated.`); // Debug log
                    res.json({
                        message: "Login successful",
                        token,
                        user: { // Send user data back (excluding password)
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            profilePicture: user.profilePicture,
                            createdAt: user.createdAt,
                        }
                    });
                }
            );
             // --- End JWT ---

        } catch (error) {
            console.error("Login Error:", error.message);
            res.status(500).send("Server error during login");
        }
    }
);

// --- NEW: PATCH /api/users/:id/picture ---
// @route   PATCH /api/users/:id/picture
// @desc    Update user's profile picture
// @access  Private (Needs Authentication)
router.patch(
    "/:id/picture",
    // TODO: Add auth middleware
    upload.single("profilePicture"), // Use multer
    async (req, res) => {
        if (!req.file) { return res.status(400).json({ message: "No profile picture file uploaded." }); }

        const userId = req.params.id;

        try {
            // --- Upload new picture to Cloudinary ---
            let uploadResult;
            try {
                 uploadResult = await uploadToCloudinary(req.file.buffer, 'founders_hub/profile_pics');
                 if (!uploadResult || !uploadResult.secure_url) throw new Error("Cloudinary did not return a URL.");
            } catch (uploadError) {
                 console.error("Cloudinary upload failed during update:", uploadError);
                 return res.status(500).json({ message: "Profile picture upload failed.", error: uploadError.message });
            }
            // --- End Cloudinary Upload ---

            // Find user (no changes needed here)
            const user = await User.findById(userId);
            if (!user) { return res.status(404).json({ message: "User not found." }); }

            // TODO: Authorization check

            // TODO (Optional): Delete old Cloudinary image if user.profilePicture exists and contains 'cloudinary'
            if (user.profilePicture && user.profilePicture.includes('cloudinary')) {
                const oldPublicId = user.profilePicture.split('/').pop().split('.')[0];
                try {
                    await deleteFromCloudinary(oldPublicId);
                } catch (deleteError) {
                    console.warn("Failed to delete old Cloudinary image:", deleteError);
                }
            }

            // Update user with NEW Cloudinary URL
            user.profilePicture = uploadResult.secure_url; // <<<--- Save Cloudinary URL
            await user.save();

            res.json({
                message: "Profile picture updated successfully.",
                user: { /* updated user details excluding password */ }
            });

        } catch (error) {
            console.error("Error updating profile picture:", error);
            if (error.kind === 'ObjectId') return res.status(400).json({ message: 'Invalid user ID format.' });
            res.status(500).json({ message: "Server error while updating profile picture." });
        }
    }
);

// --- END NEW PATCH ROUTE ---


// --- GET Routes (Keep as they were, added password exclusion) ---
// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: 'Server error while fetching users.' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // Exclude password
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (error) {
     console.error("Error fetching user by ID:", error.message);
     if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid user ID format.' });
    }
    res.status(500).json({ error: 'Server error while fetching user.' });
  }
});


module.exports = router;