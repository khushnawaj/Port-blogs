const express = require("express");
const {
  getMyPortfolio,
  getPortfolio,
  upsertPortfolio,
  deletePortfolio,
  uploadImage
} = require("../controllers/portfolioController");
const upload = require('../middleware/upload');

const { protect } = require("../middleware/auth");

const router = express.Router();

// Get logged-in user's portfolio
router.get("/me", protect, getMyPortfolio);

// Create or update portfolio
router.post("/", protect, upsertPortfolio);

// Upload portfolio image
router.post("/upload-image", protect, upload, uploadImage);

// Delete portfolio
router.delete("/", protect, deletePortfolio);

// Get portfolio by userId (public)
router.get("/:userId", getPortfolio);

module.exports = router;
