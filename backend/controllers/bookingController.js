import Booking from '../models/Booking.js';
import Trip from '../models/Trip.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import sendEmail from '../services/emailService.js';
import { sendSMS } from '../services/smsService.js';
import { createOrder, verifyPayment } from '../services/paymentService.js';

// Create booking
export const createBooking = async (req, res) => {
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
export const getUserBookings = async (req, res) => {
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
export const processPayment = async (req, res) => {
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
export const cancelBooking = async (req, res) => {
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
export const shareTrip = async (req, res) => {
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
export const getSharedTrip = async (req, res) => {
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

// Upload documents
export const uploadDocuments = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if files were uploaded
    if (req.files) {
      if (req.files.photo) booking.documents.photo = req.files.photo[0].path;
      if (req.files.idCard) booking.documents.idCard = req.files.idCard[0].path;
      if (req.files.paymentProof) booking.documents.paymentProof = req.files.paymentProof[0].path;
    }

    booking.status = 'confirmed'; // Auto-confirm after docs upload for now
    await booking.save();

    // Update Trip status as well
    if (booking.tripId) {
      await Trip.findByIdAndUpdate(booking.tripId, { status: 'confirmed' });
    }

    // Send Notifications
    try {
      // Email Notification
      if (booking.customerEmail) {
        await sendEmail({
          email: booking.customerEmail,
          subject: 'Booking Confirmed - DarShana Travel',
          message: `Dear ${booking.customerName},\n\nYour booking to ${booking.destination} has been confirmed!\n\nBooking Reference: ${booking.bookingReference}\n\nThank you for choosing DarShana Travel.`,
        });
      }

      // SMS Notification
      if (booking.customerPhone) {
        await sendSMS(
          booking.customerPhone,
          `DarShana: Booking Confirmed! Ref: ${booking.bookingReference}. Enjoy your trip to ${booking.destination}.`
        );
      }
    } catch (notifyError) {
      console.error('Notification failed:', notifyError);
    }

    res.json({ message: 'Documents uploaded successfully', booking });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload documents', error: error.message });
  }
};
