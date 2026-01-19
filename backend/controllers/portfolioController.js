const Portfolio = require("../models/PortfoliModel");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get user's portfolio
// @route   GET /api/v1/portfolio/me
// @access  Private
exports.getMyPortfolio = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.findOne({ userId: req.user.id });

  if (!portfolio) {
    return res.status(200).json({
      success: true,
      data: null,
      message: "No portfolio found. Create one to get started!"
    });
  }

  res.status(200).json({
    success: true,
    data: portfolio
  });
});

// @desc    Get portfolio by userId
// @route   GET /api/v1/portfolio/:userId
// @access  Public
exports.getPortfolio = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.findOne({ userId: req.params.userId })
    .populate('userId', 'username email profileImage');

  if (!portfolio) {
    return next(
      new ErrorResponse(`Portfolio not found for user ${req.params.userId}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: portfolio
  });
});

// @desc    Create or Update portfolio
// @route   POST /api/v1/portfolio
// @access  Private
exports.upsertPortfolio = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  // Check if portfolio exists
  let portfolio = await Portfolio.findOne({ userId });

  if (portfolio) {
    // Update existing portfolio
    portfolio = await Portfolio.findOneAndUpdate(
      { userId },
      { ...req.body, userId },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Portfolio updated successfully",
      data: portfolio
    });
  }

  // Create new portfolio
  portfolio = await Portfolio.create({
    ...req.body,
    userId
  });

  res.status(201).json({
    success: true,
    message: "Portfolio created successfully",
    data: portfolio
  });
});

// @desc    Delete portfolio
// @route   DELETE /api/v1/portfolio
// @access  Private
exports.deletePortfolio = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.findOne({ userId: req.user.id });

  if (!portfolio) {
    return next(new ErrorResponse("Portfolio not found", 404));
  }

  await Portfolio.findByIdAndDelete(portfolio._id);

  res.status(200).json({
    success: true,
    message: "Portfolio deleted successfully",
    data: {}
  });
});

// @desc    Upload portfolio image
// @route   POST /api/v1/portfolio/upload-image
// @access  Private
exports.uploadImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  res.status(200).json({
    success: true,
    data: `/uploads/${req.file.filename}`
  });
});
