import { Request, Response } from 'express';
import Package from '../models/Package.js';
import { successResponse } from '../utils/response.js';
import { mockPackages } from '../utils/mockData.js';
import { ApiError } from '../middlewares/errorHandler.js';

export const listPackages = async (_req: Request, res: Response): Promise<void> => {
  const packages = await Package.find();
  res.json(successResponse(packages.length ? packages : mockPackages));
};

export const getPackageById = async (req: Request, res: Response, next: (err: Error) => void): Promise<void> => {
  const travelPackage = await Package.findById(req.params.id);
  if (!travelPackage) {
    return next(new ApiError(404, 'Package not found'));
  }
  res.json(successResponse(travelPackage));
};

export const createPackage = async (req: Request, res: Response): Promise<void> => {
  const travelPackage = await Package.create(req.body);
  res.status(201).json(successResponse(travelPackage));
};
