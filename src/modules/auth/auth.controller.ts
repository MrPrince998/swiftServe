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
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtGuard } from 'src/strategy/auth/jwt.guard';
import { UserService } from 'src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

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
    return res.json({
      message: 'Register successful',
      redirectTo: '/dashboard',
    });
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginAuthDto, @Res() res: Response) {
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

    return res.json({
      message: 'Login successful',
      redirectTo: '/dashboard',
    });
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
  async forgotPassword(@Body() dto: LoginAuthDto, @Res() res: Response) {
    const { email } = dto;
    await this.authService.forgotPassword(email);
    return res.json({ message: 'Password reset email sent successfully' });
  }

  @HttpCode(200)
  @Post('reset-password')
  async resetPassword(
    @Body() body: { email: string; password: string; token: string },
    @Res() res: Response,
  ) {
    const { email, password, token } = body;
    const result = await this.authService.resetPassword(email, password, token);
    return res.json(result);
  }

  @HttpCode(200)
  @Get('check-auth')
  async checkAuth(@Req() req: Request, @Res() res: Response) {
    try {
      const accessToken = req.cookies?.accessToken;
      if (!accessToken) {
        return res.json({ authenticated: false });
      }

      // Verify the token
      const payload = this.jwtService.verify(accessToken);
      const user = await this.userService.findOne(payload.sub);

      if (user) {
        return res.json({
          authenticated: true,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
          },
        });
      }

      return res.json({ authenticated: false });
    } catch (error) {
      return res.json({ authenticated: false });
    }
  }
}
