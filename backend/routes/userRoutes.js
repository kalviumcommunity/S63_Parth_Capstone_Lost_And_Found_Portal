const express = require("express");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// @route   POST /api/users/register
// @desc    Register new user with profile picture
// @access  Public
router.post(
  "/", // Assuming you changed the route path from '/register' to '/' inside this file
  upload.single("profilePicture"), // <-- Use multer middleware for single file upload named "profilePicture"
  [
      // Validation rules remain the same
      body("name").notEmpty().withMessage("Name is required"),
      body("email").isEmail().withMessage("Valid email is required"),
      body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          // If validation fails, return errors
          return res.status(400).json({ errors: errors.array() });
      }

      try {
          const { name, email, password } = req.body;

          // Check if user already exists
          let user = await User.findOne({ email });
          if (user) {
              return res.status(400).json({ message: "User already exists" });
          }

          // Hash password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

          // Get the filename if an image was uploaded
          const profilePictureFilename = req.file ? req.file.filename : null; // <-- Get filename

          // Create new user with profile picture filename
          user = new User({
              name,
              email,
              password: hashedPassword,
              profilePicture: profilePictureFilename, // <-- Save filename here
          });

          await user.save();

          // Return success response (don't send back the password!)
          res.status(201).json({
              message: "User registered successfully",
              user: { // Send back relevant user info
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  profilePicture: user.profilePicture,
                  createdAt: user.createdAt,
              }
          });
      } catch (error) {
          console.error("Registration error:", error); // Log the error for debugging
          res.status(500).json({ message: "Server error during registration", error: error.message });
      }
  }
);


// @route   GET /api/users
// @desc    Get all users
// @access  Public
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching users.' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching user.' });
  }
});

module.exports = router;
