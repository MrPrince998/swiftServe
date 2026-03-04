import nodemailer from "nodemailer";
import dotenv from 'dotenv';
import { otpTemplate, passwordResetTemplate, welcomeTemplate } from "./templates/email.templates";


dotenv.config();

class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            }
        })
    }

    private async sendEmail(to: string, subject: string, html: string) {
        return this.transporter.sendEmail({
            from: process.env.EMAIL_FROM,
            to, 
            subject,
            html,
        })
    }

    async sendOTP(email: string, name: string, otp: string) {
        const html = otpTemplate(name, otp);
        return this.sendEmail(email, 'Your OTP code', html)
    }

    async sendWelcome(email: string, name: string) {
        const html = welcomeTemplate(name);
        return this.sendEmail(email, 'Welcome to SwiftServe', html) 
    }

    async sendPasswordReset(email: string, name: string, resetLink:string) {
        const html = passwordResetTemplate(name, resetLink)
        return this.sendEmail(email, 'Reset Your Password', html)
    }
}

export const emailService = new EmailService()