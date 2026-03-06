/**
 * Constants barrel export.
 * Import from here instead of the individual files.
 *
 * Usage:
 *   const { ROLES, HTTP, ERR } = require('../constants');
 */
const types = require("./types");
const { HTTP, ERR } = require("./errorCodes");

module.exports = { ...types, HTTP, ERR };
