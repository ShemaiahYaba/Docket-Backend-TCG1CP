const { Router } = require("express");

const router = Router();

/**
 * Health Check
 * GET /api/health
 *
 * Returns JSON for API clients.
 * Renders the EJS response template for browser requests (Accept: text/html).
 */
router.get("/health", (req, res) => {
  const payload = { status: "ok" };

  if (req.accepts("html") && !req.accepts("json")) {
    return res.render("response", {
      title: "Health Check",
      method: req.method,
      route: req.originalUrl,
      statusCode: 200,
      timestamp: new Date().toISOString(),
      data: payload,
    });
  }

  res.status(200).json(payload);
});

// ─── Module Routes ────────────────────────────────────────────────────────────
// Uncomment each line as the corresponding module is built and merged.

// router.use('/auth',      require('./authRoutes'));
// router.use('/lawyers',   require('./lawyerRoutes'));
// router.use('/clients',   require('./clientRoutes'));
// router.use('/cases',     require('./caseRoutes'));
// router.use('/hearings',  require('./hearingRoutes'));
// router.use('/dashboard', require('./dashboardRoutes'));

module.exports = router;
