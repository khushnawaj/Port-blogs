const BlogPost = require('../models/BlogPost');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');

// @desc    Get all blog posts
// @route   GET /api/v1/blog
// @route   GET /api/v1/blog?status=published
// @access  Public
exports.getBlogPosts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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
    });

  if (!blogPost) {
    return next(
      new ErrorResponse(`Blog post not found with id of ${req.params.id}`, 404)
    );
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
    req.body.status = 'pending';
  } else {
    req.body.status = 'published';
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
  if (blogPost.author.toString() !== req.user.id && req.user.role !== 'admin') {
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
  if (blogPost.author.toString() !== req.user.id && req.user.role !== 'admin') {
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
  if (blogPost.author.toString() !== req.user.id && req.user.role !== 'admin') {
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

  blogPost.featuredImage = req.file.path.replace('public', '');

  await blogPost.save();

  res.status(200).json({
    success: true,
    data: blogPost
  });
});

exports.searchBlogPosts = asyncHandler(async (req, res, next) => {
  const { q } = req.query;
  const posts = await BlogPost.find({ $text: { $search: q } });
  res.status(200).json({ success: true, data: posts });
});