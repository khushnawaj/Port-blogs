const ErrorResponse = require('../utils/errorResponse');

/**
 * Role-Based Access Control (RBAC) middleware
 * @param {...String} roles - Allowed roles for the route
 * @returns {Function} - Express middleware function
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user exists and has a role
    if (!req.user || !req.user.role) {
      return next(
        new ErrorResponse('Not authorized to access this route', 401)
      );
    }

    // Check if user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }

    // If authorized, proceed to the next middleware/route handler
    next();
  };
};

/**
 * Ownership check middleware
 * @param {String} modelName - Name of the model for error messages
 * @param {String} [idParam='id'] - Name of the route parameter containing the ID
 * @param {String} [userPath='user'] - Path to user reference in the document
 * @returns {Function} - Express middleware function
 */
const checkOwnership = (modelName, idParam = 'id', userPath = 'user') => {
  return async (req, res, next) => {
    try {
      // Get the document ID from request params
      const docId = req.params[idParam];
      
      // Get the model from the request (attached by advancedResults middleware)
      const Model = req.Model;
      
      // Find the document
      const document = await Model.findById(docId);
      
      if (!document) {
        return next(
          new ErrorResponse(`${modelName} not found with id of ${docId}`, 404)
        );
      }

      // Check ownership (admin bypasses ownership check)
      if (req.user.role !== 'admin') {
        // Handle nested user references (e.g., 'author' or 'user')
        const userRef = userPath.split('.').reduce((obj, key) => obj[key], document);
        
        if (userRef.toString() !== req.user.id) {
          return next(
            new ErrorResponse(
              `User ${req.user.id} is not authorized to modify this ${modelName}`,
              401
            )
          );
        }
      }

      // Attach document to request for use in route handlers
      req.document = document;
      next();
    } catch (err) {
      next(err);
    }
  };
};

/**
 * Self-action check middleware
 * @description Prevents users from performing actions on themselves (e.g., deleting own account)
 * @param {String} [idParam='id'] - Name of the route parameter containing the ID
 * @returns {Function} - Express middleware function
 */
const preventSelfAction = (idParam = 'id') => {
  return (req, res, next) => {
    const targetUserId = req.params[idParam];
    
    if (targetUserId === req.user.id) {
      return next(
        new ErrorResponse('You cannot perform this action on yourself', 400)
      );
    }
    
    next();
  };
};

module.exports = {
  authorize,
  checkOwnership,
  preventSelfAction
};