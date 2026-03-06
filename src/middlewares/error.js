/**
 * Error Handling Middleware
 *
 * notFoundHandler — 404 catch-all, register AFTER all routes in app.js
 * errorHandler    — global error handler, register LAST in app.js (4-arg signature)
 *
 * Both support content negotiation:
 *   browser (Accept: text/html) → renders response.ejs template
 *   API client                  → returns JSON
 */

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

// ─────────────────────────────────────────────────────────────────────────────

const notFoundHandler = (req, res) => {
  renderOrJson(res, req, 404, {
    success: false,
    message: "Route not found.",
    data: null,
  });
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Sequelize model-level validation error
  if (err.name === "SequelizeValidationError") {
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return renderOrJson(
      res,
      req,
      400,
      {
        success: false,
        message: "Validation failed",
        data: null,
      },
      errors,
    );
  }

  // Sequelize unique constraint violation (e.g. duplicate email)
  if (err.name === "SequelizeUniqueConstraintError") {
    return renderOrJson(res, req, 409, {
      success: false,
      message: "A record with this value already exists.",
      data: null,
    });
  }

  // Default 500 — never send raw error details to the client
  renderOrJson(res, req, 500, {
    success: false,
    message: "An unexpected error occurred. Please try again.",
    data: null,
  });
};

module.exports = { notFoundHandler, errorHandler };
