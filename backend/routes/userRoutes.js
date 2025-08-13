const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getUsers,
  getUser,
  createUser, // Registration
  loginUser,   // Login
  updateUser,
  deleteUser,
  uploadUserPhoto,
  updateProfile,
  changePassword
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Multer storage config (unchanged)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  }
});
const upload = multer({ storage });

// Public Routes
router.post('/register', createUser);
router.post('/login', loginUser);

// Protected Routes
router.use(protect);
router.put('/profile', updateProfile);
router.put('/changepassword', changePassword);
router.put('/:id/photo', upload.single('photo'), uploadUserPhoto);

// Admin Only Routes
router.use(authorize('admin'));
router.get('/', getUsers);
router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
