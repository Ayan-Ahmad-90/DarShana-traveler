import { Response } from 'express';
import { BookingService } from '../services/bookingService.js';
import { bookingSchema } from '../utils/validators.js';
import { AuthRequest } from '../middleware/auth.js';

export class BookingController {
  static async createBooking(req: AuthRequest, res: Response) {
    try {
      const { error, value } = bookingSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const booking = await BookingService.createBooking(req.userId!, value);
      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        booking,
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getBooking(req: AuthRequest, res: Response) {
    try {
      const booking = await BookingService.getBookingById(req.params.bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.status(200).json(booking);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getUserBookings(req: AuthRequest, res: Response) {
    try {
      const bookings = await BookingService.getUserBookings(req.userId!);
      res.status(200).json({
        count: bookings.length,
        data: bookings,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async cancelBooking(req: AuthRequest, res: Response) {
    try {
      const { reason } = req.body;
      const booking = await BookingService.cancelBooking(req.params.bookingId, reason);
      res.status(200).json({
        message: 'Booking cancelled successfully',
        booking,
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getStats(req: AuthRequest, res: Response) {
    try {
      const stats = await BookingService.getBookingStats(req.userId!);
      res.status(200).json(stats);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}
