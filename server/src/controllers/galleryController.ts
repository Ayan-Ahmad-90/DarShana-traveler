import { Request, Response } from 'express';
import { galleryItems } from '../utils/mockData.js';
import { successResponse } from '../utils/response.js';

export const listGallery = (_req: Request, res: Response): void => {
  res.json(successResponse(galleryItems));
};
