import { NextFunction, Request, Response } from 'express';
import logger from '../config/logger.js';

export const apiLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP %s %s %d %dms', req.method, req.originalUrl, res.statusCode, duration);
  });
  next();
};
