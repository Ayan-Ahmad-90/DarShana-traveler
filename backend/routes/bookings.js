const express = require('express');
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { bookingLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public routes
router.get('/shared/:slug', bookingController.getSharedTrip);

// All booking routes require authentication
// router.use(auth); // Temporarily disabled for testing public booking flow if needed, but user said "email bhi ok sa fill kr ke" which implies guest booking might be needed. 
// However, the user said "My trip option hai usmein uski trip add ho jaye", which implies a user account.
// I will keep auth but make sure the frontend handles it. Wait, the user said "booking page open ho signin or sign up nhi".
// This means the booking creation might happen as a guest, OR we create a shadow user?
// For now, let's assume the user is logged in OR we allow guest bookings.
// If I remove `router.use(auth)`, I need to handle `req.userId` manually in controller.
// Let's keep it simple: If token exists, use it. If not, maybe create a temp user?
// Actually, the previous request was to allow access to /booking without login.
// So the backend MUST allow unauthenticated requests for creation.

// Create booking (Public allowed)
router.post('/', bookingLimiter, bookingController.createBooking);

// Upload documents (Public allowed if we pass bookingId)
router.post('/:bookingId/documents', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'idCard', maxCount: 1 },
  { name: 'paymentProof', maxCount: 1 }
]), bookingController.uploadDocuments);

// Authenticated routes
router.use(auth);

// Get user bookings
router.get('/', bookingController.getUserBookings);

// Process payment
router.post('/:bookingId/payment', bookingController.processPayment);

// Share trip
router.post('/:bookingId/share', bookingController.shareTrip);

// Cancel booking
router.delete('/:bookingId', bookingController.cancelBooking);

module.exports = router;
