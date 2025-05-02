const mongoose = require("mongoose");

const foundItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userGovtID: { type: String, required: true },
  images: { type: [String], required: true },
  dateFound: { type: Date, required: true },
  locationFound: { type: String, required: true },
  contactNo: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // Reference to a lost item if this found item was reported through the "I Have This Item" feature
  relatedLostItem: { type: mongoose.Schema.Types.ObjectId, ref: "LostItem", default: null }
});

module.exports = mongoose.model("FoundItem", foundItemSchema);
