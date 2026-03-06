require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const errorHandler = require("./middlewares/errorHandler");

const app = express();

// ─── Security & Logging Middleware ───────────────────────────────────────────
// crossOriginResourcePolicy set to 'cross-origin' so all API clients
// (Postman, React Native mobile, frontend) can reach the server.
// The default 'same-origin' would block non-browser clients with 403.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(cors());
app.use(morgan("dev"));

// ─── Body Parser ─────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────────────────

// Health check — used to verify the API is live
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// TODO: mount module routes here as they are built
// app.use('/api/auth',      require('./routes/authRoutes'));
// app.use('/api/lawyers',   require('./routes/lawyerRoutes'));
// app.use('/api/clients',   require('./routes/clientRoutes'));
// app.use('/api/cases',     require('./routes/caseRoutes'));
// app.use('/api/hearings',  require('./routes/hearingRoutes'));
// app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// ─── 404 Catch-All ───────────────────────────────────────────────────────────
// Must be registered AFTER all routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
    data: null,
  });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
// Must be last — Express identifies error handlers by 4 arguments
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Docket API running on http://localhost:${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
