import { Process, Processor } from '@nestjs/bull';
import { EMAIL_QUEUE } from '../Queue/queue.constants';
import { EmailService } from './email.service';
import { Job } from 'bullmq';

@Processor(EMAIL_QUEUE)
export class EmailProcessor {
  constructor(private readonly emailService: EmailService) {}

  @Process('sendWelcome')
  async handleWelcome(job: Job) {
    await this.emailService.sendWelcome(job.data.email, job.data.name);
  }

  @Process('resetPassword')
  async handleResetPassword(job: Job) {
    await this.emailService.sendPasswordReset(
      job.data.email,
      job.data.name,
      job.data.resetLink,
    );
  }

  @Process('passwordResetSuccessfull')
  async handlePasswordResetConfirmation(job: Job) {
    await this.emailService.passwordResetSuccessfull(
      job.data.email,
      job.data.name,
    );
  }

  @Process('sendOTP')
  async handleSendOTP(job: Job) {
    await this.emailService.sendOTP(job.data.email, job.data.name, job.data.otp);
  }

  @Process('verifyEmail')
  async handleVerifyEmail(job: Job) {
    await this.emailService.emailVerified(job.data.email, job.data.name);
  }
}
