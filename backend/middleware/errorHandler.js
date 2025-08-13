const ErrorResponse = require('../utils/errorResponse');
const colors = require('colors'); // For colored console output

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error details
  console.error(
    `${'Error:'.red} ${err.stack || err.message}\n`,
    `Path:`.yellow, req.originalUrl, '\n',
    `Method:`.yellow, req.method, '\n',
    `IP:`.yellow, req.ip, '\n',
    `Headers:`.yellow, req.headers, '\n',
    `Body:`.yellow, req.body
  );

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    const message = `Resource not found with ID: ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate field value: ${field} '${value}' already exists`;
    error = new ErrorResponse(message, 409); // 409 Conflict is more appropriate
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    const message = `Validation failed: ${messages.join('. ')}`;
    error = new ErrorResponse(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new ErrorResponse(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token has expired';
    error = new ErrorResponse(message, 401);
  }

  // Custom ErrorResponse handling
  if (err instanceof ErrorResponse) {
    error = err;
  }

  // Determine if we should show the error stack in development
  const showStack = process.env.NODE_ENV === 'development';

  // Error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Internal Server Error',
    stack: showStack ? err.stack : undefined,
    ...(process.env.NODE_ENV === 'development' && {
      details: {
        name: err.name,
        code: err.code,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
      }
    })
  });
};

module.exports = errorHandler;