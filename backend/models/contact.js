const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  linkedin: { type: String },
  github: { type: String },
  twitter: { type: String },
  website: { type: String },
});

module.exports = mongoose.model("Contact", contactSchema);
