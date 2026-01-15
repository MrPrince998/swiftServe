import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class InternalAccessMiddleware implements NestMiddleware {
  private limiters: Record<string, RateLimiterMemory> = {};

  constructor() {
    // Per endpoint rate limiter
    this.limiters['/auth'] = new RateLimiterMemory({
      points: 10,
      duration: 60,
      execEvenly: true,
      keyPrefix: 'auth',
    });
    this.limiters['/api'] = new RateLimiterMemory({
      points: 100,
      duration: 60,
      execEvenly: true,
      keyPrefix: 'api',
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Choose limiter based on path
    let limiter: RateLimiterMemory;

    if (req.path.startsWith('/auth')) limiter = this.limiters['/auth'];
    else if (req.path.startsWith('/api')) limiter = this.limiters['/api'];
    else return next(); // no limit for other routes

    limiter
      .consume(req.ip || 'unknown')
      .then(() => next()) // allowed
      .catch(() => res.status(429).json({ message: 'Too many requests.' }));
  }
}
