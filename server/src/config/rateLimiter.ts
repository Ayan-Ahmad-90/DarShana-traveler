import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: Number(process.env.RATE_LIMIT || 100),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: 'Too many requests, please slow down.'
});
