import * as nodemailer from 'nodemailer';
import {
  otpTemplate,
  passwordResetTemplate,
  welcomeTemplate,
} from './templates/email.templates';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  private async sendEmail(to: string, subject: string, html: string) {
    return this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_FROM'),
      to,
      subject,
      html,
    });
  }

  async sendOTP(email: string, name: string, otp: string) {
    const html = otpTemplate(name, otp);
    return this.sendEmail(email, 'Your OTP code', html);
  }

  async sendWelcome(email: string, name: string) {
    const html = welcomeTemplate(name);
    return this.sendEmail(email, 'Welcome to SwiftServe', html);
  }

  async sendPasswordReset(email: string, name: string, resetLink: string) {
    const html = passwordResetTemplate(name, resetLink);
    return this.sendEmail(email, 'Reset Your Password', html);
  }

  async passwordResetSuccessfull(email: string, name: string) {
    const html = `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Hello ${name},</h2>
          <p>Your password has been successfully reset.</p>
          <p>If you did not perform this action, please contact our support immediately.</p>
        </div>
      `;
    return this.sendEmail(email, 'Password Reset Successful', html);
  }

  async emailVerified(email: string, name: string) {
    const html = `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Hello ${name},</h2>
          <p>Your email has been successfully verified.</p>
        </div>
      `;
    return this.sendEmail(email, 'Email Verified', html);
  }
}
