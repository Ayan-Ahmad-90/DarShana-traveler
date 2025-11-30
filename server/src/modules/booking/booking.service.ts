import { v4 as uuid } from 'uuid';
import Booking from '../../models/Booking.js';
import { calculateFareBreakdown } from '../../utils/fareCalculator.js';
import TaxConfig from '../../models/TaxConfig.js';

export const createBooking = async (payload: Record<string, any>) => {
  const bookingCode = payload.bookingCode || `DS-${uuid().slice(0, 6).toUpperCase()}`;
  const taxConfig = await TaxConfig.findOne({ isActive: true }).sort({ effectiveFrom: -1 });
  const breakdown = calculateFareBreakdown({
    baseFare: payload.amountBreakdown?.baseFare ?? payload.baseFare,
    couponDiscount: payload.amountBreakdown?.discounts,
    walletAmount: payload.amountBreakdown?.walletAmount,
    currency: payload.amountBreakdown?.currency,
    taxConfig
  });
  return Booking.create({
    ...payload,
    bookingCode,
    amountBreakdown: breakdown,
    status: payload.status || 'pending',
    paymentStatus: 'pending',
    timeline: [
      {
        status: 'pending',
        note: 'Booking created',
        timestamp: new Date()
      }
    ]
  });
};

export const listBookings = async (filters: Record<string, unknown> = {}) => {
  return Booking.find(filters).populate(['user', 'guide', 'package']).sort({ createdAt: -1 });
};

export const updateBookingStatus = async (bookingId: string, status: string, note?: string) => {
  return Booking.findByIdAndUpdate(
    bookingId,
    {
      status,
      $push: {
        timeline: { status, note, timestamp: new Date() }
      }
    },
    { new: true }
  );
};

export const assignGuideToBooking = async (bookingId: string, guideId: string) => {
  return Booking.findByIdAndUpdate(
    bookingId,
    {
      guide: guideId,
      $push: {
        timeline: { status: 'guide_assigned', note: `Guide ${guideId}`, timestamp: new Date() }
      }
    },
    { new: true }
  );
};
