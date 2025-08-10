const express = require('express');
const {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  uploadBlogImage
} = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { searchBlogPosts, approveBlogPost } = require('../controllers/blogController');

const router = express.Router();

router
  .route('/')
  .get(getBlogPosts)
  .post(protect, createBlogPost);

router
  .route('/:id')
  .get(getBlogPost)
  .put(protect, updateBlogPost)
  .delete(protect, deleteBlogPost);

router.route('/:id/image').put(protect, upload, uploadBlogImage);
router.get('/search', searchBlogPosts);
router.put('/:id/approve', protect, authorize('admin'), approveBlogPost);

module.exports = router;