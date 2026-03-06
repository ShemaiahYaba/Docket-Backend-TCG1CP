const { HTTP, ERR } = require("../../constants");

/**
 * Validation Error Handler
 * Handles express-validator field-level validation failures.
 *
 * Note: Sequelize model-level SequelizeValidationErrors are handled
 * in ormError.js since they originate from the ORM layer.
 */

const isValidationError = (err) =>
  err.type === "validation" || err.name === "ValidationError";

const handleValidationError = (err) => ({
  status: HTTP.BAD_REQUEST,
  payload: {
    success: false,
    message: ERR.VALIDATION_FAILED,
    data: null,
  },
  errors: Array.isArray(err.errors)
    ? err.errors.map((e) => ({ field: e.field || e.path, message: e.message }))
    : null,
});

module.exports = { isValidationError, handleValidationError };
