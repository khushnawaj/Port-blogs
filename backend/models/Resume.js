const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  school: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  grade: { type: String },
  description: { type: String },
});

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  description: { type: String },
});

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "Expert"], default: "Beginner" },
});

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  education: [educationSchema],
  experience: [experienceSchema],
  skills: [skillSchema],
  certifications: [{ type: String }],
  languages: [{ type: String }],
});

module.exports = mongoose.model("Resume", resumeSchema);
