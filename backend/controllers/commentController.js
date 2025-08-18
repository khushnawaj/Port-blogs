// backend/controllers/commentController.js
const Comment = require('../models/Comment');
const BlogPost = require('../models/BlogPost');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Add comment to blog
// @route   POST /api/v1/blog/:postId/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const blogPost = await BlogPost.findById(postId);
  if (!blogPost) {
    return next(new ErrorResponse(`Blog post not found with id ${postId}`, 404));
  }

  const comment = await Comment.create({
    content: req.body.content,
    author: req.user.id,
    post: postId
  });

  blogPost.comments.push(comment._id);
  await blogPost.save();

  res.status(201).json({
    success: true,
    data: comment
  });
});

// @desc    Get comments for blog
// @route   GET /api/v1/blog/:postId/comments
// @access  Public
exports.getComments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate('author', 'username profilePicture')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments
  });
});

// @desc    Delete a comment
// @route   DELETE /api/v1/comments/:id
// @access  Private (author or admin)
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return next(new ErrorResponse(`No comment with id ${req.params.id}`, 404));
  }

  if (String(comment.author) !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this comment', 401));
  }

  await comment.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
