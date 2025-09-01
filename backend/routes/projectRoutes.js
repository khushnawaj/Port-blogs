const express = require("express");
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const { protect } = require("../middleware/auth");

const router = express.Router();

// Public
router.get("/", getProjects);
router.get("/:id", getProject);

// Private (only logged-in users can create/update/delete)
router.post("/", protect, createProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;
