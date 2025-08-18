// backend/routes/commentRoutes.js
const express = require('express');
const { addComment, getComments, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// GET /api/v1/blog/:postId/comments
router.route('/')
  .get(getComments)
  .post(protect, addComment);

// DELETE /api/v1/comments/:id
router.route('/:id').delete(protect, deleteComment);

module.exports = router;
