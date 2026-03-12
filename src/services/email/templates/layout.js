/**
 * Base HTML email layout — wraps all email templates with Docket branding.
 * @param {string} content  - Inner HTML content (from individual templates)
 * @param {string} preheader - Short preview text shown in inbox before opening
 */
export const emailLayout = (content, preheader = '') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Docket</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <!-- Preheader (invisible preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</div>

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background-color:#0f2044;border-radius:8px 8px 0 0;padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:28px;font-weight:800;letter-spacing:6px;color:#ffffff;text-transform:uppercase;">DOCKET</p>
              <p style="margin:6px 0 0;font-size:12px;color:#94a8c7;letter-spacing:2px;text-transform:uppercase;">Legal Case Management</p>
            </td>
          </tr>

          <!-- Body card -->
          <tr>
            <td style="background-color:#ffffff;padding:40px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
                This is an automated message from <strong style="color:#64748b;">Docket Legal Management</strong>.<br>
                Please do not reply to this email.
              </p>
              <p style="margin:12px 0 0;font-size:11px;color:#cbd5e1;">&copy; ${new Date().getFullYear()} Docket. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
