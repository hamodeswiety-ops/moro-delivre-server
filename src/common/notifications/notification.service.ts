import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Twilio } from 'twilio';
import { I18nService } from '../i18n/i18n.service';

@Injectable()
export class NotificationService {
  private logger = new Logger(NotificationService.name);
  private emailTransporter: nodemailer.Transporter;
  private twilioClient: Twilio;

  constructor(private i18nService: I18nService) {
    this.initializeEmail();
    this.initializeTwilio();
  }

  private initializeEmail() {
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASSWORD || 'your-app-password',
      },
    });
  }

  private initializeTwilio() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (accountSid && authToken) {
      this.twilioClient = new Twilio(accountSid, authToken);
    }
  }

  async sendEmail(
    to: string,
    subject: string,
    htmlContent: string,
    textContent?: string,
  ): Promise<boolean> {
    try {
      await this.emailTransporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@moro.local',
        to,
        subject,
        html: htmlContent,
        text: textContent || htmlContent,
      });

      this.logger.log(`Email sent to ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      return false;
    }
  }

  async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
    if (!this.twilioClient) {
      this.logger.warn('Twilio not configured');
      return false;
    }

    try {
      await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });

      this.logger.log(`SMS sent to ${phoneNumber}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${phoneNumber}:`, error);
      return false;
    }
  }

  async notifyOrderConfirmed(
    email: string,
    phone: string,
    orderNumber: string,
    language: string = 'en',
  ): Promise<void> {
    const subject = this.i18nService.t(
      'notifications.orderConfirmed',
      language,
    );
    const htmlContent = `
      <h2>${subject}</h2>
      <p>Order Number: ${orderNumber}</p>
      <p>Thank you for your order!</p>
    `;

    await this.sendEmail(email, subject, htmlContent);

    if (phone) {
      const smsMessage = `${subject} - Order #${orderNumber}`;
      await this.sendSMS(phone, smsMessage);
    }
  }

  async notifyOrderShipped(
    email: string,
    phone: string,
    orderNumber: string,
    trackingNumber: string,
    language: string = 'en',
  ): Promise<void> {
    const subject = this.i18nService.t('notifications.orderShipped', language);
    const htmlContent = `
      <h2>${subject}</h2>
      <p>Order Number: ${orderNumber}</p>
      <p>Tracking Number: ${trackingNumber}</p>
    `;

    await this.sendEmail(email, subject, htmlContent);

    if (phone) {
      const smsMessage = `${subject} - Tracking: ${trackingNumber}`;
      await this.sendSMS(phone, smsMessage);
    }
  }

  async notifyOrderDelivered(
    email: string,
    phone: string,
    orderNumber: string,
    language: string = 'en',
  ): Promise<void> {
    const subject = this.i18nService.t(
      'notifications.orderDelivered',
      language,
    );
    const htmlContent = `
      <h2>${subject}</h2>
      <p>Order Number: ${orderNumber}</p>
      <p>Your order has been successfully delivered. Thank you!</p>
    `;

    await this.sendEmail(email, subject, htmlContent);

    if (phone) {
      const smsMessage = `${subject} - Order #${orderNumber}`;
      await this.sendSMS(phone, smsMessage);
    }
  }

  async notifyNewOrder(
    storeOwnerEmail: string,
    orderNumber: string,
    totalPrice: number,
    language: string = 'en',
  ): Promise<void> {
    const subject = this.i18nService.t('notifications.newOrder', language);
    const htmlContent = `
      <h2>${subject}</h2>
      <p>Order Number: ${orderNumber}</p>
      <p>Total Price: ${totalPrice}</p>
      <p>Please log in to your dashboard to manage this order.</p>
    `;

    await this.sendEmail(storeOwnerEmail, subject, htmlContent);
  }
}
