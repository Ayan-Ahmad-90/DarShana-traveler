import { Request, Response } from 'express';
import Destination from '../models/Destination.js';
import { ApiError } from '../middlewares/errorHandler.js';
import { successResponse } from '../utils/response.js';
import { mockDestinations } from '../utils/mockData.js';

export const getDestinations = async (_req: Request, res: Response): Promise<void> => {
  const destinations = await Destination.find();
  if (destinations.length === 0) {
    return res.json(successResponse(mockDestinations));
  }
  res.json(successResponse(destinations));
};

export const getDestinationById = async (req: Request, res: Response, next: (err: Error) => void): Promise<void> => {
  const destination = await Destination.findById(req.params.id);
  if (!destination) {
    return next(new ApiError(404, 'Destination not found'));
  }
  res.json(successResponse(destination));
};

export const createDestination = async (req: Request, res: Response): Promise<void> => {
  const destination = await Destination.create(req.body);
  res.status(201).json(successResponse(destination));
};

export const updateDestination = async (req: Request, res: Response, next: (err: Error) => void): Promise<void> => {
  const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!destination) {
    return next(new ApiError(404, 'Destination not found'));
  }
  res.json(successResponse(destination));
};
