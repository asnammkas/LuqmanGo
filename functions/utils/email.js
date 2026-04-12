import nodemailer from 'nodemailer';
import { logger } from 'firebase-functions/v2';
import { defineSecret } from 'firebase-functions/params';

// Define secrets for production
const SMTP_PASS = defineSecret('SMTP_PASS');

/**
 * Simple helper to escape HTML entities to prevent XSS in email templates.
 */
function sanitizeHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}


/**
 * Sends an email using Nodemailer with SMTP.
 * Credentials should ideally be stored in Firebase Environment Secrets.
 */
export async function sendEmail({ to, subject, text, html }) {
  // ─── SMTP CONFIGURATION ───
  // Note: For production, use defineSecret('SMTP_PASSWORD') and defineString('SMTP_USER')
  const smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || 'placeholder@example.com',
      pass: process.env.SMTP_PASS || SMTP_PASS.value(),
    },
  };

  const transporter = nodemailer.createTransport(smtpConfig);

  try {
    const info = await transporter.sendMail({
      from: `"LuqmanGo Notifications" <${smtpConfig.auth.user}>`,
      to,
      subject,
      text,
      html,
    });

    logger.info('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    logger.error('Error sending email:', error);
    // We don't throw here to avoid failing the trigger, but we log the error
    return null;
  }
}

export const emailTemplates = {
  newOrder: (orderId, total, customer) => ({
    subject: `📦 New Order Received - ${orderId}`,
    text: `A new order has been placed. Order ID: ${orderId}. Total: LKR ${total}. Customer: ${customer.name}.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #113013; border-radius: 12px;">
        <h2 style="color: #113013;">New Order Received!</h2>
        <p>A new order has been placed on <strong>LuqmanGo</strong>.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Total Amount:</strong> LKR ${total.toLocaleString()}</p>
        <p><strong>Customer:</strong> ${sanitizeHtml(customer.name)} (${sanitizeHtml(customer.phone)})</p>
        <p><strong>Shipping Address:</strong> ${sanitizeHtml(customer.address)}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 0.9rem; color: #706F65;">Please check the admin panel or WhatsApp for full details.</p>
      </div>
    `,
  }),
  welcome: (name) => ({
    subject: `👋 Welcome to LuqmanGo!`,
    text: `Hi ${name}, welcome to the LuqmanGo community.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
        <h1 style="color: #113013;">Welcome, ${sanitizeHtml(name)}!</h1>
        <p style="font-size: 1.1rem; color: #4A4A4A;">Thank you for joining the LuqmanGo community. We are excited to have you with us!</p>
        <div style="margin: 30px 0;">
          <a href="https://luqmango.com" style="background-color: #113013; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Browse Our Collection</a>
        </div>
        <p style="color: #706F65; font-size: 0.85rem;">If you have any questions, feel free to reply to this email.</p>
      </div>
    `,
  }),
};
