const settings = require("./settings");

/**
 * Server startup log.
 * Pass as the callback to app.listen() in app.js.
 *
 * Usage:
 *   const { logServerStart } = require('./config/logger');
 *   app.listen(settings.port, logServerStart);
 */
const logServerStart = () => {
  console.log("");
  console.log(`🚀 Docket API     →  http://localhost:${settings.port}`);
  console.log(`📋 Environment    →  ${settings.nodeEnv}`);
  console.log(
    `✅ Health check   →  http://localhost:${settings.port}/api/health`,
  );
  console.log("");
};

module.exports = { logServerStart };
