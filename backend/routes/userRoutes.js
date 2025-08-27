// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const {
//   getUsers,
//   getUser,
//   createUser, // Registration
//   loginUser,   // Login
//   updateUser,
//   deleteUser,
//   uploadUserPhoto,
//   updateProfile,
//   changePassword,
//   uploadProfileImage 
// } = require('../controllers/userController');
// const { protect, authorize } = require('../middleware/auth');
// const upload = require('../middleware/cloudinaryUpload');


// const router = express.Router();

// // Multer storage config (unchanged)
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, '../public/uploads'));
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + '-' + Date.now() + path.extname(file.originalname)
//     );
//   }
// });
// const upload = multer({ storage });

// // Public Routes
// router.post('/register', createUser);
// router.post('/upload-profile', auth, upload.single('image'), uploadProfileImage);
// router.post('/login', loginUser);

// // Protected Routes
// router.use(protect);
// router.put('/profile', updateProfile);
// router.put('/changepassword', changePassword);
// router.put('/:id/photo', upload.single('photo'), uploadUserPhoto);

// // Admin Only Routes
// router.use(authorize('admin'));
// router.get('/', getUsers);
// router
//   .route('/:id')
//   .get(getUser)
//   .put(updateUser)
//   .delete(deleteUser);

// module.exports = router;
const express = require("express");
const {
  getUsers,
  getUser,
  createUser, // Registration
  loginUser,  // Login
  updateUser,
  deleteUser,
  uploadUserPhoto,
  updateProfile,
  changePassword,
  uploadProfileImage
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");
const upload  = require("../middleware/cloudinaryUpload"); 
// const upload = require("../middleware/upload");
console.log("UPLOAD DEBUG =>", upload);


const router = express.Router();

// Public Routes
router.post("/register", createUser);
router.post("/login", loginUser);

// Profile image upload (protected)
router.post(
  "/upload-profile",
  protect, // ✅ fixed (was `auth`)
  upload.single("profileImage"), // ✅ matches Cloudinary config
  uploadProfileImage
);

// Protected Routes
router.use(protect);
router.put("/profile", updateProfile);
router.put("/changepassword", changePassword);
// router.put("/:id/photo", upload.single("photo"), uploadProfileImage);
router.put("/me/photo", upload.single("photo"), uploadProfileImage);


// Admin Only Routes
router.use(authorize("admin"));
router.get("/", getUsers);
router
  .route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
