const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserPhoto,
  updateProfile,
  changePassword
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Configure Multer storage
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

// Routes
router.use(protect);
router.use(authorize('admin'));

router.put('/profile', protect, updateProfile);
router.put('/changepassword', protect, changePassword);
router.put('/:id/photo', protect, upload.single('photo'), uploadUserPhoto);

router
  .route('/')
  .get(getUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
