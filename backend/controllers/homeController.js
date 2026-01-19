const Home = require("../models/Home");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// Get home
exports.getHome = asyncHandler(async (req, res, next) => {
  const home = await Home.findOne({ userId: req.user.id });
  res.status(200).json({ success: true, data: home });
});

// Create / Update home
exports.upsertHome = asyncHandler(async (req, res, next) => {
  let home = await Home.findOne({ userId: req.user.id });

  if (home) {
    home = await Home.findOneAndUpdate({ userId: req.user.id }, req.body, { new: true, runValidators: true });
  } else {
    req.body.userId = req.user.id;
    home = await Home.create(req.body);
  }

  res.status(200).json({ success: true, data: home });
});
