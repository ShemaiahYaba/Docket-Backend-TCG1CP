import settings from './settings.js';

/**
 * Server startup log.
 * Pass as the callback to app.listen() in app.js.
 *
 * Usage:
 *   import { logServerStart } from './config/logger.js';
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

export { logServerStart };
