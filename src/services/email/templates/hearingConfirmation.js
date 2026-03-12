import { emailLayout } from './layout.js';

/**
 * @param {object} hearing  - Hearing instance
 * @param {object} lawyer   - Assigned lawyer { full_name, email }
 * @param {object} caseItem - Case { id, title }
 */
export const hearingConfirmationTemplate = (hearing, lawyer, caseItem) => {
  const content = `
    <!-- Icon + heading -->
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;background-color:#dcfce7;border-radius:50%;width:56px;height:56px;line-height:56px;font-size:24px;text-align:center;">📅</div>
      <h1 style="margin:16px 0 6px;font-size:22px;font-weight:700;color:#0f2044;">Hearing Scheduled</h1>
      <p style="margin:0;font-size:14px;color:#64748b;">A new hearing has been added to your calendar.</p>
    </div>

    <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 28px;" />

    <!-- Case reference badge -->
    <p style="margin:0 0 16px;font-size:13px;color:#64748b;">
      Case: <span style="display:inline-block;background-color:#eff6ff;color:#1d4ed8;font-size:12px;font-weight:700;padding:2px 10px;border-radius:999px;letter-spacing:0.5px;">${caseItem.id}</span>
    </p>
    <p style="margin:0 0 24px;font-size:18px;font-weight:700;color:#1e293b;line-height:1.3;">${caseItem.title}</p>

    <!-- Hearing details grid -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;margin-bottom:28px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 16px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Hearing Details</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:7px 0;font-size:13px;color:#64748b;width:100px;vertical-align:top;">📆 Date</td>
              <td style="padding:7px 0;font-size:14px;font-weight:600;color:#1e293b;">${hearing.hearing_date}</td>
            </tr>
            <tr>
              <td style="padding:7px 0;font-size:13px;color:#64748b;vertical-align:top;">🕐 Time</td>
              <td style="padding:7px 0;font-size:14px;font-weight:600;color:#1e293b;">${hearing.hearing_time || 'To be confirmed'}</td>
            </tr>
            <tr>
              <td style="padding:7px 0;font-size:13px;color:#64748b;vertical-align:top;">🏛️ Court</td>
              <td style="padding:7px 0;font-size:14px;font-weight:600;color:#1e293b;">${hearing.court_name || 'To be confirmed'}</td>
            </tr>
            ${hearing.notes ? `
            <tr>
              <td style="padding:7px 0;font-size:13px;color:#64748b;vertical-align:top;">📝 Notes</td>
              <td style="padding:7px 0;font-size:13px;color:#475569;line-height:1.5;">${hearing.notes}</td>
            </tr>` : ''}
          </table>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:14px;color:#475569;line-height:1.6;">
      Hi <strong>${lawyer.full_name}</strong>, please ensure you are prepared and that all relevant documents are ready before the hearing date.
    </p>
  `;

  return emailLayout(
    content,
    `Hearing scheduled for ${caseItem.id} on ${hearing.hearing_date}`
  );
};
