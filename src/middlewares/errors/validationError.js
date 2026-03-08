'use strict';

const { validationResult } = require('express-validator');
const { HTTP, ERR } = require('../../constants');

/**
 * Validation — single source of truth for all validation error handling.
 *
 * Two concerns live here:
 *
 *  1. `validate` middleware — placed AFTER express-validator rule arrays in routes,
 *     BEFORE the controller. Reads accumulated validation errors and short-circuits
 *     with 400 if any exist.
 *
 *     Usage in routes:
 *       const { validate } = require('../middlewares/errors');
 *       router.post('/clients', authMiddleware, [...rules], validate, controller);
 *
 *  2. `isValidationError` / `handleValidationError` — used by the global errorHandler
 *     to catch any ValidationError passed via next(err) from a controller or service.
 */

// ── Route middleware ──────────────────────────────────────────────────────────

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(HTTP.BAD_REQUEST).json({
      success: false,
      message: ERR.VALIDATION_FAILED,
      data: null,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  next();
};

// ── Error handler path (next(err)) ───────────────────────────────────────────

const isValidationError = (err) =>
  err.type === 'validation' || err.name === 'ValidationError';

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

module.exports = { validate, isValidationError, handleValidationError };
