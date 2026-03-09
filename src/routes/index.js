import { Router } from 'express';

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

// import authRoutes from './authRoutes.js';
// import lawyerRoutes from './lawyerRoutes.js';
// import clientRoutes from './clientRoutes.js';
// import caseRoutes from './caseRoutes.js';
// import hearingRoutes from './hearingRoutes.js';
// import dashboardRoutes from './dashboardRoutes.js';
// router.use('/auth',      authRoutes);
// router.use('/lawyers',   lawyerRoutes);
// router.use('/clients',   clientRoutes);
// router.use('/cases',     caseRoutes);
// router.use('/hearings',  hearingRoutes);
// router.use('/dashboard', dashboardRoutes);

export default router;
