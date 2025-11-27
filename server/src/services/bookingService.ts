import Booking from '../models/Booking.js';
import { generateBookingId } from '../utils/helpers.js';

export class BookingService {
  static async createBooking(userId: string, bookingData: any) {
    const bookingId = generateBookingId();

    const booking = new Booking({
      ...bookingData,
      userId,
      bookingId,
      bookingStatus: 'confirmed',
      paymentStatus: 'pending',
    });

    await booking.save();
    return booking;
  }

  static async getBookingById(bookingId: string) {
    const booking = await Booking.findOne({ bookingId }).populate('userId', 'name email phone');
    return booking;
  }

  static async getUserBookings(userId: string) {
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    return bookings;
  }

  static async updateBooking(bookingId: string, updateData: any) {
    const booking = await Booking.findOneAndUpdate(
      { bookingId },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    return booking;
  }

  static async cancelBooking(bookingId: string, reason: string) {
    const booking = await Booking.findOneAndUpdate(
      { bookingId },
      { bookingStatus: 'cancelled', notes: reason, updatedAt: new Date() },
      { new: true }
    );
    return booking;
  }

  static async getBookingStats(userId: string) {
    const stats = await Booking.aggregate([
      { $match: { userId: userId as any } },
      {
        $group: {
          _id: '$bookingType',
          count: { $sum: 1 },
          totalSpent: { $sum: '$totalPrice' },
        },
      },
    ]);
    return stats;
  }
}
