import { Router } from 'express';
import { BookingController } from '../controllers/bookingController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/', authMiddleware, BookingController.createBooking);
router.get('/my-bookings', authMiddleware, BookingController.getUserBookings);
router.get('/stats', authMiddleware, BookingController.getStats);
router.get('/:bookingId', authMiddleware, BookingController.getBooking);
router.post('/:bookingId/cancel', authMiddleware, BookingController.cancelBooking);

export default router;
