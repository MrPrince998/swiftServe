import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  path: string;
  maxAge: number;
}

@Injectable()
export class CookieService {
  private readonly ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 minutes
  private readonly REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

  constructor(private readonly configService: ConfigService) {}

  private getSecureCookieOptions(maxAge: number): CookieOptions {
    return {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge,
    };
  }

  setAuthTokens(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    res.cookie(
      'accessToken',
      accessToken,
      this.getSecureCookieOptions(this.ACCESS_TOKEN_MAX_AGE),
    );

    res.cookie(
      'refreshToken',
      refreshToken,
      this.getSecureCookieOptions(this.REFRESH_TOKEN_MAX_AGE),
    );
  }

  clearAuthTokens(res: Response): void {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
  }
}
