const mongoose = require('mongoose');

const ResumeTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a template name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Template name cannot be more than 50 characters']
  },
  thumbnail: {
    type: String,
    required: [true, 'Please add a thumbnail image']
  },
  templateFile: {
    type: String,
    required: [true, 'Please add a template file']
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  version: {
  type: String,
  required: true
},
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ResumeTemplate', ResumeTemplateSchema);