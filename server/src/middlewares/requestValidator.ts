import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
import { ApiError } from './errorHandler.js';

export const validateBody = (schema: ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const details = error.details.map((detail) => detail.message);
      return next(new ApiError(400, 'Validation failed', details));
    }
    req.body = value;
    next();
  };
};
