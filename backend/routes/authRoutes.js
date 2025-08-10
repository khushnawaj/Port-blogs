const express = require('express');
const {
  register,
  login,
  getMe,
  forgotPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { 
  resetPassword,
  verifyEmail,
  resendVerificationEmail 
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/verifyemail/:token', verifyEmail);
router.post('/resendverification', protect, resendVerificationEmail);

module.exports = router;