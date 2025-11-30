// backend/controllers/bookingController.js
const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const Notification = require('../models/Notification');
const User = require('../models/User');
const sendEmail = require('../services/emailService');
const { sendSMS } = require('../services/smsService');
const { createOrder, verifyPayment } = require('../services/paymentService');

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

    // Send Email
    const user = await User.findById(req.userId);
    if (user) {
      try {
        await sendEmail({
          email: user.email,
          subject: 'Booking Confirmation',
          message: `Your booking for ${destination.name} has been created. Reference: ${bookingReference}. Total Cost: ₹${totalCost}`,
        });
        
        if (user.phone) {
          await sendSMS(user.phone, `DarShana Travel: Booking confirmed for ${destination.name}. Ref: ${bookingReference}`);
        }
      } catch (err) {
        console.error('Notification error:', err);
      }
    }

    // Create Payment Order
    let paymentOrder = null;
    try {
      paymentOrder = await createOrder(totalCost);
    } catch (err) {
      console.error('Payment order creation failed:', err);
      // Continue without payment order, user can retry payment later
    }

    res.status(201).json({
      id: booking._id,
      bookingReference,
      status: 'pending',
      totalCost,
      paymentOrder,
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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const isValid = verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

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

    // Send success notification
    const user = await User.findById(req.userId);
    if (user) {
      await sendEmail({
        email: user.email,
        subject: 'Payment Successful',
        message: `Payment for booking ${booking.bookingReference} was successful.`,
      });
    }

    res.json({ message: 'Payment verified and booking updated', booking });
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

// Share trip
exports.shareTrip = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId).populate('tripId');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!booking.tripId.shareSlug) {
      booking.tripId.shareSlug = Math.random().toString(36).substr(2, 10);
      await booking.tripId.save();
    }

    res.json({ shareSlug: booking.tripId.shareSlug });
  } catch (error) {
    res.status(500).json({ message: 'Failed to share trip', error: error.message });
  }
};

// Get shared trip
exports.getSharedTrip = async (req, res) => {
  try {
    const { slug } = req.params;
    const trip = await Trip.findOne({ shareSlug: slug });
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Return limited info
    res.json({
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      transport: trip.transport,
      status: trip.status,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch trip', error: error.message });
  }
};
