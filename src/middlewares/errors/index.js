const { HTTP, ERR } = require("../../constants");
const AppError = require("./appError");
const { isOrmError, handleOrmError } = require("./ormError");
const { handleServerError } = require("./serverError");

/**
 * Errors module — barrel export + Express middleware assembly.
 *
 * Exported modules (for use throughout the codebase):
 *   AppError          — throw new AppError('msg', HTTP.NOT_FOUND)
 *   isOrmError        — detector for Sequelize errors
 *   handleOrmError    — formats Sequelize errors into HTTP responses
 *   handleServerError — 500 catch-all
 *
 * Exported middleware (for app.js):
 *   notFoundHandler   — 404 catch-all, register AFTER all routes
 *   errorHandler      — global handler, register LAST (4-arg signature)
 */

// ─── Shared helper ────────────────────────────────────────────────────────────

const renderOrJson = (res, req, status, payload, errors) => {
  if (req.accepts(["json", "html"]) === "html") {
    res.set("Cache-Control", "no-store");
    return res.status(status).render("response", {
      title: payload.message,
      method: req.method,
      route: req.originalUrl,
      statusCode: status,
      timestamp: new Date().toISOString(),
      data: payload,
      errors: errors || undefined,
    });
  }

  if (errors) payload.errors = errors;
  res.status(status).json(payload);
};

// ─── Express Middleware ───────────────────────────────────────────────────────

const notFoundHandler = (req, res) => {
  renderOrJson(res, req, HTTP.NOT_FOUND, {
    success: false,
    message: ERR.ROUTE_NOT_FOUND,
    data: null,
  });
};

const errorHandler = (err, req, res, next) => {
  // Known operational error thrown via AppError
  if (err.isOperational) {
    return renderOrJson(res, req, err.statusCode, {
      success: false,
      message: err.message,
      data: null,
    });
  }

  // ORM / Sequelize errors
  if (isOrmError(err)) {
    const { status, payload, errors } = handleOrmError(err);
    return renderOrJson(res, req, status, payload, errors);
  }

  // Unknown / unexpected errors — log and return 500
  const { status, payload } = handleServerError(err);
  renderOrJson(res, req, status, payload);
};

// ─── Barrel ──────────────────────────────────────────────────────────────────

module.exports = {
  AppError,
  isOrmError,
  handleOrmError,
  handleServerError,
  notFoundHandler,
  errorHandler,
};
