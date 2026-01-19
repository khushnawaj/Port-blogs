const express = require('express');
const {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  uploadBlogImage,
  searchBlogPosts,
  approveBlogPost,
  getUserBlogs,
  toggleLike
} = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const commentRouter = require('./commentRoutes');


const router = express.Router();

// Search should be before :id to avoid conflicts
router.get('/search', searchBlogPosts);

// Public routes
router.get('/', getBlogPosts);
router.get('/user/me', protect, getUserBlogs);

// Specific :id routes (must be before /:postId/comments to avoid conflicts)
router.put('/:id/like', protect, toggleLike);
router.put('/:id/image', protect, upload, uploadBlogImage);
router.put('/:id/approve', protect, authorize('admin'), approveBlogPost);

// Comment routes (uses :postId to avoid conflict with :id routes above)
router.use('/:postId/comments', commentRouter);

// General :id routes
router.get('/:id', getBlogPost);
router.post('/', protect, createBlogPost);
router.put('/:id', protect, updateBlogPost);
router.delete('/:id', protect, deleteBlogPost);

module.exports = router;
