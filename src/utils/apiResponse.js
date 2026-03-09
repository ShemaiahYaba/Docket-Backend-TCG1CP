/**
 * API Response Utilities
 * Standardizes all success responses to the established shape: { success, message, data }
 *
 * Usage:
 *   import { sendSuccess, sendCreated, sendNoContent } from '../utils/apiResponse.js';
 *
 *   sendSuccess(res, lawyers, 'Lawyers retrieved');
 *   sendCreated(res, newCase, 'Case created');
 *   sendNoContent(res);
 */

const sendSuccess = (res, data, message = 'Success', statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

const sendCreated = (res, data, message = 'Created successfully') =>
  sendSuccess(res, data, message, 201);

const sendNoContent = (res) => res.status(204).send();

export { sendSuccess, sendCreated, sendNoContent };
