import Booking from '../../models/Booking.js';
import Payment from '../../models/Payment.js';
import User from '../../models/User.js';
import Guide from '../../models/Guide.js';

export const getAdminDashboardStats = async () => {
  const [totalUsers, totalGuides, pendingGuides, totalBookings, successfulBookings, totalRevenue, refundedAmount] =
    await Promise.all([
      User.countDocuments(),
      Guide.countDocuments(),
      Guide.countDocuments({ status: 'pending' }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'completed' }),
      Payment.aggregate([
        { $match: { status: { $in: ['paid', 'partially_refunded'] } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Payment.aggregate([
        { $match: { status: 'refunded' } },
        { $group: { _id: null, total: { $sum: '$refundedAmount' } } }
      ])
    ]);

  return {
    users: { total: totalUsers },
    guides: { total: totalGuides, pending: pendingGuides },
    bookings: { total: totalBookings, completed: successfulBookings },
    revenue: {
      total: totalRevenue[0]?.total || 0,
      refunded: refundedAmount[0]?.total || 0
    }
  };
};
