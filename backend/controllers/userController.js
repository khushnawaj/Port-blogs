// controllers/userController.js
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// Other models if used
const Education = require('../models/Education');
const Experience = require('../models/Experience');
const Project = require('../models/Project');
const Skill = require('../models/Skill');

// ================== CONTROLLERS ==================

// Get all users
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// Get single user
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }
  res.status(200).json({ success: true, data: user });
});

// Create user
exports.createUser = asyncHandler(async (req, res, next) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return next(new ErrorResponse(`User with email ${req.body.email} already exists`, 400));
  }
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

// Update user (Admin)
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));

  if (req.user.id === req.params.id && req.body.role && req.body.role !== 'admin') {
    return next(new ErrorResponse('You cannot change your own role', 400));
  }

  if (req.body.email) {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser && existingUser._id.toString() !== req.params.id) {
      return next(new ErrorResponse(`User with email ${req.body.email} already exists`, 400));
    }
  }

  user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: user });
});

// Delete user
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  if (req.user.id === req.params.id) {
    return next(new ErrorResponse('You cannot delete yourself', 400));
  }
  await user.remove();
  res.status(200).json({ success: true, data: {} });
});

// Upload profile picture
exports.uploadUserPhoto = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this user\'s photo', 401));
  }
  if (!req.file) return next(new ErrorResponse(`Please upload a file`, 400));

  user.profilePicture = req.file.path.replace('public', '');
  await user.save();
  res.status(200).json({ success: true, data: user });
});

// Get portfolio
exports.getUserPortfolio = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));

  const [education, experience, projects, skills] = await Promise.all([
    Education.find({ userId: req.params.id }),
    Experience.find({ userId: req.params.id }),
    Project.find({ userId: req.params.id }),
    Skill.find({ userId: req.params.id })
  ]);

  res.status(200).json({
    success: true,
    data: {
      user,
      portfolio: { education, experience, projects, skills }
    }
  });
});

// Update profile (self)
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const updates = { username: req.body.username, email: req.body.email };
  if (updates.email) {
    const existingUser = await User.findOne({ email: updates.email });
    if (existingUser && existingUser._id.toString() !== req.user.id) {
      return next(new ErrorResponse(`User with email ${updates.email} already exists`, 400));
    }
  }
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: user });
});

// Change password
exports.changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }
  user.password = req.body.newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
});

// Send JWT
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') options.secure = true;
  res.status(statusCode).cookie('token', token, options).json({ success: true, token });
};
