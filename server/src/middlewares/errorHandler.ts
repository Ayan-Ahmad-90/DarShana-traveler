import { NextFunction, Request, Response } from 'express';
import logger from '../config/logger.js';

export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export const errorHandler = (err: Error | ApiError, req: Request, res: Response, _next: NextFunction): void => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const payload = {
    message: err.message || 'Internal server error',
    ...(err instanceof ApiError && err.details ? { details: err.details } : {})
  };

  if (statusCode >= 500) {
    logger.error('Unhandled error', { url: req.originalUrl, stack: err.stack });
  } else {
    logger.warn('Handled error', { url: req.originalUrl, statusCode, message: err.message });
  }

  res.status(statusCode).json(payload);
};
