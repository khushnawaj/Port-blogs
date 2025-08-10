const express = require('express');
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { 
  uploadUserPhoto, 
  updateProfile,
  changePassword
} = require('../controllers/userController');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));
router.put('/profile', protect, updateProfile);
router.put('/changepassword', protect, changePassword);
router.put('/photo', protect, upload.single('photo'), uploadUserPhoto);

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