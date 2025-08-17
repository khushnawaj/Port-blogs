// backend/controllers/blogController.js
const BlogPost = require('../models/BlogPost');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');

/**
 * Helper: build query object from req and role
 */
function buildQuery(req) {
  const q = {};

  // Category filter: frontend sends category (tag)
  if (req.query.category) {
    // tags stored as array, match any
    q.tags = req.query.category;
  }

  // Author filter: id or username (if frontend passes id)
  if (req.query.author) {
    q.author = req.query.author;
  }

  // If user is not admin -> only published
  if (!req.user || req.user.role !== 'admin') {
    q.status = 'published';
  } else {
    // Admin may request a specific status
    if (req.query.status) {
      q.status = req.query.status;
    }
  }

  return q;
}

// @desc    Get all blog posts
// @route   GET /api/v1/blog
// @access  Public (but admin sees all)
exports.getBlogPosts = asyncHandler(async (req, res, next) => {
  const query = buildQuery(req);

  const posts = await BlogPost.find(query)
    .populate('author', 'username profilePicture')
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts
  });
});

// @desc    Get single blog post
// @route   GET /api/v1/blog/:id
// @access  Public
exports.getBlogPost = asyncHandler(async (req, res, next) => {
  const blogPost = await BlogPost.findById(req.params.id)
    .populate('author', 'username profilePicture')
    .populate({
      path: 'comments',
      populate: {
        path: 'author',
        select: 'username profilePicture'
      }
    })
    .lean();

  if (!blogPost) {
    return next(
      new ErrorResponse(`Blog post not found with id of ${req.params.id}`, 404)
    );
  }

  // If the post is not published and user is not admin or the author -> deny
  if (blogPost.status !== 'published') {
    const isAuthor = req.user && blogPost.author && (String(blogPost.author._id) === String(req.user.id));
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin && !isAuthor) {
      return next(new ErrorResponse('Not authorized to view this post', 401));
    }
  }

  res.status(200).json({
    success: true,
    data: blogPost
  });
});

// @desc    Create new blog post
// @route   POST /api/v1/blog
// @access  Private
exports.createBlogPost = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.author = req.user.id;

  // Set status based on user role
  if (req.user.role !== 'admin') {
    // non-admin posts go to pending (admin approval)
    req.body.status = req.body.status || 'pending';
    req.body.isPublished = false;
  } else {
    req.body.status = req.body.status || 'published';
    req.body.isPublished = true;
    req.body.publishedAt = Date.now();
  }

  const blogPost = await BlogPost.create(req.body);

  res.status(201).json({
    success: true,
    data: blogPost
  });
});

// @desc    Update blog post
// @route   PUT /api/v1/blog/:id
// @access  Private
exports.updateBlogPost = asyncHandler(async (req, res, next) => {
  let blogPost = await BlogPost.findById(req.params.id);

  if (!blogPost) {
    return next(
      new ErrorResponse(`Blog post not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is blog post owner or admin
  if (String(blogPost.author) !== String(req.user.id) && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this blog post`,
        401
      )
    );
  }

  // If admin is approving a post
  if (req.body.status === 'published' && req.user.role === 'admin') {
    req.body.publishedAt = Date.now();
    req.body.isPublished = true;
  }

  blogPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: blogPost
  });
});

// @desc    Delete blog post
// @route   DELETE /api/v1/blog/:id
// @access  Private
exports.deleteBlogPost = asyncHandler(async (req, res, next) => {
  const blogPost = await BlogPost.findById(req.params.id);

  if (!blogPost) {
    return next(
      new ErrorResponse(`Blog post not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is blog post owner or admin
  if (String(blogPost.author) !== String(req.user.id) && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this blog post`,
        401
      )
    );
  }

  await blogPost.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload image for blog post
// @route   PUT /api/v1/blog/:id/image
// @access  Private
exports.uploadBlogImage = asyncHandler(async (req, res, next) => {
  const blogPost = await BlogPost.findById(req.params.id);

  if (!blogPost) {
    return next(
      new ErrorResponse(`Blog post not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is blog post owner or admin
  if (String(blogPost.author) !== String(req.user.id) && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this blog post`,
        401
      )
    );
  }

  if (!req.file) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  // If you're saving to local disk and storing path
  blogPost.featuredImage = req.file.path.replace('public', '');

  await blogPost.save();

  res.status(200).json({
    success: true,
    data: blogPost
  });
});

// @desc    Search blog posts
// @route   GET /api/v1/blog/search?q=keyword
// @access  Public
exports.searchBlogPosts = asyncHandler(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a search query'
    });
  }

  const posts = await BlogPost.find({ $text: { $search: q } })
    .populate('author', 'username profilePicture')
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({ success: true, data: posts });
});

// @desc    Approve blog post (Admin)
// @route   PATCH /api/v1/blog/:id/approve
// @access  Admin
exports.approveBlogPost = asyncHandler(async (req, res, next) => {
  let blogPost = await BlogPost.findById(req.params.id);

  if (!blogPost) {
    return next(
      new ErrorResponse(`Blog post not found with id of ${req.params.id}`, 404)
    );
  }

  blogPost.status = 'published';
  blogPost.isPublished = true;
  blogPost.publishedAt = Date.now();

  await blogPost.save();

  res.status(200).json({
    success: true,
    data: blogPost
  });
});

exports.getUserBlogs = asyncHandler(async (req, res, next) => {
  const posts = await BlogPost.find({ author: req.user.id })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts
  });
});
