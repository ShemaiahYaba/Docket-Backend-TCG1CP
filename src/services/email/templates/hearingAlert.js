import { emailLayout } from './layout.js';

const URGENCY_CONFIG = {
  1: {
    icon: '🚨',
    label: 'URGENT — Tomorrow',
    badgeColor: '#fee2e2',
    badgeText: '#dc2626',
    headerAccent: '#dc2626',
    bannerBg: '#fef2f2',
    bannerBorder: '#fecaca',
  },
  3: {
    icon: '⚠️',
    label: '3-Day Reminder',
    badgeColor: '#fef9c3',
    badgeText: '#ca8a04',
    headerAccent: '#d97706',
    bannerBg: '#fffbeb',
    bannerBorder: '#fde68a',
  },
};

/**
 * @param {object} hearing   - Hearing instance
 * @param {string} toName    - Recipient full name
 * @param {number} daysAway  - 1 or 3
 * @param {string} caseTitle - Case title
 * @param {string} caseId    - e.g. SLT-001
 */
export const hearingAlertTemplate = (hearing, toName, daysAway, caseTitle, caseId) => {
  const cfg = URGENCY_CONFIG[daysAway] || URGENCY_CONFIG[3];
  const dayLabel = daysAway === 1 ? 'tomorrow' : `in ${daysAway} days`;

  const content = `
    <!-- Urgency banner -->
    <div style="background-color:${cfg.bannerBg};border:1px solid ${cfg.bannerBorder};border-radius:6px;padding:14px 20px;margin-bottom:28px;text-align:center;">
      <p style="margin:0;font-size:15px;font-weight:700;color:${cfg.headerAccent};">
        ${cfg.icon}&nbsp; Hearing ${dayLabel.toUpperCase()}
      </p>
    </div>

    <!-- Greeting -->
    <p style="margin:0 0 6px;font-size:15px;color:#1e293b;">Hi <strong>${toName}</strong>,</p>
    <p style="margin:0 0 28px;font-size:14px;color:#475569;line-height:1.6;">
      This is a reminder that you have an upcoming court hearing. Please ensure everything is in order.
    </p>

    <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 28px;" />

    <!-- Case reference -->
    <p style="margin:0 0 16px;font-size:13px;color:#64748b;">
      Case: <span style="display:inline-block;background-color:${cfg.badgeColor};color:${cfg.badgeText};font-size:12px;font-weight:700;padding:2px 10px;border-radius:999px;letter-spacing:0.5px;">${caseId}</span>
    </p>
    <p style="margin:0 0 24px;font-size:18px;font-weight:700;color:#1e293b;line-height:1.3;">${caseTitle}</p>

    <!-- Details grid -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;margin-bottom:28px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 16px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Hearing Details</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:7px 0;font-size:13px;color:#64748b;width:100px;vertical-align:top;">📆 Date</td>
              <td style="padding:7px 0;font-size:14px;font-weight:700;color:#1e293b;">${hearing.hearing_date}</td>
            </tr>
            <tr>
              <td style="padding:7px 0;font-size:13px;color:#64748b;vertical-align:top;">🕐 Time</td>
              <td style="padding:7px 0;font-size:14px;font-weight:600;color:#1e293b;">${hearing.hearing_time || 'To be confirmed'}</td>
            </tr>
            <tr>
              <td style="padding:7px 0;font-size:13px;color:#64748b;vertical-align:top;">🏛️ Court</td>
              <td style="padding:7px 0;font-size:14px;font-weight:600;color:#1e293b;">${hearing.court_name || 'To be confirmed'}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Countdown pill -->
    <div style="text-align:center;margin-bottom:8px;">
      <span style="display:inline-block;background-color:${cfg.badgeColor};color:${cfg.badgeText};font-size:13px;font-weight:700;padding:6px 18px;border-radius:999px;">
        ${cfg.icon} ${daysAway === 1 ? 'Hearing is tomorrow' : `${daysAway} days remaining`}
      </span>
    </div>
  `;

  return emailLayout(
    content,
    `Hearing reminder — ${caseId} is ${dayLabel}`
  );
};
