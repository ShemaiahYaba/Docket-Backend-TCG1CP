const { validationResult } = require("express-validator");
const { HTTP, ERR } = require("../constants");

/**
 * Validation middleware — place AFTER express-validator rule arrays, BEFORE the controller.
 * Reads the accumulated validation errors from the request and short-circuits with 400 if any exist.
 *
 * Usage in routes:
 *   router.post('/clients', authMiddleware, requireRole(...), [...rules], validate, controller)
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(HTTP.BAD_REQUEST).json({
      success: false,
      message: ERR.VALIDATION_FAILED,
      data: null,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

module.exports = validate;
