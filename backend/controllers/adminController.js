const asyncHandler = require('../middleware/async');
const BlogPost = require('../models/BlogPost');
const User = require('../models/User');

// GET /api/v1/admin/stats
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const totalPosts = await BlogPost.countDocuments();
  const pendingPosts = await BlogPost.countDocuments({ status: 'pending' });
  const publishedPosts = await BlogPost.countDocuments({ status: 'published' });
  const totalUsers = await User.countDocuments();

  res.json({
    success: true,
    data: {
      totalPosts,
      pendingPosts,
      publishedPosts,
      totalUsers,
    },
  });
});

// GET /api/v1/admin/pending-blogs
exports.getPendingBlogs = asyncHandler(async (req, res) => {
  const posts = await BlogPost.find({ status: 'pending' })
    .sort({ createdAt: -1 })
    .populate('author', 'username email')
    .lean();

  res.json({ success: true, data: posts });
});


exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password'); // password hide karega
  res.json({ success: true, data: users });
});


exports.updateUserStatus = asyncHandler(async (req, res) => {
  const { action } = req.body;

  if (!action || !['activate', 'deactivate'].includes(action)) {
    return res.status(400).json({ success: false, message: 'Invalid action' });
  }

  const status = action === 'activate' ? 'active' : 'inactive';

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.json({ success: true, data: user });
});
