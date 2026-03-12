import { emailLayout } from './layout.js';

const ROLE_LABELS = {
  senior_partner: 'Senior Partner',
  associate: 'Associate',
  secretary: 'Secretary',
};

/**
 * @param {{ full_name: string, email: string, role: string }} lawyer
 */
export const welcomeTemplate = (lawyer) => {
  const roleLabel = ROLE_LABELS[lawyer.role] || lawyer.role;

  const content = `
    <!-- Greeting -->
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#0f2044;">Welcome aboard, ${lawyer.full_name}!</h1>
    <p style="margin:0 0 28px;font-size:15px;color:#64748b;line-height:1.6;">Your Docket account has been created. You can now log in and start managing cases.</p>

    <!-- Divider -->
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 28px;" />

    <!-- Account details box -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;margin-bottom:28px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Your Account Details</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#64748b;width:80px;">Email</td>
              <td style="padding:6px 0;font-size:13px;font-weight:600;color:#1e293b;">${lawyer.email}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#64748b;">Role</td>
              <td style="padding:6px 0;">
                <span style="display:inline-block;background-color:#dbeafe;color:#1d4ed8;font-size:12px;font-weight:600;padding:2px 10px;border-radius:999px;">${roleLabel}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CTA hint -->
    <p style="margin:0;font-size:14px;color:#475569;line-height:1.6;">
      Log in using your email address and the password provided to you. If you have any questions, contact your firm administrator.
    </p>
  `;

  return emailLayout(content, `Your Docket account is ready — welcome, ${lawyer.full_name}!`);
};
