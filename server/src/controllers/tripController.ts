import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Trip from '../models/Trip';

export class TripController {
  static async getMyTrips(req: AuthRequest, res: Response) {
    try {
      const trips = await Trip.find({ userId: req.userId }).sort({ date: -1 });

      const upcomingTrips = trips.filter(trip => new Date(trip.date) > new Date());
      const pastTrips = trips.filter(trip => new Date(trip.date) <= new Date());

      res.status(200).json({
        success: true,
        upcomingTrips,
        pastTrips,
        total: trips.length
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async bookTrip(req: AuthRequest, res: Response) {
    try {
      const { mode, from, to, date, returnDate, price, passengers, specialRequests, paymentMethod } = req.body;

      if (!mode || !from || !to || !date || !price || !passengers) {
        return res.status(400).json({ message: 'Please provide all required fields' });
      }

      const bookingId = `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const totalPrice = price * passengers.length;

      const trip = await Trip.create({
        userId: req.userId,
        mode,
        from,
        to,
        date,
        returnDate,
        price,
        bookingId,
        passengers,
        specialRequests,
        paymentMethod,
        totalPrice,
        status: 'upcoming'
      });

      res.status(201).json({
        success: true,
        message: 'Trip booked successfully',
        booking: {
          bookingId: trip.bookingId,
          status: trip.status,
          totalPrice: trip.totalPrice,
          date: trip.date
        }
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getTripDetails(req: AuthRequest, res: Response) {
    try {
      const { tripId } = req.params;

      const trip = await Trip.findOne({ _id: tripId, userId: req.userId });

      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }

      res.status(200).json({
        success: true,
        trip
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async cancelTrip(req: AuthRequest, res: Response) {
    try {
      const { tripId } = req.params;

      const trip = await Trip.findOneAndUpdate(
        { _id: tripId, userId: req.userId },
        { status: 'cancelled' },
        { new: true }
      );

      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Trip cancelled successfully',
        trip
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
