import cors from 'cors';

/**
 * CORS configuration.
 * Origin is open (*) for V1 — tighten to specific frontend/mobile origins in production.
 */
export default cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
