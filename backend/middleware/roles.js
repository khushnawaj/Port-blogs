const ErrorResponse = require('../utils/errorResponse');
const mongoose = require('mongoose');

/**
 * Enhanced Role-Based Access Control (RBAC) middleware
 * @param {...String} roles - Allowed roles for the route
 * @returns {Function} - Express middleware function
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      // Validate request user object
      if (!req.user || !req.user.role) {
        throw new ErrorResponse('Not authorized to access this route', 401);
      }

      // Convert role to lowercase for case-insensitive comparison
      const userRole = req.user.role.toLowerCase();
      const allowedRoles = roles.map(role => role.toLowerCase());

      if (!allowedRoles.includes(userRole)) {
        throw new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        );
      }

      return next();
    } catch (err) {
      next(err);
    }
  };
};

/**
 * Enhanced Ownership check middleware with document validation
 * @param {String} modelName - Name of the model for error messages
 * @param {String} [idParam='id'] - Name of the route parameter containing the ID
 * @param {String} [userPath='user'] - Path to user reference in the document
 * @returns {Function} - Express middleware function
 */
const checkOwnership = (modelName, idParam = 'id', userPath = 'user') => {
  return async (req, res, next) => {
    try {
      // Validate request parameters
      const docId = req.params[idParam];
      if (!docId || !mongoose.Types.ObjectId.isValid(docId)) {
        throw new ErrorResponse(`Invalid ${modelName} ID`, 400);
      }

      // Validate Model exists on request
      if (!req.Model) {
        throw new ErrorResponse('Model not specified', 500);
      }

      // Find document with lean() for better performance
      const document = await req.Model.findById(docId).lean();
      if (!document) {
        throw new ErrorResponse(`${modelName} not found with id of ${docId}`, 404);
      }

      // Admin bypass
      if (req.user.role === 'admin') {
        req.document = document;
        return next();
      }

      // Check ownership
      const userRef = userPath.split('.').reduce((obj, key) => {
        return obj ? obj[key] : null;
      }, document);

      if (!userRef || userRef.toString() !== req.user.id.toString()) {
        throw new ErrorResponse(
          `User ${req.user.id} is not authorized to modify this ${modelName}`,
          401
        );
      }

      // Attach document to request
      req.document = document;
      next();
    } catch (err) {
      next(err);
    }
  };
};

/**
 * Enhanced Self-action prevention with validation
 * @param {String} [idParam='id'] - Name of the route parameter containing the ID
 * @returns {Function} - Express middleware function
 */
const preventSelfAction = (idParam = 'id') => {
  return (req, res, next) => {
    try {
      const targetUserId = req.params[idParam];
      
      // Validate target user ID exists and matches current user
      if (targetUserId && targetUserId.toString() === req.user.id.toString()) {
        throw new ErrorResponse('You cannot perform this action on yourself', 400);
      }
      
      next();
    } catch (err) {
      next(err);
    }
  };
};

// Additional utility middleware
const validateModel = (modelName) => {
  return (req, res, next) => {
    try {
      if (!req.Model) {
        throw new ErrorResponse(`Model configuration error for ${modelName}`, 500);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = {
  authorize,
  checkOwnership,
  preventSelfAction,
  validateModel
};