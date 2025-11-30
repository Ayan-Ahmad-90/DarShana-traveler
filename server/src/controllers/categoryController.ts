import { Request, Response } from 'express';
import { travelCategories } from '../utils/mockData.js';
import { successResponse } from '../utils/response.js';

export const listCategories = (_req: Request, res: Response): void => {
  res.json(successResponse(travelCategories));
};
