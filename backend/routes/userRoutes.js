// backend/routes/userRoutes.js

const express = require("express");
const bcrypt = require("bcryptjs"); // For hashing and comparing passwords
const jwt = require("jsonwebtoken"); // For generating login tokens
const { body, validationResult } = require("express-validator"); // For input validation
const User = require("../models/User"); // Your User model
const upload = require("../middleware/uploadMiddleware"); // Your multer middleware for file uploads

const router = express.Router();

// --- User Registration ---
// @route   POST /api/users/
// @desc    Register new user with profile picture
// @access  Public
router.post(
    "/", // Route path is '/' relative to '/api/users'
    upload.single("profilePicture"), // Middleware for single file upload named "profilePicture"
    [
        // Input validations
        body("name").notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, email, password } = req.body;

            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ message: "User already exists" });
            }

            // --- HASH PASSWORD ---
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            // --- END HASH ---

            const profilePictureFilename = req.file ? req.file.filename : null;

            user = new User({
                name,
                email,
                password: hashedPassword, // <<<--- SAVE HASHED PASSWORD
                profilePicture: profilePictureFilename,
            });

            await user.save();

            res.status(201).json({
                message: "User registered successfully",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    profilePicture: user.profilePicture,
                    createdAt: user.createdAt,
                }
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
    // TODO: Add 'auth' middleware here later to protect route and get req.user.id
    upload.single("profilePicture"), // Expect a single file named 'profilePicture'
    async (req, res) => {
        // Check if a file was actually uploaded by multer
        if (!req.file) {
            return res.status(400).json({ message: "No profile picture file uploaded." });
        }

        const userId = req.params.id;
        const newProfilePictureFilename = req.file.filename;

        try {
            // Find the user by the ID from the URL parameter
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            // --- Authorization Check (Placeholder) ---
            // TODO: Later, verify if the logged-in user (req.user.id) matches the userId param
            // if (req.user.id !== userId) {
            //     return res.status(403).json({ message: "User not authorized to update this profile." });
            // }
            // --- ---

            // Optional: Delete the old profile picture file from /uploads if it exists
            // This requires the 'fs' module and careful error handling - skipping for now for simplicity.
            // if (user.profilePicture) {
            //    const oldPath = path.join(__dirname, '..', 'uploads', user.profilePicture);
            //    fs.unlink(oldPath, (err) => { if (err) console.error("Error deleting old profile pic:", err); });
            // }

            // Update the user document
            user.profilePicture = newProfilePictureFilename;
            await user.save(); // Save the changes

            // Respond with success and updated user info (excluding password)
            res.json({
                message: "Profile picture updated successfully.",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    profilePicture: user.profilePicture, // Send back the new filename
                    createdAt: user.createdAt,
                }
            });

        } catch (error) {
            console.error("Error updating profile picture:", error);
            if (error.kind === 'ObjectId') {
                return res.status(400).json({ message: 'Invalid user ID format.' });
            }
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