const Project = require("../models/Project");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = asyncHandler(async (req, res, next) => {
  const projects = await Project.find().populate("userId", "name email");
  res.status(200).json(projects);
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id).populate("userId", "name email");
  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
  }
  res.status(200).json(project);
});

// @desc    Create project
// @route   POST /api/projects
// @access  Private (any logged-in user)
exports.createProject = asyncHandler(async (req, res, next) => {
  req.body.userId = req.user.id; // attach logged-in user
  const project = await Project.create(req.body);
  res.status(201).json(project);
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (owner only)
exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
  }

  // Ensure user owns project
  if (project.userId.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized to update this project`, 401));
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(project);
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (owner only)
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
  }

  // Ensure user owns project
  if (project.userId.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized to delete this project`, 401));
  }

  await project.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
