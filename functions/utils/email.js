import nodemailer from 'nodemailer';
import { logger } from 'firebase-functions/v2';
import { defineSecret, defineString } from 'firebase-functions/params';

// Define secrets for production hardening
const SMTP_HOST = defineString('SMTP_HOST', { default: 'smtp-relay.brevo.com' });
const SMTP_PORT = defineString('SMTP_PORT', { default: '587' });
const SMTP_USER = defineSecret('SMTP_USER');
const SMTP_PASS = defineSecret('SMTP_PASS');
const VENDOR_EMAIL = defineString('VENDOR_EMAIL', { default: 'orders@luqmango.com' });

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
 * Credentials MUST be stored in Firebase Environment Secrets for production.
 */
export async function sendEmail({ to, subject, text, html }) {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST.value(),
    port: parseInt(SMTP_PORT.value()),
    secure: SMTP_PORT.value() === '465',
    auth: {
      user: SMTP_USER.value(),
      pass: SMTP_PASS.value(),
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"LuqmanGo Orders" <${VENDOR_EMAIL.value()}>`,
      to,
      subject,
      text,
      html,
    });

    logger.info('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    logger.error('Error sending email. Ensure secrets (SMTP_USER/PASS) are set:', error);
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
