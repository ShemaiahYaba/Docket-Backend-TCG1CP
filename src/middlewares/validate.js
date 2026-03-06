const { validationResult } = require("express-validator");

/**
 * Validation middleware — run AFTER express-validator rules, BEFORE the controller.
 * If validation errors exist, responds with 400 and a field-level errors array.
 *
 * Usage in routes:
 *   router.post('/clients', authMiddleware, requireRole(...), [validators...], validate, controller)
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
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
