import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthDto } from './dto/auth-dto';
import { JwtGuard } from 'src/strategy/auth/jwt.guard';
import { UserService } from '@modules/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: CreateAuthDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.register(dto);

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
    return res.json({ message: 'Register successful' });
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

  @HttpCode(200)
  @UseGuards(JwtGuard)
  @Get('me')
  getCurrentUser(@Req() req: any) {
    return this.userService.findOne(req.user.userId)
  }
}
