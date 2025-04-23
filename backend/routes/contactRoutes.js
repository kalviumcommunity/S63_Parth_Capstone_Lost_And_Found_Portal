// backend/routes/contactRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator'); // For validation
const ContactMessage = require('../models/ContactMessage'); // Import the model

const router = express.Router();

// @route   POST /api/contact
// @desc    Save a contact form submission
// @access  Public
router.post(
    '/',
    [
        // Add validation rules
        body('name', 'Name is required').notEmpty().trim().escape(),
        body('email', 'Please include a valid email').isEmail().normalizeEmail(),
        body('subject', 'Subject').optional({ checkFalsy: true }).trim().escape(), // Optional field
        body('message', 'Message is required').notEmpty().trim().escape(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, subject, message } = req.body;

        try {
            // Create a new message document
            const newMessage = new ContactMessage({
                name,
                email,
                subject: subject || 'No Subject', // Use default if empty
                message,
            });

            // Save it to the database
            await newMessage.save();

            // Send success response
            res.status(201).json({ message: 'Message received successfully! Thank you.' });

            // Optional TODO: Send an email notification to admin here

        } catch (error) {
            console.error("Contact form submission error:", error);
            // Check for Mongoose validation error specifically
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: 'Validation failed.', errors: error.errors });
           }
            res.status(500).json({ message: 'Server error. Could not save message.' });
        }
    }
);

// Optional: Add GET route later for admins to view messages
// router.get('/', /* admin auth middleware */, async (req, res) => { ... });

module.exports = router;