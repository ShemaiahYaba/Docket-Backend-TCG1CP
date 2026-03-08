'use strict';

/**
 * asyncHandler — wraps async controller functions so errors propagate to next(err).
 *
 * Without this, an unhandled throw inside an async controller is an unhandled
 * rejection that Express never sees. With it, the rejection is caught and passed
 * to the global errorHandler automatically — no try/catch needed in controllers.
 *
 * Usage in routes:
 *   const asyncHandler = require('../utils/asyncHandler');
 *   router.get('/lawyers', authMiddleware, asyncHandler(getLawyers));
 *
 * Usage in controllers (no try/catch required):
 *   const getLawyers = async (req, res) => {
 *     const lawyers = await LawyerService.getAll();    // throws AppError on failure
 *     sendSuccess(res, lawyers, 'Lawyers retrieved');
 *   };
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
