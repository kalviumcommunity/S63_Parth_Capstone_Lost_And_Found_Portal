const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
    name: String,
    userGovtID: String,
    images: [String],
    dateLost: Date,
    locationLost: String,
    contactNo: String,
    description: String,
  });

module.export = mongoose.model("LostItem", lostItemSchema);