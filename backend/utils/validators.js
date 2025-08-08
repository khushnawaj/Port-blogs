
const validator = require('validator');
const ErrorResponse = require('./errorResponse');

/**
 * Validate email address
 * @param {String} email - Email to validate
 * @returns {Boolean} - True if valid
 */
const validateEmail = (email) => {
  if (!validator.isEmail(email)) {
    throw new ErrorResponse('Please provide a valid email', 400);
  }
  return true;
};

/**
 * Validate password strength
 * @param {String} password - Password to validate
 * @param {Object} [options] - Validation options
 * @param {Number} [options.minLength=8] - Minimum length
 * @param {Boolean} [options.requireUppercase=true] - Require uppercase
 * @param {Boolean} [options.requireNumber=true] - Require number
 * @param {Boolean} [options.requireSpecialChar=true] - Require special char
 * @returns {Boolean} - True if valid
 */
const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireNumber = true,
    requireSpecialChar = true
  } = options;

  if (!password || password.length < minLength) {
    throw new ErrorResponse(`Password must be at least ${minLength} characters`, 400);
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    throw new ErrorResponse('Password must contain at least one uppercase letter', 400);
  }

  if (requireNumber && !/[0-9]/.test(password)) {
    throw new ErrorResponse('Password must contain at least one number', 400);
  }

  if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw new ErrorResponse('Password must contain at least one special character', 400);
  }

  return true;
};

/**
 * Validate username
 * @param {String} username - Username to validate
 * @param {Object} [options] - Validation options
 * @param {Number} [options.minLength=3] - Minimum length
 * @param {Number} [options.maxLength=20] - Maximum length
 * @returns {Boolean} - True if valid
 */
const validateUsername = (username, options = {}) => {
  const { minLength = 3, maxLength = 20 } = options;

  if (!username) {
    throw new ErrorResponse('Username is required', 400);
  }

  if (username.length < minLength || username.length > maxLength) {
    throw new ErrorResponse(
      `Username must be between ${minLength} and ${maxLength} characters`, 
      400
    );
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new ErrorResponse(
      'Username can only contain letters, numbers and underscores', 
      400
    );
  }

  return true;
};

/**
 * Validate URL
 * @param {String} url - URL to validate
 * @param {Object} [options] - Validation options
 * @param {Boolean} [options.requireProtocol=true] - Require http/https
 * @returns {Boolean} - True if valid
 */
const validateUrl = (url, options = {}) => {
  const { requireProtocol = true } = options;

  if (!url) return true; // Empty URL is considered valid (optional field)

  if (requireProtocol) {
    if (!validator.isURL(url, { require_protocol: true })) {
      throw new ErrorResponse('Please include http:// or https://', 400);
    }
  } else if (!validator.isURL(url)) {
    throw new ErrorResponse('Please provide a valid URL', 400);
  }

  return true;
};

/**
 * Validate date
 * @param {String|Date} date - Date to validate
 * @param {Object} [options] - Validation options
 * @param {Boolean} [options.pastOnly=false] - Only allow past dates
 * @param {Boolean} [options.futureOnly=false] - Only allow future dates
 * @returns {Boolean} - True if valid
 */
const validateDate = (date, options = {}) => {
  const { pastOnly = false, futureOnly = false } = options;
  const dateObj = new Date(date);

  if (!date || isNaN(dateObj.getTime())) {
    throw new ErrorResponse('Please provide a valid date', 400);
  }

  const now = new Date();
  
  if (pastOnly && dateObj > now) {
    throw new ErrorResponse('Date must be in the past', 400);
  }

  if (futureOnly && dateObj < now) {
    throw new ErrorResponse('Date must be in the future', 400);
  }

  return true;
};

/**
 * Validate blog post data
 * @param {Object} data - Blog post data
 * @returns {Boolean} - True if valid
 */
const validateBlogPost = (data) => {
  if (!data.title || data.title.trim().length < 5) {
    throw new ErrorResponse('Title must be at least 5 characters', 400);
  }

  if (!data.content || data.content.trim().length < 50) {
    throw new ErrorResponse('Content must be at least 50 characters', 400);
  }

  if (!data.tags || !Array.isArray(data.tags) || data.tags.length === 0) {
    throw new ErrorResponse('Please provide at least one tag', 400);
  }

  if (data.tags.length > 5) {
    throw new ErrorResponse('Maximum 5 tags allowed', 400);
  }

  data.tags.forEach(tag => {
    if (typeof tag !== 'string' || tag.length > 20) {
      throw new ErrorResponse('Each tag must be a string under 20 characters', 400);
    }
  });

  return true;
};

/**
 * Validate portfolio item (education/experience/project)
 * @param {Object} data - Portfolio item data
 * @param {String} type - Item type (education/experience/project)
 * @returns {Boolean} - True if valid
 */
const validatePortfolioItem = (data, type) => {
  const validTypes = ['education', 'experience', 'project'];
  if (!validTypes.includes(type)) {
    throw new ErrorResponse('Invalid portfolio item type', 400);
  }

  // Common validations
  if (!data.startDate) {
    throw new ErrorResponse('Start date is required', 400);
  }
  validateDate(data.startDate);

  if (data.endDate) {
    validateDate(data.endDate);
    if (new Date(data.endDate) < new Date(data.startDate)) {
      throw new ErrorResponse('End date must be after start date', 400);
    }
  }

  // Type-specific validations
  switch (type) {
    case 'education':
      if (!data.institution || data.institution.trim().length < 2) {
        throw new ErrorResponse('Institution name is required', 400);
      }
      if (!data.degree || data.degree.trim().length < 2) {
        throw new ErrorResponse('Degree is required', 400);
      }
      break;

    case 'experience':
      if (!data.company || data.company.trim().length < 2) {
        throw new ErrorResponse('Company name is required', 400);
      }
      if (!data.position || data.position.trim().length < 2) {
        throw new ErrorResponse('Position is required', 400);
      }
      break;

    case 'project':
      if (!data.title || data.title.trim().length < 2) {
        throw new ErrorResponse('Project title is required', 400);
      }
      if (!data.description || data.description.trim().length < 10) {
        throw new ErrorResponse('Description is required', 400);
      }
      if (!data.technologies || !Array.isArray(data.technologies) || data.technologies.length === 0) {
        throw new ErrorResponse('Please provide at least one technology', 400);
      }
      break;
  }

  return true;
};

/**
 * Validate resume data
 * @param {Object} data - Resume data
 * @returns {Boolean} - True if valid
 */
const validateResumeData = (data) => {
  if (!data.name || data.name.trim().length < 2) {
    throw new ErrorResponse('Name is required', 400);
  }

  if (data.contact) {
    if (data.contact.email) validateEmail(data.contact.email);
    if (data.contact.website) validateUrl(data.contact.website);
  }

  if (data.experience && Array.isArray(data.experience)) {
    data.experience.forEach(exp => validatePortfolioItem(exp, 'experience'));
  }

  if (data.education && Array.isArray(data.education)) {
    data.education.forEach(edu => validatePortfolioItem(edu, 'education'));
  }

  if (data.skills && Array.isArray(data.skills)) {
    data.skills.forEach(skill => {
      if (!skill.name || skill.name.trim().length < 2) {
        throw new ErrorResponse('Skill name is required', 400);
      }
      if (typeof skill.proficiency !== 'number' || skill.proficiency < 0 || skill.proficiency > 100) {
        throw new ErrorResponse('Proficiency must be between 0 and 100', 400);
      }
    });
  }

  return true;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
  validateUrl,
  validateDate,
  validateBlogPost,
  validatePortfolioItem,
  validateResumeData
};