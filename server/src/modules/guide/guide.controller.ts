import { Request, Response, NextFunction } from 'express';
import { createGuideProfile, updateGuideStatus, listGuides, updateGuideAvailability } from './guide.service.js';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware.js';

export const applyGuideHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const guide = await createGuideProfile({ ...req.body, user: req.user.id });
    res.status(201).json(guide);
  } catch (error) {
    next(error);
  }
};

export const listGuideHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const guides = await listGuides();
    res.json(guides);
  } catch (error) {
    next(error);
  }
};

export const updateGuideStatusHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const guide = await updateGuideStatus(req.params.id, req.body.status);
    res.json(guide);
  } catch (error) {
    next(error);
  }
};

export const updateGuideAvailabilityHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const guide = await updateGuideAvailability(req.params.id, req.body);
    res.json(guide);
  } catch (error) {
    next(error);
  }
};
