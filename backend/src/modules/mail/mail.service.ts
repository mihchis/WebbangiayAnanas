import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter | null = null;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('MAIL_HOST');
    const port = this.configService.get<number>('MAIL_PORT');
    const user = this.configService.get<string>('MAIL_USER');
    const pass = this.configService.get<string>('MAIL_PASSWORD');

    // Only configure Nodemailer if proper SMTP credentials are provided
    if (host && user && pass && user !== 'mock_user_id') {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for port 465, false for other ports
        auth: { user, pass },
      });
      this.logger.log('SMTP mail transporter initialized successfully');
    } else {
      this.logger.warn('Mail credentials are mock or missing. MailService will run in developer console logging mode.');
    }
  }

  // Send signup email verification link
  async sendEmailVerification(email: string, token: string): Promise<void> {
    const from = this.configService.get<string>('MAIL_FROM', '"Ananas Shoe Store" <noreply@ananas.com>');
    const verifyUrl = `http://localhost:3000/verify-email?token=${token}`;

    const subject = 'Verify Your Ananas Shoe Store Account';
    const text = `Welcome to Ananas! Please verify your email by clicking: ${verifyUrl}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #f15e2c; text-align: center;">Welcome to Ananas!</h2>
        <p>Thank you for registering. Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background-color: #f15e2c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Verify Email Address</a>
        </div>
        <p>If you did not create an account, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888; text-align: center;">Ananas Shoe Store - DiscoverYOU</p>
      </div>
    `;

    if (this.transporter) {
      try {
        await this.transporter.sendMail({ from, to: email, subject, text, html });
        this.logger.log(`Verification email sent successfully to ${email}`);
      } catch (err) {
        this.logger.error(`Failed to send verification email to ${email}`, err.stack);
      }
    } else {
      // Development console logging mode
      console.log('-----------------------------------------');
      console.log(`[DEVELOPMENT MAIL LOG] To: ${email}`);
      console.log(`[DEVELOPMENT MAIL LOG] Subject: ${subject}`);
      console.log(`[DEVELOPMENT MAIL LOG] Link: ${verifyUrl}`);
      console.log('-----------------------------------------');
    }
  }

  // Send password reset secure link
  async sendPasswordReset(email: string, token: string): Promise<void> {
    const from = this.configService.get<string>('MAIL_FROM', '"Ananas Shoe Store" <noreply@ananas.com>');
    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

    const subject = 'Reset Your Ananas Shoe Store Password';
    const text = `You requested a password reset. Please click: ${resetUrl}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #f15e2c; text-align: center;">Reset Password Request</h2>
        <p>You are receiving this email because you requested a password reset for your account.</p>
        <p>Please click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #f15e2c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888; text-align: center;">Ananas Shoe Store - DiscoverYOU</p>
      </div>
    `;

    if (this.transporter) {
      try {
        await this.transporter.sendMail({ from, to: email, subject, text, html });
        this.logger.log(`Password reset email sent successfully to ${email}`);
      } catch (err) {
        this.logger.error(`Failed to send password reset email to ${email}`, err.stack);
      }
    } else {
      // Development console logging mode
      console.log('-----------------------------------------');
      console.log(`[DEVELOPMENT MAIL LOG] To: ${email}`);
      console.log(`[DEVELOPMENT MAIL LOG] Subject: ${subject}`);
      console.log(`[DEVELOPMENT MAIL LOG] Link: ${resetUrl}`);
      console.log('-----------------------------------------');
    }
  }
}
