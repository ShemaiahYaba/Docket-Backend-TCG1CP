/**
 * HTTP status codes and standard error messages.
 * Use HTTP.NOT_FOUND instead of the magic number 404 everywhere.
 */

const HTTP = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  SERVER_ERROR: 500,
};

const ERR = {
  // Auth
  AUTH_REQUIRED: "Authentication required. Please log in.",
  TOKEN_EXPIRED: "Your session has expired. Please log in again.",
  TOKEN_INVALID: "Invalid authentication token.",
  ACCOUNT_INACTIVE: "This account has been deactivated.",
  INVALID_CREDENTIALS: "Invalid email or password.",

  // Permissions
  FORBIDDEN: "You do not have permission to perform this action.",
  OWN_CASES_ONLY:
    "You can only perform this action on your own assigned cases.",

  // Generic resource
  NOT_FOUND: "Resource not found.",
  ROUTE_NOT_FOUND: "Route not found.",
  DUPLICATE: "A record with this value already exists.",

  // Validation
  VALIDATION_FAILED: "Validation failed",

  // Business rules
  CASE_CLOSED: "Cannot perform this action on a closed case.",
  INVALID_STATUS_TRANSITION: "Invalid status transition.",
  HEARING_DATE_PAST: "Hearing date must be in the future.",

  // Server
  SERVER_ERROR: "An unexpected error occurred. Please try again.",
};

module.exports = { HTTP, ERR };
