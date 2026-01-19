const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    home: {
      fullName: { type: String, required: true },
      tagline: { type: String },
      profileImage: { type: String },
    },

    about: {
      bio: { type: String },
      skills: [{ type: String }],
      interests: [{ type: String }],
    },

    resume: {
      education: [
        {
          school: String,
          degree: String,
          year: String,
        },
      ],
      experience: [
        {
          company: String,
          role: String,
          duration: String,
          details: String,
        },
      ],
      achievements: [String],
    },

    projects: [
      {
        title: String,
        description: String,
        techStack: [String],
        link: String,
      },
    ],

    contact: {
      email: String,
      phone: String,
      linkedin: String,
      github: String,
      twitter: String,
      website: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", PortfolioSchema);
