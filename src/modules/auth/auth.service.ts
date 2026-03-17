import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { userRole } from 'src/shared/interfaces/user.interface';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { GenerateToken } from 'src/utils/generateToken';
import * as crypto from 'crypto';
import { Queue } from 'bullmq';
import { EMAIL_QUEUE } from 'src/shared/Queue/queue.constants';
import { InjectQueue } from '@nestjs/bull';

interface JwtPayload {
  sub: string;
  email: string;
  role: userRole;
  type?: 'access' | 'refresh';
}
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectQueue(EMAIL_QUEUE)
    private readonly emailQueue: Queue,
  ) {}

  private getJwtExpiresInSeconds(
    key: 'JWT_EXPIRES_IN' | 'JWT_REFRESH_EXPIRES_IN',
    fallbackInSeconds: number,
  ): number {
    const value = this.configService.get<string>(key);

    if (!value) {
      return fallbackInSeconds;
    }

    if (/^\d+$/.test(value)) {
      return Number(value);
    }

    const match = value.match(/^(\d+)([smhd])$/i);
    if (!match) {
      return fallbackInSeconds;
    }

    const amount = Number(match[1]);
    const unit = match[2].toLowerCase();
    const unitToSeconds: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };

    return amount * (unitToSeconds[unit] ?? fallbackInSeconds);
  }

  async register(createAuthDto: CreateAuthDto) {
    const { email, password, fullName, phoneNumber } = createAuthDto;
    const existingUser = await this.userRepo.findOne({ where: { email } });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const isUniuquePhone = await this.userRepo.findOne({
      where: { phoneNumber },
    });

    if (isUniuquePhone) {
      throw new BadRequestException('Phone number already in use');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      role: userRole.ADMIN,
      fullName,
      phoneNumber,
    });
    await this.userRepo.save(user);

    await this.emailQueue.add(
      'sendWelcome',
      {
        email: user.email,
        name: user.fullName,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    );

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;

    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException();

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      // Don't throw error for security - prevent user enumeration
      return;
    }

    const rawToken = GenerateToken();
    const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await this.userRepo.save(user);

    // Queue email sending
    await this.emailQueue.add('resetPassword', {
      email: user.email,
      name: user.fullName,
      resetLink: `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${rawToken}&email=${user.email}`,
    });
  }

  async resetPassword(email: string, password: string, token: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException();
    }

    // compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    if (user.resetPasswordToken !== hashedToken) {
      throw new UnauthorizedException();
    }

    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new UnauthorizedException('Reset token has expired');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userRepo.save(user);

    await this.emailQueue.add('passwordResetSuccessfull', {
      email: user.email,
      name: user.fullName,
    });
  }

  async sendEmailVerificationOTP(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await this.userRepo.save(user);

    await this.emailQueue.add('sendOTP', {
      email: user.email,
      name: user.fullName,
      otp,
    });
  }

  async verifyEmail(email: string, otp: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      throw new UnauthorizedException('OTP has expired');
    }

    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await this.userRepo.save(user);

    await this.emailQueue.add('emailVerified', {
      email: user.email,
      name: user.fullName,
    });
  }

  async generateAccessToken(
    user: Pick<User, 'id' | 'email' | 'role'>,
  ): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'access',
    };

    const secret = this.configService.get<string>('JWT_SECRET');
    const expiresIn = this.getJwtExpiresInSeconds('JWT_EXPIRES_IN', 3600);

    if (!secret) {
      throw new BadRequestException(
        'JWT_SECRET is not defined in configuration',
      );
    }

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }

  async generateRefreshToken(
    user: Pick<User, 'id' | 'email' | 'role'>,
  ): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'refresh',
    };
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const expiresIn = this.getJwtExpiresInSeconds(
      'JWT_REFRESH_EXPIRES_IN',
      86400,
    );

    if (!secret) {
      throw new BadRequestException(
        'JWT_REFRESH_SECRET is not defined in configuration',
      );
    }

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }

  async refreshAccessToken(dto: RefreshTokenDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const { refreshToken } = dto;
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

    if (!refreshSecret) {
      throw new BadRequestException(
        'JWT_REFRESH_SECRET is not defined in configuration',
      );
    }

    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: refreshSecret,
      });
    } catch (e: any) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const accessToken = await this.generateAccessToken(user);
    const newRefreshToken = await this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      return await this.userRepo.findOne({ where: { id: userId } });
    } catch (error) {
      return null;
    }
  }
}
