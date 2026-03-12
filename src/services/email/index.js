import settings from '../../config/settings.js';
import transporter from './transporter.js';
import { logEmail } from './logger.js';
import { welcomeTemplate } from './templates/welcome.js';
import { hearingConfirmationTemplate } from './templates/hearingConfirmation.js';
import { hearingAlertTemplate } from './templates/hearingAlert.js';

/**
 * Core send + log function. All exported senders delegate here.
 * @param {{ to: string, subject: string, html: string, type: string }} options
 */
const sendEmail = async ({ to, subject, html, type }) => {
  try {
    await transporter.sendMail({ from: settings.mail.from, to, subject, html });
    await logEmail({ to, subject, type, status: 'sent' });
  } catch (err) {
    await logEmail({ to, subject, type, status: 'failed', error_message: err.message });
    throw err;
  }
};

/**
 * Welcome email — called from lawyerController.createLawyer (fire-and-forget).
 * @param {{ full_name: string, email: string, role: string }} lawyer
 */
export const sendWelcomeEmail = (lawyer) => {
  sendEmail({
    to: lawyer.email,
    subject: 'Welcome to Docket',
    html: welcomeTemplate(lawyer),
    type: 'welcome',
  }).catch((err) => console.error('[Email] Welcome email failed:', err.message));
};

/**
 * Hearing confirmation — called from hearingController.createHearing (fire-and-forget).
 * @param {object} hearing
 * @param {{ full_name: string, email: string }} lawyer
 * @param {{ id: string, title: string }} caseItem
 */
export const sendHearingConfirmationEmail = (hearing, lawyer, caseItem) => {
  sendEmail({
    to: lawyer.email,
    subject: `Hearing Scheduled — ${caseItem.id}`,
    html: hearingConfirmationTemplate(hearing, lawyer, caseItem),
    type: 'hearing_confirmation',
  }).catch((err) => console.error('[Email] Hearing confirmation failed:', err.message));
};

/**
 * Hearing alert — called from cronService (fire-and-forget).
 * @param {object} hearing
 * @param {string} toEmail
 * @param {string} toName
 * @param {number} daysAway
 * @param {string} caseTitle
 * @param {string} caseId
 */
export const sendHearingAlertEmail = (hearing, toEmail, toName, daysAway, caseTitle, caseId) => {
  const urgencyLabel = daysAway <= 1 ? 'URGENT — ' : 'Reminder — ';
  const subject = `${urgencyLabel}Hearing in ${daysAway} day${daysAway !== 1 ? 's' : ''} — ${caseId}`;
  sendEmail({
    to: toEmail,
    subject,
    html: hearingAlertTemplate(hearing, toName, daysAway, caseTitle, caseId),
    type: 'hearing_alert',
  }).catch((err) => console.error(`[Email] Alert to ${toEmail} failed:`, err.message));
};
