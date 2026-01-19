const Resume = require("../models/Resume");
const asyncHandler = require("../middleware/async");

// Get resume
exports.getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ userId: req.user.id });
  res.status(200).json({ success: true, data: resume });
});

// Create / Update resume
exports.upsertResume = asyncHandler(async (req, res) => {
  let resume = await Resume.findOne({ userId: req.user.id });

  if (resume) {
    resume = await Resume.findOneAndUpdate({ userId: req.user.id }, req.body, { new: true, runValidators: true });
  } else {
    req.body.userId = req.user.id;
    resume = await Resume.create(req.body);
  }

  res.status(200).json({ success: true, data: resume });
});
