/**
 * NotificationService.js - Subsystem 4: Email Notifications
 * 
 * Subsystem responsible for email dispatching using Nodemailer and Ethereal Email test accounts.
 * Does NOT depend on or import any other subsystem.
 */

const nodemailer = require('nodemailer');

class NotificationService {
  constructor() {
    this.transporter = null;
  }

  /**
   * Initializes or returns the Nodemailer Ethereal test transporter.
   */
  async getTransporter() {
    if (!this.transporter) {
      console.log('[NotificationService] Creating ephemeral Ethereal test email account...');
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log(`[NotificationService] Ethereal transporter initialized with user: ${testAccount.user}`);
    }
    return this.transporter;
  }

  /**
   * Sends a welcome email to the newly registered user and logs the Ethereal preview URL.
   * @param {string} recipientEmail - Target recipient email address.
   * @param {string} userName - Optional user display name or identifier.
   * @returns {Promise<Object>} Result containing messageId, previewUrl, and recipient.
   */
  async sendWelcomeEmail(recipientEmail, userName = 'Valued User') {
    if (!recipientEmail) {
      throw new Error('NotificationService: recipientEmail is required');
    }

    console.log(`[NotificationService] Preparing welcome email for: ${recipientEmail}`);
    const transporter = await this.getTransporter();

    const mailOptions = {
      from: '"CSE3206 Auth Team" <noreply@cse3206-lab3.ruet.ac.bd>',
      to: recipientEmail,
      subject: 'Welcome to Our Platform! 🎉',
      text: `Hello ${userName},\n\nThank you for signing up! Your registration was completed successfully.\n\nBest regards,\nCSE 3206 Lab 3 Team (Group 4)`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4F46E5;">Welcome to Our Platform! 🎉</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>Thank you for signing up! Your account registration completed successfully through the <strong>Façade Pattern</strong> orchestration pipeline.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="font-size: 12px; color: #6b7280;">CSE 3206 Software Engineering Sessional · RUET</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);

    console.log(`[NotificationService] Email sent successfully! Message ID: ${info.messageId}`);
    if (previewUrl) {
      console.log(`[NotificationService] 🔗 Ethereal Preview URL: ${previewUrl}`);
    }

    return {
      messageId: info.messageId,
      previewUrl: previewUrl || 'N/A',
      recipient: recipientEmail
    };
  }
}

module.exports = NotificationService;
