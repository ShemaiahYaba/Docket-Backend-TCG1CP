import { EmailLog } from '../../models/index.js';

/**
 * Persists an email send attempt to the database.
 * Never throws — logging failure must not affect anything else.
 *
 * @param {{ to: string, subject: string, type: string, status: string, error_message?: string }} entry
 */
export const logEmail = async ({ to, subject, type, status, error_message = null }) => {
  try {
    await EmailLog.create({ to, subject, type, status, error_message, sent_at: new Date() });
  } catch (err) {
    console.error('[EmailLog] Failed to write log entry:', err.message);
  }
};
