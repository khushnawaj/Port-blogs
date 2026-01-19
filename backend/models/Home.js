const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  headline: { type: String, required: true },
  subHeadline: { type: String },
  profileImage: { type: String }, // image url
  bannerImage: { type: String },  // optional banner
});

module.exports = mongoose.model("Home", homeSchema);
