const express = require("express");
const {
  getPortfolio,
  getEducation,
  addEducation,
  updateEducation,
  deleteEducation,
  // Similar imports for experience, projects, skills
} = require("../controllers/portfolioController");
const { protect } = require("../middleware/auth");

const router = express.Router();
const {
  getExperience,
  addExperience,
  // ... other experience handlers
} = require('../controllers/portfolioController');

router.route("/:userId").get(getPortfolio);

// Education routes
router.route("/education").get(getEducation).post(protect, addEducation);

router
  .route('/experience')
  .get(getExperience)
  .post(protect, addExperience);
  // In portfolioRoutes.js
router.post('/:userId/clone', protect, clonePortfolio);

router
  .route("/education/:id")
  .get(getEducation)
  .put(protect, updateEducation)
  .delete(protect, deleteEducation);

// Similar routes for experience, projects, skills would follow...

module.exports = router;
