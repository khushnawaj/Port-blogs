const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Register user with email verification
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    username,
    email,
    password,
    role
  });

  // Generate email verification token
  const verifyToken = crypto.randomBytes(20).toString('hex');
  user.verifyToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
  user.verifyTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verifyemail/${verifyToken}`;
  const message = `Please verify your email by clicking the link: \n\n ${verifyUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Verify Your Email',
      message
    });
  } catch (err) {
    console.error(err);
    user.verifyToken = undefined;
    user.verifyTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be sent', 500));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Token',
      message
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.error(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Verify email
// @route   GET /api/v1/auth/verifyemail/:verifyToken
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const verifyTokenHash = crypto.createHash('sha256').update(req.params.verifyToken).digest('hex');

  const user = await User.findOne({
    verifyToken: verifyTokenHash,
    verifyTokenExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid or expired verification token', 400));
  }

  user.verifyToken = undefined;
  user.verifyTokenExpire = undefined;
  user.isVerified = true;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Email verified successfully'
  });
});

// Utility function: Send JWT token in response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid or expired token', 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Resend verification email
// @route   POST /api/v1/auth/resendverification
// @access  Private
exports.resendVerificationEmail = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  if (user.isVerified) {
    return next(new ErrorResponse('Email already verified', 400));
  }

  const verifyToken = crypto.randomBytes(20).toString('hex');
  user.verifyToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
  user.verifyTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verifyemail/${verifyToken}`;
  const message = `Please verify your email by visiting: ${verifyUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Verify Your Email',
      message
    });

    res.status(200).json({ success: true, data: 'Verification email resent' });
  } catch (err) {
    console.error(err);
    user.verifyToken = undefined;
    user.verifyTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});
