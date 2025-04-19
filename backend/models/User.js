// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profilePicture: { // <<<--- ADD THIS FIELD
        type: String, // Stores the filename (e.g., "171234567890-my-pic.jpg")
        default: null, // Optional: Set a default if no image is uploaded
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("User", userSchema);