import { Request, Response, NextFunction } from 'express';
import {
  createBooking,
  listBookings,
  updateBookingStatus,
  assignGuideToBooking
} from './booking.service.js';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware.js';

export const createBookingHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const booking = await createBooking({ ...req.body, user: req.user.id });
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

export const listBookingsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await listBookings(req.query as Record<string, unknown>);
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatusHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await updateBookingStatus(req.params.id, req.body.status, req.body.note);
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

export const assignGuideHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await assignGuideToBooking(req.params.id, req.body.guideId);
    res.json(booking);
  } catch (error) {
    next(error);
  }
};
