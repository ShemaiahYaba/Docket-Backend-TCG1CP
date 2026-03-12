import nodemailer from 'nodemailer';
import settings from '../config/settings.js';

const transporter = nodemailer.createTransport({
  host: settings.mail.host,
  port: settings.mail.port,
  secure: settings.mail.port === 465,
  auth: {
    user: settings.mail.user,
    pass: settings.mail.pass,
  },
});

/**
 * Core send function. All other functions delegate here.
 * @param {{ to: string, subject: string, html: string }} options
 */
export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({ from: settings.mail.from, to, subject, html });
};

/**
 * Welcome email sent when a new lawyer account is created.
 * @param {{ full_name: string, email: string, role: string }} lawyer
 */
export const sendWelcomeEmail = (lawyer) => {
  const html = `
    <h2>Welcome to Docket, ${lawyer.full_name}!</h2>
    <p>Your account has been created successfully.</p>
    <p><strong>Email:</strong> ${lawyer.email}<br>
    <strong>Role:</strong> ${lawyer.role}</p>
    <p>You can now log in to Docket and start managing cases.</p>
    <p style="color:#888;font-size:12px;">This is an automated message from Docket Legal Management.</p>
  `;
  sendEmail({ to: lawyer.email, subject: 'Welcome to Docket', html }).catch((err) =>
    console.error('[Email] Welcome email failed:', err.message)
  );
};

/**
 * Confirmation email sent when a hearing is scheduled.
 * @param {object} hearing - Hearing instance
 * @param {object} lawyer  - Assigned lawyer on the case
 * @param {object} caseItem - Case the hearing belongs to
 */
export const sendHearingConfirmationEmail = (hearing, lawyer, caseItem) => {
  const html = `
    <h2>Hearing Scheduled — ${caseItem.title}</h2>
    <p>A hearing has been scheduled for case <strong>${caseItem.id}</strong>.</p>
    <p>
      <strong>Date:</strong> ${hearing.hearing_date}<br>
      <strong>Time:</strong> ${hearing.hearing_time || 'TBC'}<br>
      <strong>Court:</strong> ${hearing.court_name || 'TBC'}<br>
      <strong>Notes:</strong> ${hearing.notes || '—'}
    </p>
    <p style="color:#888;font-size:12px;">This is an automated message from Docket Legal Management.</p>
  `;
  sendEmail({ to: lawyer.email, subject: `Hearing Scheduled — ${caseItem.id}`, html }).catch((err) =>
    console.error('[Email] Hearing confirmation failed:', err.message)
  );
};

/**
 * Alert email for upcoming hearings. Used by the cron job.
 * @param {object} hearing   - Hearing instance
 * @param {string} toEmail   - Recipient email address
 * @param {string} toName    - Recipient name
 * @param {number} daysAway  - Number of days until the hearing (1 or 3)
 * @param {string} caseTitle - Title of the case
 * @param {string} caseId    - ID of the case e.g. SLT-001
 */
export const sendHearingAlertEmail = (hearing, toEmail, toName, daysAway, caseTitle, caseId) => {
  const urgencyLabel = daysAway <= 1 ? '🚨 URGENT — ' : '⚠️ Reminder — ';
  const subject = `${urgencyLabel}Hearing in ${daysAway} day${daysAway !== 1 ? 's' : ''} — ${caseId}`;
  const html = `
    <h2>${urgencyLabel}Upcoming Hearing</h2>
    <p>Hi ${toName},</p>
    <p>You have a hearing coming up in <strong>${daysAway} day${daysAway !== 1 ? 's' : ''}</strong>.</p>
    <p>
      <strong>Case:</strong> ${caseId} — ${caseTitle}<br>
      <strong>Date:</strong> ${hearing.hearing_date}<br>
      <strong>Time:</strong> ${hearing.hearing_time || 'TBC'}<br>
      <strong>Court:</strong> ${hearing.court_name || 'TBC'}
    </p>
    <p style="color:#888;font-size:12px;">This is an automated message from Docket Legal Management.</p>
  `;
  sendEmail({ to: toEmail, subject, html }).catch((err) =>
    console.error(`[Email] Alert email to ${toEmail} failed:`, err.message)
  );
};
