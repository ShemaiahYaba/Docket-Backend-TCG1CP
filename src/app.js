const path = require("path");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const settings = require("./config/settings");
const corsMiddleware = require("./config/cors");
const { logServerStart } = require("./config/logger");
const routes = require("./routes");
const { notFoundHandler, errorHandler } = require("./middlewares/error");

// ─────────────────────────────────────────────────────────────────────────────
const app = express();

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(corsMiddleware);
app.use(morgan("dev"));

// Body parser
app.use(express.json());

// Template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "templates"));

// Routes
app.use("/api", routes);

// Error handling (order matters — 404 before global handler)
app.use(notFoundHandler);
app.use(errorHandler);

// ─────────────────────────────────────────────────────────────────────────────
app.listen(settings.port, logServerStart);

module.exports = app;
