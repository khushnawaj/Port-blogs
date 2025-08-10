const express = require('express');
const {
  getTemplates,
  getTemplate,
  createTemplate,
  generateResume
} = require('../controllers/resumeController');
const { protect, authorize } = require('../middleware/auth');
const { previewTemplate, getUserTemplates } = require('../controllers/resumeController');

const router = express.Router();

router
  .route('/templates')
  .get(getTemplates)
  .post(protect, authorize('admin'), createTemplate);

router.route('/templates/:id').get(getTemplate);

router.route('/generate').post(protect, generateResume);

router.get('/templates/:id/preview', previewTemplate);
router.get('/mytemplates', protect, getUserTemplates);

module.exports = router;