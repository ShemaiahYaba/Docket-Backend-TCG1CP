const { HTTP } = require("../../constants");

/**
 * AppError — operational (expected) errors thrown from controllers/services.
 *
 * Usage:
 *   throw new AppError('Case not found.', HTTP.NOT_FOUND);
 *   throw new AppError('You do not have permission.', HTTP.FORBIDDEN);
 *
 * The global errorHandler in index.js detects AppError via isOperational
 * and returns the status + message directly without leaking a stack trace.
 */
class AppError extends Error {
  constructor(message, statusCode = HTTP.SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes known errors from unexpected crashes
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
