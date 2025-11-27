// backend/routes/bookings.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// All booking routes require authentication
router.use(auth);

// Create booking
router.post('/', bookingController.createBooking);

// Get user bookings
router.get('/', bookingController.getUserBookings);

// Process payment
router.post('/:bookingId/payment', bookingController.processPayment);

// Cancel booking
router.delete('/:bookingId', bookingController.cancelBooking);

module.exports = router;
