const nodemailer = require('nodemailer');
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL, FROM_NAME } = require('../config/config');
const ErrorResponse = require('../utils/errorResponse');
const logger = require('../utils/logger');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false // For self-signed certificates
  }
});

// Verify connection configuration
transporter.verify((error) => {
  if (error) {
    logger.error('SMTP connection error:', error);
  } else {
    logger.info('SMTP server is ready to send messages');
  }
});

/**
 * Send email with options
 * @param {Object} options - Email options
 * @param {String} options.email - Recipient email
 * @param {String} options.subject - Email subject
 * @param {String} options.message - Plain text message
 * @param {String} [options.html] - HTML content
 * @param {Array} [options.attachments] - Email attachments
 * @returns {Promise}
 */
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || undefined,
      attachments: options.attachments || undefined
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Email sending failed:', error);
    throw new ErrorResponse('Email could not be sent', 500);
  }
};

/**
 * Send verification email
 * @param {String} email - Recipient email
 * @param {String} token - Verification token
 * @param {String} [name] - Recipient name
 * @returns {Promise}
 */
const sendVerificationEmail = async (email, token, name = 'User') => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const subject = 'Email Verification - Your Portfolio App';
  const message = `
    Hi ${name},\n\n
    Please verify your email by clicking the following link:\n
    ${verificationUrl}\n\n
    If you did not request this, please ignore this email.\n
  `;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">Hi ${name},</h2>
      <p>Please verify your email by clicking the button below:</p>
      <a href="${verificationUrl}" 
         style="display: inline-block; padding: 10px 20px; background: #3498db; color: white; text-decoration: none; border-radius: 5px;">
        Verify Email
      </a>
      <p>Or copy and paste this link into your browser:</p>
      <p>${verificationUrl}</p>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;

  return sendEmail({
    email,
    subject,
    message,
    html
  });
};

/**
 * Send password reset email
 * @param {String} email - Recipient email
 * @param {String} token - Reset token
 * @param {String} [name] - Recipient name
 * @returns {Promise}
 */
const sendPasswordResetEmail = async (email, token, name = 'User') => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  const subject = 'Password Reset Request - Your Portfolio App';
  const message = `
    Hi ${name},\n\n
    You are receiving this email because you requested a password reset.\n
    Please click the following link to reset your password:\n
    ${resetUrl}\n\n
    If you did not request this, please ignore this email.\n
  `;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">Hi ${name},</h2>
      <p>You requested a password reset. Click the button below to proceed:</p>
      <a href="${resetUrl}" 
         style="display: inline-block; padding: 10px 20px; background: #3498db; color: white; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
      <p>Or copy and paste this link into your browser:</p>
      <p>${resetUrl}</p>
      <p>This link will expire in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;

  return sendEmail({
    email,
    subject,
    message,
    html
  });
};

/**
 * Send blog post approval notification
 * @param {String} email - Author email
 * @param {String} postTitle - Blog post title
 * @param {String} postId - Blog post ID
 * @param {String} [name] - Author name
 * @returns {Promise}
 */
const sendPostApprovalEmail = async (email, postTitle, postId, name = 'Author') => {
  const postUrl = `${process.env.FRONTEND_URL}/blog/${postId}`;
  
  const subject = 'Your Blog Post Has Been Approved';
  const message = `
    Hi ${name},\n\n
    Your blog post "${postTitle}" has been approved and is now live!\n
    View it here: ${postUrl}\n\n
    Thank you for contributing!\n
  `;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">Hi ${name},</h2>
      <p>Your blog post <strong>"${postTitle}"</strong> has been approved and is now live!</p>
      <a href="${postUrl}" 
         style="display: inline-block; padding: 10px 20px; background: #3498db; color: white; text-decoration: none; border-radius: 5px;">
        View Post
      </a>
      <p>Thank you for contributing to our blog!</p>
    </div>
  `;

  return sendEmail({
    email,
    subject,
    message,
    html
  });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPostApprovalEmail
};