// config/nodemailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,       // Your Gmail
    pass: process.env.EMAIL_PASS        // App-specific password (not normal password)
  }
});

module.exports = transporter;
