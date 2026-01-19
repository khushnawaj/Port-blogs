const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bio: { type: String, required: true }, // short intro
  description: { type: String }, // detailed story
  profileImage: { type: String }, // image url
  dob: { type: Date }, // optional
  location: { type: String },
  interests: [{ type: String }], // array of hobbies/skills
});

module.exports = mongoose.model("About", aboutSchema);
