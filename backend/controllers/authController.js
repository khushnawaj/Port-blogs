// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/config');

// helper to return safe user object
const safeUser = (u) => ({
  _id: u._id,
  username: u.username,
  email: u.email,
  role: u.role,
  isVerified: u.isVerified,
  profilePicture: u.profilePicture,
  createdAt: u.createdAt
});

const signToken = (userId) => jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE || '30d' });

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'All fields are required' });

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    // Create user (model pre-save will hash password)
    const user = await User.create({ username, email: email.toLowerCase().trim(), password, role: 'user' });

    const token = signToken(user._id);
    return res.status(201).json({ token, user: safeUser(user) });
  } catch (err) {
    console.error('Register error:', err);
    next(err);
  }
};

// exports.login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).json({ error: 'Please provide email and password' });

//     const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
//     if (!user) return res.status(401).json({ error: 'Invalid credentials' });

//     const match = await user.matchPassword(password);
//     if (!match) return res.status(401).json({ error: 'Invalid credentials' });

//     const token = signToken(user._id);
//     return res.status(200).json({ token, user: safeUser(user) });
//   } catch (err) {
//     console.error('Login error:', err);
//     next(err);
//   }
// };
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Please provide email and password' });

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // Check if user is inactive
    if (user.status === 'inactive') {
      return res.status(403).json({ error: 'Account is deactivated. Contact admin.' });
    }

    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken(user._id);
    return res.status(200).json({ token, user: safeUser(user) });
  } catch (err) {
    console.error('Login error:', err);
    next(err);
  }
};


exports.getMe = async (req, res, next) => {
  try {
    const uid = req.user && (req.user.id || req.user._id);
    const user = await User.findById(uid);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(safeUser(user));
  } catch (err) {
    next(err);
  }
};

// placeholders
exports.forgotPassword = async (req, res, next) => res.json({ message: 'Forgot password placeholder' });
exports.resetPassword = async (req, res, next) => res.json({ message: 'Reset password placeholder' });
exports.verifyEmail = async (req, res, next) => res.json({ message: 'Verify email placeholder' });
exports.resendVerificationEmail = async (req, res, next) => res.json({ message: 'Resend verification placeholder' });
