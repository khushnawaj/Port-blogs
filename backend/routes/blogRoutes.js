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
  getUserBlogs 
} = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const commentRouter = require('./commentRoutes');


const router = express.Router();

router.use('/:postId/comments', commentRouter);

// Search should be before :id to avoid conflicts
router.get('/search', searchBlogPosts);

// Public routes
router.get('/', getBlogPosts);
router.get('/user/me', protect, getUserBlogs);
router.get('/:id', getBlogPost);


// Protected routes
router.post('/', protect, createBlogPost);
router.put('/:id', protect, updateBlogPost);
router.delete('/:id', protect, deleteBlogPost);

// Upload image
router.put('/:id/image', protect, upload, uploadBlogImage);

// Approve blog post (admin only)
router.put('/:id/approve', protect, authorize('admin'), approveBlogPost);

module.exports = router;
