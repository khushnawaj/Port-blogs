const express = require('express');
const asyncHandler = require('../middleware/async');
const { protect, authorize } = require('../middleware/auth');
const BlogPost = require('../models/BlogPost');
const { getDashboardStats, getPendingBlogs , getAllUsers, updateUserStatus} = require('../controllers/adminController');

console.log('Admin routes loaded');

const router = express.Router();

// Admin only
router.use(protect, authorize('admin'));
console.log('Protect middleware hit');
// console.log('User:', req.user);

//for managing user
router.patch('/users/:id', asyncHandler(updateUserStatus));


// Dashboard stats
router.get('/stats', getDashboardStats);

// Pending blogs (duplicate with /posts/pending maybe)
router.get('/pending-blogs', getPendingBlogs);
router.get('/users', getAllUsers);


// GET /api/v1/admin/posts/pending
router.get('/posts/pending', asyncHandler(async (req, res) => {
  const items = await BlogPost.find({ status: 'pending' })
    .sort({ createdAt: -1 })
    .lean();

  res.json({ success: true, data: items });
}));

// PATCH /api/v1/admin/posts/:id { action: 'approve' | 'reject' }
router.patch('/posts/:id', asyncHandler(async (req, res) => {
  const { action } = req.body;
  if (!action) {
    return res.status(400).json({ success: false, message: 'Action required' });
  }

  const status =
    action === 'approve'
      ? 'published'
      : action === 'reject'
      ? 'rejected'
      : null;

  if (!status) {
    return res.status(400).json({ success: false, message: 'Invalid action' });
  }

  const post = await BlogPost.findByIdAndUpdate(
    req.params.id,
    {
      status,
      isPublished: status === 'published',
      publishedAt: status === 'published' ? Date.now() : undefined,
    },
    { new: true }
  ).lean();

  if (!post) {
    return res.status(404).json({ success: false, message: 'Not found' });
  }

  res.json({ success: true, data: post });
}));

module.exports = router;
