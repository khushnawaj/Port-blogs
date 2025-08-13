const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Education = require('../models/Education');
const Experience = require('../models/Experience');
const Project = require('../models/Project');
const Skill = require('../models/Skill');

// ================== PORTFOLIO ================== //
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
    data: { education, experience, projects, skills }
  });
});

// ================== EDUCATION ================== //
exports.getEducation = asyncHandler(async (req, res, next) => {
  if (req.params.id) {
    const education = await Education.findById(req.params.id);
    if (!education) {
      return next(new ErrorResponse(`Education not found with id ${req.params.id}`, 404));
    }
    return res.status(200).json({ success: true, data: education });
  }

  const education = await Education.find();
  res.status(200).json({ success: true, count: education.length, data: education });
});

exports.addEducation = asyncHandler(async (req, res) => {
  req.body.userId = req.user.id;
  const education = await Education.create(req.body);
  res.status(201).json({ success: true, data: education });
});

exports.updateEducation = asyncHandler(async (req, res, next) => {
  let education = await Education.findById(req.params.id);
  if (!education) return next(new ErrorResponse(`Education not found with id ${req.params.id}`, 404));

  if (education.userId.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized to update this record`, 401));
  }

  education = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: education });
});

exports.deleteEducation = asyncHandler(async (req, res, next) => {
  const education = await Education.findById(req.params.id);
  if (!education) return next(new ErrorResponse(`Education not found with id ${req.params.id}`, 404));

  if (education.userId.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized to delete this record`, 401));
  }

  await education.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

// ================== EXPERIENCE ================== //
exports.getExperience = asyncHandler(async (req, res, next) => {
  if (req.params.id) {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return next(new ErrorResponse(`Experience not found with id ${req.params.id}`, 404));
    }
    return res.status(200).json({ success: true, data: experience });
  }

  const experiences = await Experience.find();
  res.status(200).json({ success: true, count: experiences.length, data: experiences });
});

exports.addExperience = asyncHandler(async (req, res) => {
  req.body.userId = req.user.id;
  const experience = await Experience.create(req.body);
  res.status(201).json({ success: true, data: experience });
});

exports.updateExperience = asyncHandler(async (req, res, next) => {
  let experience = await Experience.findById(req.params.id);
  if (!experience) return next(new ErrorResponse(`Experience not found with id ${req.params.id}`, 404));

  if (experience.userId.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized to update this record`, 401));
  }

  experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: experience });
});

exports.deleteExperience = asyncHandler(async (req, res, next) => {
  const experience = await Experience.findById(req.params.id);
  if (!experience) return next(new ErrorResponse(`Experience not found with id ${req.params.id}`, 404));

  if (experience.userId.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized to delete this record`, 401));
  }

  await experience.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

// ================== CLONE PORTFOLIO ================== //
exports.clonePortfolio = asyncHandler(async (req, res, next) => {
  const sourceUserId = req.params.userId;
  const newUserId = req.user.id;

  const [edu, exp, proj, skl] = await Promise.all([
    Education.find({ userId: sourceUserId }),
    Experience.find({ userId: sourceUserId }),
    Project.find({ userId: sourceUserId }),
    Skill.find({ userId: sourceUserId })
  ]);

  await Promise.all([
    Education.insertMany(edu.map(e => ({ ...e.toObject(), _id: undefined, userId: newUserId }))),
    Experience.insertMany(exp.map(e => ({ ...e.toObject(), _id: undefined, userId: newUserId }))),
    Project.insertMany(proj.map(p => ({ ...p.toObject(), _id: undefined, userId: newUserId }))),
    Skill.insertMany(skl.map(s => ({ ...s.toObject(), _id: undefined, userId: newUserId })))
  ]);

  res.status(201).json({ success: true, message: 'Portfolio cloned successfully' });
});
