const { HTTP, ERR } = require("../../constants");

/**
 * Server Error Handler
 * Last-resort catch-all for any unhandled/unexpected errors.
 * Never exposes stack traces or internal details to the client.
 */

const handleServerError = (err) => {
  // Log full error server-side so it can be investigated
  console.error("[SERVER ERROR]", err);

  return {
    status: HTTP.SERVER_ERROR,
    payload: {
      success: false,
      message: ERR.SERVER_ERROR,
      data: null,
    },
    errors: null,
  };
};

module.exports = { handleServerError };
