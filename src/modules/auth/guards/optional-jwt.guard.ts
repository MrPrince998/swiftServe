import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class OptionalJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookies(request);

    if (!token) {
      // For optional guard, we allow the request to proceed without a token
      request['user'] = null;
      return true;
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        request['user'] = null;
        return true;
      }

      const payload = await this.jwtService.verifyAsync(token, { secret });
      request['user'] = payload;
    } catch {
      // For optional guard, we don't throw an error, just set user to null
      request['user'] = null;
    }

    return true;
  }

  private extractTokenFromCookies(request: Request): string | undefined {
    return request.cookies?.accessToken;
  }
}
