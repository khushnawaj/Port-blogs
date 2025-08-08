const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: [true, 'Please add an institution name'],
    trim: true,
    maxlength: [100, 'Institution name cannot be more than 100 characters']
  },
  degree: {
    type: String,
    required: [true, 'Please add a degree'],
    trim: true,
    maxlength: [100, 'Degree cannot be more than 100 characters']
  },
  fieldOfStudy: {
    type: String,
    trim: true,
    maxlength: [100, 'Field of study cannot be more than 100 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  endDate: {
    type: Date
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Education', EducationSchema);