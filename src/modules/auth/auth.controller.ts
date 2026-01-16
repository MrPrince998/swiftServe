import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthDto } from './dto/auth-dto';
import { JwtGuard } from 'src/strategy/auth/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: CreateAuthDto) {
    return this.authService.register(dto);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(dto);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60 * 1000,
    }); // 15 minutes
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 1 * 24 * 60 * 60 * 1000,
    }); // 1 day

    return res.json({ message: 'Login successful' });
  }

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
    return res.json({ message: 'Logout successful' });
  }

  @HttpCode(200)
  @Post('forgot-password')
  async forgotPassword(@Body() dto: AuthDto, @Res() res: Response) {
    const { email } = dto;
    await this.authService.forgotPassword(email);
    return res.json({ message: 'Password reset token sent successfully' });
  }
}
