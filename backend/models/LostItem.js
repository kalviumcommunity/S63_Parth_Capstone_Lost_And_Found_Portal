const mongoose = require("mongoose");

const lostItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userGovtID: { type: String, required: true },
  images: { type: [String], required: true },
  dateLost: { type: Date, required: true },
  locationLost: { type: String, required: true },
  contactNo: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("LostItem", lostItemSchema);
