import { Router } from 'express';
import { TripController } from '../controllers/tripController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Trip routes
router.get('/my-trips', authMiddleware, TripController.getMyTrips);
router.post('/book', authMiddleware, TripController.bookTrip);
router.get('/:tripId', authMiddleware, TripController.getTripDetails);
router.put('/:tripId/cancel', authMiddleware, TripController.cancelTrip);

export default router;
