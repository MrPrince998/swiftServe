import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';

function fromCookies(req: Request): string | null {
  const token = req?.cookies['accessToken'];
  return token || null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([fromCookies]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = this;
    return { userId: payload.sub, email: payload.email };
  }
}
