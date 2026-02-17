import nodemailer from 'nodemailer';

// ============================================================
//  CENTRALIZED EMAIL SERVICE
// ============================================================

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify SMTP connection on startup (warn, don't crash)
transporter.verify((err) => {
  if (err) console.warn('[EmailService] SMTP connection failed:', err.message);
  else console.log('[EmailService] SMTP ready');
});

/**
 * Send an email via the centralized transporter.
 * Always wrap calls in try/catch — a failed email must never crash the API.
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"CareerConnect" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return info;
  } catch (err) {
    console.error('[EmailService] Send failed:', err.message);
    throw err; // Let caller decide how to handle
  }
};

export default { sendEmail };
