const mongoose = require("mongoose");

const claimRequestSchema = new mongoose.Schema({
  lostItemId: { type: mongoose.Schema.Types.ObjectId, ref: "LostItem", required: true },
  foundItemId: { type: mongoose.Schema.Types.ObjectId, ref: "FoundItem", required: true },
  claimantName: { type: String, required: true },
  contactNo: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ClaimRequest", claimRequestSchema);
