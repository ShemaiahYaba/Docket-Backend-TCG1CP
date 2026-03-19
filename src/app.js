import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import settings from './config/settings.js';
import corsMiddleware from './config/cors.js';
import { logServerStart } from './config/logger.js';
import { swaggerUi, swaggerSpec } from './config/swagger.js';
import routes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middlewares/errors/index.js';
import { startCronJobs } from './services/cronService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─────────────────────────────────────────────────────────────────────────────
const app = express();

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(corsMiddleware);
app.use(morgan(settings.isDev ? "dev" : "combined"));

// Body parser
app.use(express.json());

// Template engine
app.set("view engine", "ejs");
app.set("views", join(__dirname, "..", "templates"));

// Root redirect → /api/docs
app.get("/", (req, res) => res.redirect("/api/docs"));

// Swagger UI
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api", routes);

// Error handling (order matters — 404 before global handler)
app.use(notFoundHandler);
app.use(errorHandler);

// ─────────────────────────────────────────────────────────────────────────────
app.listen(settings.port, () => {
  logServerStart();
  startCronJobs();
});

export default app;
