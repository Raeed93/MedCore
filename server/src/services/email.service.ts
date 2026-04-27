import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const smtpOptions: SMTPTransport.Options = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
};

const transporter = nodemailer.createTransport(smtpOptions);

/**
 * Send magic link email
 */
export async function sendMagicLinkEmail(
  email: string,
  token: string
): Promise<void> {
  const magicLink = `${process.env.FRONTEND_URL}/verify?token=${token}`;

  // ── SVG logo as inline HTML (works in most email clients) ──
  const logoSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" width="36" height="36" style="display:inline-block;vertical-align:middle;">
      <defs>
        <mask id="em-ring">
          <rect width="48" height="48" fill="white"/>
          <rect x="3" y="22" width="8" height="4" fill="black"/>
          <rect x="37" y="22" width="8" height="4" fill="black"/>
        </mask>
      </defs>
      <circle cx="24" cy="24" r="18" stroke="#fae0d8" stroke-width="2.5" fill="none" mask="url(#em-ring)"/>
      <path d="M2 24 L17 24 L20 17 L24 31 L28 19 L31 24 L46 24"
        stroke="#fae0d8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>
  `;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Sign in to Pulse AI</title>
</head>
<body style="margin:0;padding:0;background-color:#f5ebe8;font-family:'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
    style="background-color:#f5ebe8;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
          style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid rgba(127,29,29,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color:#7F1D1D;padding:32px 40px;text-align:center;">
              <!-- Logo -->
              <div style="margin-bottom:12px;">
                ${logoSvg}
              </div>
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#fae0d8;letter-spacing:-0.3px;">
                Pulse AI
              </h1>
              <p style="margin:4px 0 0;font-size:12px;color:rgba(250,224,216,0.6);font-weight:400;letter-spacing:0.04em;">
                CLINICAL INTELLIGENCE PLATFORM
              </p>
            </td>
          </tr>

          <!-- ECG divider -->
          <tr>
            <td style="background-color:#7F1D1D;padding:0 40px 28px;text-align:center;">
              <svg viewBox="0 0 480 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                style="width:100%;max-width:480px;opacity:0.2;">
                <path d="M0 12 L100 12 L120 2 L132 22 L144 4 L156 12 L480 12"
                  stroke="#fae0d8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h2 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:700;color:#2a0a0a;">
                Your sign-in link is ready
              </h2>
              <p style="margin:0 0 20px;font-size:14px;line-height:1.75;color:#6a3a3a;font-weight:300;">
                Click the button below to securely sign in to Pulse AI.
                This link will expire in <strong style="color:#7F1D1D;font-weight:500;">15 minutes</strong>.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:28px 0;">
                <tr>
                  <td align="center">
                    <a href="${magicLink}"
                      style="display:inline-block;background-color:#7F1D1D;color:#fae0d8;text-decoration:none;padding:14px 36px;border-radius:9px;font-size:14px;font-weight:500;letter-spacing:0.02em;font-family:'Helvetica Neue',Arial,sans-serif;">
                      Sign In to Pulse AI →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:0 0 8px;font-size:12px;color:#9a6060;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin:0;background-color:#f5ebe8;border:1px solid rgba(127,29,29,0.12);border-radius:8px;padding:12px 14px;font-size:11px;word-break:break-all;color:#7a4a4a;line-height:1.6;">
                ${magicLink}
              </p>
            </td>
          </tr>

          <!-- Security notice -->
          <tr>
            <td style="padding:0 40px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background-color:rgba(127,29,29,0.04);border:1px solid rgba(127,29,29,0.1);border-radius:10px;padding:16px 18px;">
                    <p style="margin:0;font-size:12px;color:#7a4a4a;line-height:1.65;">
                      <strong style="color:#7F1D1D;">Security notice:</strong>
                      If you didn't request this email, you can safely ignore it.
                      No account changes will be made without clicking the link above.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid rgba(127,29,29,0.08);margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-size:11px;color:#9a6060;">
                This is an automated message from Pulse AI · Link expires in 15 minutes
              </p>
              <p style="margin:0;font-size:11px;color:#b0a0a0;">
                © 2024 Pulse AI. For clinical decision support only.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>
  `;

  const textContent = `
Sign in to Pulse AI
─────────────────────

Click the link below to securely sign in:

${magicLink}

This link expires in 15 minutes.

If you didn't request this email, you can safely ignore it.

─────────────────────
Pulse AI · Clinical Intelligence Platform
© 2024 Pulse AI. For clinical decision support only.
  `.trim();

  try {
    await transporter.sendMail({
      from: `"Pulse AI" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your Pulse AI sign-in link',
      text: textContent,
      html: htmlContent,
    });
    console.log(`✅ Magic link email sent to ${email}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw new Error('Failed to send magic link email');
  }
}

/**
 * Test email configuration
 */
export async function testEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('✅ Email configuration is working!');
    return true;
  } catch (error) {
    console.error('❌ Email configuration failed:', error);
    return false;
  }
}