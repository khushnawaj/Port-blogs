const About = require("../models/About");
const asyncHandler = require("../middleware/async");

// Get about
exports.getAbout = asyncHandler(async (req, res) => {
  const about = await About.findOne({ userId: req.user.id });
  res.status(200).json({ success: true, data: about });
});

// Create / Update about
exports.upsertAbout = asyncHandler(async (req, res) => {
  let about = await About.findOne({ userId: req.user.id });

  if (about) {
    about = await About.findOneAndUpdate({ userId: req.user.id }, req.body, { new: true, runValidators: true });
  } else {
    req.body.userId = req.user.id;
    about = await About.create(req.body);
  }

  res.status(200).json({ success: true, data: about });
});
