const express = require('express');
const {
  getPortfolio,
  getEducation,
  addEducation,
  updateEducation,
  deleteEducation
  // Similar imports for experience, projects, skills
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/:userId').get(getPortfolio);

// Education routes
router
  .route('/education')
  .get(getEducation)
  .post(protect, addEducation);

router
  .route('/education/:id')
  .get(getEducation)
  .put(protect, updateEducation)
  .delete(protect, deleteEducation);

// Similar routes for experience, projects, skills would follow...

module.exports = router;