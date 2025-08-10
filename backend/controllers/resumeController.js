const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const ResumeTemplate = require('../models/ResumeTemplate');
const { generateResumePDF } = require('../utils/helpers');

// @desc    Get all resume templates
// @route   GET /api/v1/resume/templates
// @access  Public
exports.getTemplates = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single resume template
// @route   GET /api/v1/resume/templates/:id
// @access  Public
exports.getTemplate = asyncHandler(async (req, res, next) => {
  const template = await ResumeTemplate.findById(req.params.id);

  if (!template) {
    return next(
      new ErrorResponse(`Template not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: template
  });
});

// @desc    Create resume template (Admin only)
// @route   POST /api/v1/resume/templates
// @access  Private/Admin
exports.createTemplate = asyncHandler(async (req, res, next) => {
  const template = await ResumeTemplate.create(req.body);

  res.status(201).json({
    success: true,
    data: template
  });
});

// @desc    Generate resume PDF
// @route   POST /api/v1/resume/generate
// @access  Private
exports.generateResume = asyncHandler(async (req, res, next) => {
  const { resumeData, templateId } = req.body;

  let templatePath = null;
  if (templateId) {
    const template = await ResumeTemplate.findById(templateId);
    if (template) {
      templatePath = path.join(__dirname, '../public', template.templateFile);
    }
  }

  try {
    const pdfBuffer = await generateResumePDF(resumeData, templatePath);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=resume.pdf',
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (err) {
    return next(new ErrorResponse('Error generating PDF', 500));
  }
});

exports.previewTemplate = asyncHandler(async (req, res, next) => {
  const template = await ResumeTemplate.findById(req.params.id);
  res.sendFile(path.join(__dirname, '../public', template.templateFile));
});
exports.getUserTemplates = asyncHandler(async (req, res, next) => {
  const templates = await ResumeTemplate.find({ userId: req.user.id });

  res.status(200).json({
    success: true,
    count: templates.length,
    data: templates
  });
});
