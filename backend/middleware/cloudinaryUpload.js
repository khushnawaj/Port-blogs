// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('../utils/cloudinary');

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'Khush_portfolio',
//     allowed_formats: ['jpg', 'jpeg', 'png'],
//     transformation: [{ width: 300, height: 300, crop: 'limit' }],
//   },
// });

// const upload = multer({ storage });

// module.exports = upload;

// middleware/upload.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "Khush_portfolio", // ✅ Cloudinary folder
      format: file.mimetype.split("/")[1], // auto-detect format (jpg/png)
      allowed_formats: ["jpg", "jpeg", "png"], // restrict formats
      transformation: [{ width: 300, height: 300, crop: "limit" }], // optional resize
      public_id: Date.now() + "-" + file.originalname.split(".")[0], // unique file name
    };
  },
});

// Multer instance
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // ✅ 2MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .jpeg, .png formats allowed!"), false);
    }
  },
});

module.exports = upload;
