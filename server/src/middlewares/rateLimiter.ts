import { NextFunction, Request, Response } from 'express';
import { IRateLimiterOptions, RateLimiterMemory } from 'rate-limiter-flexible';
import { MAX_REQUEST_LIMIT, MAX_REQUEST_WINDOW } from 'src/config/env';
import AppError from 'src/models/AppError';

const options: IRateLimiterOptions = {
  duration: MAX_REQUEST_WINDOW,
  points: MAX_REQUEST_LIMIT,
};

const limiter = new RateLimiterMemory(options);

const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  limiter
    .consume(req.ip!)
    .then((_) => {
      // res.setHeader('Retry-After', rateLimiterRes.msBeforeNext / 1000);
      // res.setHeader('X-RateLimit-Limit', MAX_REQUEST_LIMIT);
      // res.setHeader('X-RateLimit-Remaining', rateLimiterRes.remainingPoints);
      // res.setHeader('X-RateLimit-Reset', new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString());
      next();
    })
    .catch(() => next(new AppError('Too many requests', 429)));
};

export default rateLimiter;
