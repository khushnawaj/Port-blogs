const express = require("express");
const { getHome, upsertHome } = require("../controllers/homeController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getHome);
router.post("/", protect, upsertHome);

module.exports = router;
