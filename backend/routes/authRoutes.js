// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/verify/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

// Protected
router.get('/me', protect, getMe);

module.exports = router;
