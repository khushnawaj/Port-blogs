const Project = require("../models/Project");
const asyncHandler = require("../middleware/async");

// Get all projects of user
exports.getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ userId: req.user.id });
  res.status(200).json({ success: true, data: projects });
});

// Add new project
exports.addProject = asyncHandler(async (req, res) => {
  req.body.userId = req.user.id;
  const project = await Project.create(req.body);
  res.status(201).json({ success: true, data: project });
});

// Update project
exports.updateProject = asyncHandler(async (req, res) => {
  let project = await Project.findById(req.params.id);

  if (!project || project.userId.toString() !== req.user.id) {
    return res.status(404).json({ success: false, message: "Not found or unauthorized" });
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: project });
});

// Delete project
exports.deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project || project.userId.toString() !== req.user.id) {
    return res.status(404).json({ success: false, message: "Not found or unauthorized" });
  }

  await project.deleteOne();
  res.status(200).json({ success: true, data: {} });
});
