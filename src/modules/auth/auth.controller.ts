import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  UseGuards,
  Req,
  Get,
  Param,
  UseFilters,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import {
  AuthResponseDto,
  CheckAuthResponseDto,
  LogoutResponseDto,
  EmailVerificationResponseDto,
  VerifyEmailResponseDto,
} from './dto/auth-response.dto';
import { JwtGuard } from 'src/strategy/auth/jwt.guard';
import { OptionalJwtGuard } from './guards/optional-jwt.guard';
import { CookieService } from './services/cookie.service';
import { AuthExceptionFilter } from './filters/auth-exception.filter';

@ApiTags('Authentication')
@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or user already exists',
  })
  async register(
    @Body() dto: CreateAuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const { accessToken, refreshToken } = await this.authService.register(dto);

    this.cookieService.setAuthTokens(res, accessToken, refreshToken);

    return {
      message: 'Registration successful',
      redirectTo: '/dashboard',
    };
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const { accessToken, refreshToken } = await this.authService.login(dto);

    this.cookieService.setAuthTokens(res, accessToken, refreshToken);

    return {
      message: 'Login successful',
      redirectTo: '/dashboard',
    };
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully',
    type: LogoutResponseDto,
  })
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<LogoutResponseDto> {
    this.cookieService.clearAuthTokens(res);

    return {
      message: 'Logout successful',
    };
  }

  @Post('forgot-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.forgotPassword(dto.email);

    return {
      message:
        'If a user with this email exists, a password reset link has been sent',
    };
  }

  @Post('reset-password/:token')
  @HttpCode(200)
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiParam({
    name: 'token',
    description: 'Password reset token',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired token',
  })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Param('token') token: string,
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(dto.email, dto.password, token);

    return {
      message: 'Password reset successfully',
    };
  }

  @Get('check-auth')
  @UseGuards(OptionalJwtGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Check authentication status' })
  @ApiResponse({
    status: 200,
    description: 'Authentication status',
    type: CheckAuthResponseDto,
  })
  async checkAuth(@Req() req: Request): Promise<CheckAuthResponseDto> {
    const user = req['user'];

    if (!user) {
      return { authenticated: false };
    }

    const userDetails = await this.authService.getUserById(user.sub);

    if (!userDetails) {
      return { authenticated: false };
    }

    return {
      authenticated: true,
      user: {
        id: userDetails.id,
        email: userDetails.email,
        fullName: userDetails.fullName,
        role: userDetails.role,
      },
    };
  }

  @Post('send-email-verification')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Send email verification OTP',
    description:
      "Sends a 6-digit OTP to the authenticated user's email for verification",
  })
  @ApiResponse({
    status: 200,
    description: 'Email verification OTP sent successfully',
    type: EmailVerificationResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Valid JWT token required',
  })
  @ApiResponse({
    status: 400,
    description: 'Email already verified or invalid request',
  })
  async sendEmailVerification(
    @Req() req: Request,
  ): Promise<EmailVerificationResponseDto> {
    const user = req['user'];
    await this.authService.sendEmailVerificationOTP(user.email);

    return {
      message:
        'If your email is not verified, a verification OTP has been sent to your email address',
    };
  }

  @Post('verify-email')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Verify email using OTP',
    description:
      'Verifies user email address using the 6-digit OTP sent to their email',
  })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
    type: VerifyEmailResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired OTP, or validation errors',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async verifyEmail(
    @Body() dto: VerifyEmailDto,
  ): Promise<VerifyEmailResponseDto> {
    await this.authService.verifyEmail(dto.email, dto.otp);

    return {
      message: 'Email verified successfully',
    };
  }
}
