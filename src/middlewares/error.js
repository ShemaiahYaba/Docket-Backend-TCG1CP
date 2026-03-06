/**
 * Error Handling Middleware
 *
 * notFoundHandler — 404 catch-all, register AFTER all routes in app.js
 * errorHandler    — global error handler, register LAST in app.js (4-arg signature)
 */

const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
    data: null,
  });
};

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

  // Sequelize unique constraint violation (e.g. duplicate email)
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      success: false,
      message: "A record with this value already exists.",
      data: null,
    });
  }

  // Default 500 — never send raw error details to the client
  return res.status(500).json({
    success: false,
    message: "An unexpected error occurred. Please try again.",
    data: null,
  });
};

module.exports = { notFoundHandler, errorHandler };
