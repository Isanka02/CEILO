import nodemailer from 'nodemailer';

/**
 * Send an email using nodemailer.
 * Required env vars:
 *   EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM
 *
 * For Gmail: EMAIL_HOST=smtp.gmail.com, EMAIL_PORT=587
 * For Mailtrap (dev): EMAIL_HOST=sandbox.smtp.mailtrap.io, EMAIL_PORT=2525
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = nodemailer.createTransport({
    host:   process.env.EMAIL_HOST,
    port:   Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for others
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from:    process.env.EMAIL_FROM || `"CEILO" <no-reply@ceilo.com>`,
    to,
    subject,
    text:    text || '',
    html:    html || '',
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`✉️  Email sent to ${to} — MessageId: ${info.messageId}`);
  return info;
};

export default sendEmail;