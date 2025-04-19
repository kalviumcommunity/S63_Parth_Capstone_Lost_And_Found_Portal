// backend/models/ClaimRequest.js
const mongoose = require('mongoose');

const claimRequestSchema = new mongoose.Schema({
    // Reference to the specific item that was found and is being claimed
    foundItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoundItem', // Link to the FoundItem collection
        required: true,
    },
    // Reference to the user who is making the claim
    claimantUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Link to the User collection
        required: true,
    },
    // Details provided by the claimant in the form
    claimantName: {
        type: String,
        required: [true, 'Claimant name is required.'],
        trim: true,
    },
    contactNo: {
        type: String,
        required: [true, 'Claimant contact number is required.'],
        trim: true,
    },
    description: { // Proof of ownership description provided by claimant
        type: String,
        required: [true, 'Description/Proof of ownership is required.'],
        trim: true,
    },
    // Status of the claim - managed by finder or admin later
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'], // Possible statuses
        default: 'Pending', // Default status when submitted
    },
    // Timestamp for when the claim was submitted
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // Optional: Add a field for finder's response or notes later
    // finderNotes: String,
    // respondedAt: Date,
});

// Optional: Add indexes for faster querying if needed later
// claimRequestSchema.index({ foundItemId: 1 });
// claimRequestSchema.index({ claimantUserId: 1 });

module.exports = mongoose.model('ClaimRequest', claimRequestSchema);