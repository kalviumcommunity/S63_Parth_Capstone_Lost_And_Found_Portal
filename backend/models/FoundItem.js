const mongoose = require("mongoose");

const foundItemSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  userGovtID: { type: String, required: true }, 
  images: { type: [String], required: true }, 
  dateFound: { type: Date, required: true }, 
  locationFound: { type: String, required: true },
  contactNo: { type: String, required: true }, 
  description: { type: String, required: true }
});

module.exports = mongoose.model("FoundItem", foundItemSchema);
