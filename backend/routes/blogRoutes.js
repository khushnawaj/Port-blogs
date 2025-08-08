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

module.exports = router;