const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Education = require('../models/Education');
const Experience = require('../models/Experience');
const Project = require('../models/Project');
const Skill = require('../models/Skill');

// @desc    Get all portfolio items for a user
// @route   GET /api/v1/portfolio/:userId
// @access  Public
exports.getPortfolio = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;

  const [education, experience, projects, skills] = await Promise.all([
    Education.find({ userId }),
    Experience.find({ userId }),
    Project.find({ userId }),
    Skill.find({ userId })
  ]);

  res.status(200).json({
    success: true,
    data: {
      education,
      experience,
      projects,
      skills
    }
  });
});

// @desc    Get education
// @route   GET /api/v1/portfolio/education
// @route   GET /api/v1/portfolio/education/:id
// @access  Public/Private
exports.getEducation = asyncHandler(async (req, res, next) => {
  if (req.params.id) {
    const education = await Education.findById(req.params.id);

    if (!education) {
      return next(
        new ErrorResponse(`Education not found with id of ${req.params.id}`, 404)
      );
    }

    return res.status(200).json({
      success: true,
      data: education
    });
  }

  res.status(200).json(res.advancedResults);
});

// @desc    Add education
// @route   POST /api/v1/portfolio/education
// @access  Private
exports.addEducation = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.userId = req.user.id;

  const education = await Education.create(req.body);

  res.status(201).json({
    success: true,
    data: education
  });
});

// @desc    Update education
// @route   PUT /api/v1/portfolio/education/:id
// @access  Private
exports.updateEducation = asyncHandler(async (req, res, next) => {
  let education = await Education.findById(req.params.id);

  if (!education) {
    return next(
      new ErrorResponse(`Education not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is education owner
  if (education.userId.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this education`,
        401
      )
    );
  }

  education = await Education.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: education
  });
});

// @desc    Delete education
// @route   DELETE /api/v1/portfolio/education/:id
// @access  Private
exports.deleteEducation = asyncHandler(async (req, res, next) => {
  const education = await Education.findById(req.params.id);

  if (!education) {
    return next(
      new ErrorResponse(`Education not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is education owner
  if (education.userId.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this education`,
        401
      )
    );
  }

  await education.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
exports.clonePortfolio = asyncHandler(async (req, res, next) => {
  const sourceUserId = req.params.userId;
  
  const [edu, exp, proj, skl] = await Promise.all([
    Education.find({ userId: sourceUserId }),
    Experience.find({ userId: sourceUserId }),
    Project.find({ userId: sourceUserId }),
    Skill.find({ userId: sourceUserId })
  ]);

  // Clone with new userId
  const newUserId = req.user.id;
  const cloneOps = [
    Education.insertMany(edu.map(e => ({ ...e._doc, userId: newUserId, _id: undefined }))),
    // Repeat for other models
  ];

  await Promise.all(cloneOps);
  res.status(201).json({ success: true });
});
// Similar controllers for Experience, Projects, and Skills would follow...
// I've shown the pattern for Education, the others would be very similar
// ================= EXPERIENCE CONTROLLERS ================= //

// @desc    Get experience
// @route   GET /api/v1/portfolio/experience
// @route   GET /api/v1/portfolio/experience/:id
// @access  Public/Private
exports.getExperience = asyncHandler(async (req, res, next) => {
  if (req.params.id) {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return next(
        new ErrorResponse(`Experience not found with id of ${req.params.id}`, 404)
      );
    }

    return res.status(200).json({
      success: true,
      data: experience
    });
  }

  res.status(200).json(res.advancedResults);
});

// @desc    Add experience
// @route   POST /api/v1/portfolio/experience
// @access  Private
exports.addExperience = asyncHandler(async (req, res, next) => {
  req.body.userId = req.user.id;

  const experience = await Experience.create(req.body);

  res.status(201).json({
    success: true,
    data: experience
  });
});

// @desc    Update experience
// @route   PUT /api/v1/portfolio/experience/:id
// @access  Private
exports.updateExperience = asyncHandler(async (req, res, next) => {
  let experience = await Experience.findById(req.params.id);

  if (!experience) {
    return next(
      new ErrorResponse(`Experience not found with id of ${req.params.id}`, 404)
    );
  }

  // Ensure user owns this experience
  if (experience.userId.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this experience`,
        401
      )
    );
  }

  experience = await Experience.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: experience
  });
});

// @desc    Delete experience
// @route   DELETE /api/v1/portfolio/experience/:id
// @access  Private
exports.deleteExperience = asyncHandler(async (req, res, next) => {
  const experience = await Experience.findById(req.params.id);

  if (!experience) {
    return next(
      new ErrorResponse(`Experience not found with id of ${req.params.id}`, 404)
    );
  }

  if (experience.userId.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this experience`,
        401
      )
    );
  }

  await experience.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
