/**
 * Global Error Handler Middleware
 * Catches all errors passed via next(err) and returns consistent JSON responses.
 * Must be registered LAST in app.js, after all routes.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Sequelize model-level validation error
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      data: null,
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }

  // Sequelize unique constraint violation (duplicate email etc.)
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      success: false,
      message: "A record with this value already exists.",
      data: null,
    });
  }

  // Default 500 — never expose raw error details to the client
  return res.status(500).json({
    success: false,
    message: "An unexpected error occurred. Please try again.",
    data: null,
  });
};

module.exports = errorHandler;
