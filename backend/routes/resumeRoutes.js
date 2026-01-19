const express = require("express");
const { getResume, upsertResume } = require("../controllers/resumeController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getResume);
router.post("/", protect, upsertResume);

module.exports = router;
