const express = require("express");
const { getAbout, upsertAbout } = require("../controllers/aboutController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getAbout);
router.post("/", protect, upsertAbout);

module.exports = router;
