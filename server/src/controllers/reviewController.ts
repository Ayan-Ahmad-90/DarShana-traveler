import { Request, Response } from 'express';
import Review from '../models/Review.js';
import { successResponse } from '../utils/response.js';
import { defaultReviews } from '../utils/mockData.js';

export const listReviews = async (_req: Request, res: Response): Promise<void> => {
  const reviews = await Review.find().populate('user', 'fullName');
  if (reviews.length === 0) {
    return res.json(successResponse(defaultReviews));
  }
  res.json(successResponse(reviews));
};

export const createReview = async (req: Request, res: Response): Promise<void> => {
  const review = await Review.create(req.body);
  res.status(201).json(successResponse(review));
};
