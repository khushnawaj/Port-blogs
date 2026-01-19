const express = require("express");
const { getContact, upsertContact } = require("../controllers/contactController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getContact);
router.post("/", protect, upsertContact);

module.exports = router;
