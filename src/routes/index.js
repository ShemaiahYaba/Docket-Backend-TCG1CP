const { Router } = require("express");

const router = Router();

/**
 * API Index — redirect to Swagger docs
 * GET /api
 */
router.get("/", (req, res) => res.redirect("/api/docs"));

/**
 * Health Check
 * GET /api/health
 *
 * Returns JSON for API clients.
 * Renders the EJS response template for browser requests (Accept: text/html).
 */
router.get("/health", (req, res) => {
  const payload = { status: "ok" };

  // req.accepts(['json', 'html']) returns whichever the client prefers.
  // Browsers send Accept: text/html first (q=1), so they get the EJS template.
  // API clients (Postman, curl, fetch default) prefer json and get JSON.
  if (req.accepts(["json", "html"]) === "html") {
    res.set("Cache-Control", "no-store"); // prevent 304 on the HTML view
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
