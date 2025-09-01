// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: [true, "Please add a username"] },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    select: false,
  },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isVerified: { type: Boolean, default: false },
  profileImage: { type: String, default: "" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving (only when modified)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password to hashed
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

// Optional admin seed helper
async function seedAdmin() {
  try {
    const User = mongoose.model("User");
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        username: process.env.ADMIN_NAME || "admin",
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || "admin123",
        role: "admin",
        isVerified: true,
      });
      console.log("Seeded admin user:", admin.email);
      
    }
  } catch (err) {
    console.error("seedAdmin error:", err.message);
  }
}

module.exports = mongoose.model("User", UserSchema);
module.exports.seedAdmin = seedAdmin;
