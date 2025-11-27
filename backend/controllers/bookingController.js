// backend/controllers/bookingController.js
const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const Notification = require('../models/Notification');

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { destination, startDate, endDate, travelers, transport, totalCost } = req.body;

    // Validate dates
    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({ message: 'Invalid dates' });
    }

    // Create trip
    const trip = new Trip({
      userId: req.userId,
      destination,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      travelers,
      transport,
      totalCost,
      status: 'upcoming',
    });

    await trip.save();

    // Create booking
    const bookingReference = `DB-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const booking = new Booking({
      userId: req.userId,
      tripId: trip._id,
      bookingReference,
      paymentStatus: 'pending',
    });

    await booking.save();

    // Link booking to trip
    trip.bookingId = booking._id;
    await trip.save();

    // Create notification
    const notification = new Notification({
      userId: req.userId,
      type: 'booking_update',
      title: 'Booking Created',
      message: `Your booking for ${destination.name} has been created. Reference: ${bookingReference}`,
      relatedId: booking._id,
      read: false,
    });

    await notification.save();

    res.status(201).json({
      id: booking._id,
      bookingReference,
      status: 'pending',
      totalCost,
      message: 'Booking created successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId })
      .populate('tripId')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};

// Process payment
exports.processPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { amount } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: 'completed',
        updatedAt: new Date(),
      },
      { new: true }
    ).populate('tripId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update trip status
    const trip = await Trip.findByIdAndUpdate(
      booking.tripId._id,
      { status: 'upcoming' },
      { new: true }
    );

    // Create success notification
    const notification = new Notification({
      userId: req.userId,
      type: 'booking_update',
      title: 'Payment Successful',
      message: `Payment of ₹${amount} received for booking ${booking.bookingReference}`,
      relatedId: booking._id,
      read: false,
    });

    await notification.save();

    res.json({
      paymentStatus: 'completed',
      bookingReference: booking.bookingReference,
      message: 'Payment processed successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment processing failed', error: error.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update trip status
    await Trip.findByIdAndUpdate(
      booking.tripId,
      { status: 'cancelled' },
      { new: true }
    );

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel booking', error: error.message });
  }
};
