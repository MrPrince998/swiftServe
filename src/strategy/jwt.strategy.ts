import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

function fromCookies(req: Request): string | null {
  const token = req?.cookies['accessToken'];
  return token || null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET is not defined in configuration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([fromCookies]),
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    return {
      sub: payload.sub,
      email: payload.email,
      roles: payload.roles || [],
    };
  }
}
