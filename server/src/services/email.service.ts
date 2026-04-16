import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

// Create SMTP transport options with proper typing
const smtpOptions: SMTPTransport.Options = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Force IPv4
//   family: 4,
  // Timeout settings
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
};

// Create transporter with explicit SMTP options
const transporter = nodemailer.createTransport(smtpOptions);

/**
 * Send magic link email
 */
export async function sendMagicLinkEmail(
  email: string,
  token: string
): Promise<void> {
  const magicLink = `${process.env.FRONTEND_URL}/verify?token=${token}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e5e7eb;
          }
          .button {
            display: inline-block;
            background: #991b1b;
            color: white;
            padding: 14px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏥 MedCore AI</h1>
            <p>AI-Powered Medical Diagnosis System</p>
          </div>
          <div class="content">
            <h2>Sign in to your account</h2>
            <p>Click the button below to securely sign in to MedCore AI. This link will expire in 15 minutes.</p>
            
            <center>
              <a href="${magicLink}" class="button">Sign In to MedCore AI</a>
            </center>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="background: #f3f4f6; padding: 10px; border-radius: 4px; word-break: break-all;">
              ${magicLink}
            </p>
            
            <p><strong>Security Notice:</strong> If you didn't request this email, you can safely ignore it.</p>
          </div>
          <div class="footer">
            <p>This is an automated message from MedCore AI</p>
            <p>This link expires in 15 minutes</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = `
    Sign in to MedCore AI
    
    Click this link to sign in: ${magicLink}
    
    This link will expire in 15 minutes.
    
    If you didn't request this email, you can safely ignore it.
  `;

  try {
    await transporter.sendMail({
      from: `"MedCore AI" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Sign in to MedCore AI',
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