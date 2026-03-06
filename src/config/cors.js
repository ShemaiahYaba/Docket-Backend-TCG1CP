const cors = require("cors");

/**
 * CORS configuration.
 * Origin is open (*) for V1 — tighten to specific frontend/mobile origins in production.
 */
module.exports = cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
