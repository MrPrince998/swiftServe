import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@modules/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { userRole } from '@interfaces/user.interface';
import { AuthDto } from './dto/auth-dto';
import { ConfigService } from '@nestjs/config';
import {
  RefreshTokenDto,
  RefreshTokenResponseDto,
} from './dto/refresh-token.dto';
import { GenerateToken } from 'src/utils/generateToken';
import crypto from 'crypto';

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
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    const { email, password, role } = createAuthDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      role: role as userRole,
    });
    await this.userRepo.save(user);
    return { message: 'User registered successfully' };
  }

  async login(authDto: AuthDto) {
    const { email, password } = authDto;

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

  async forgotPassword(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException();
    }

    const rawToken = GenerateToken();
    const hasedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.resetPasswordToken = hasedToken;
    user.resetPasswordExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await this.userRepo.save(user);

    // logic to send email

  }

  async resetPassword(email: string, password: string, token: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException();
    }
    
    if(user.resetPasswordToken !== token) {
      throw new UnauthorizedException();
    }

    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new UnauthorizedException();
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userRepo.save(user);
    return { message: 'Password reset successfully' };
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
    const rawExpireIn = this.configService.get<string>('JWT_EXPIRES_IN', '1h');
    const expiresInSeconds = parseInt(rawExpireIn, 10);

    if (!secret) {
      throw new BadRequestException(
        'JWT_SECRET is not defined in configuration',
      );
    }

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn: expiresInSeconds,
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
    const rawExpireIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
      '1d',
    );
    const expiresInSeconds = parseInt(rawExpireIn, 10);
    if (!secret) {
      throw new BadRequestException(
        'JWT_SECRET is not defined in configuration',
      );
    }
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn: expiresInSeconds,
    });
  }

  async refreshAccessToken(
    dto: RefreshTokenDto,
  ): Promise<RefreshTokenResponseDto> {
    const { refreshToken } = dto;
    const refreshSecret = this.configService.get<string>('JWT_SECRET');

    if (!refreshSecret) {
      throw new BadRequestException(
        'JWT_SECRET is not defined in configuration',
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
      tokenType: 'Bearer',
      expiresIn: parseInt(
        this.configService.get<string>('JWT_EXPIRES_IN', '1h'),
        10,
      ),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }
}
