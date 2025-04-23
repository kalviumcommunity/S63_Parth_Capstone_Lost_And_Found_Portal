// backend/models/ContactMessage.js
const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        trim: true,
        // Basic email format validation (won't catch all invalid emails)
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    subject: {
        type: String,
        trim: true,
        default: 'No Subject', // Optional default
    },
    message: {
        type: String,
        required: [true, 'Message is required.'],
        trim: true,
    },
    isRead: { // Optional: Track if an admin has read the message
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);