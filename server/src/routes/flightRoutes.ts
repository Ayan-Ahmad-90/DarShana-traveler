import { Router } from 'express';
import { FlightController } from '../controllers/flightController.js';

const router = Router();

router.get('/search', FlightController.searchFlights);
router.get('/popular-routes', FlightController.getPopularRoutes);
router.get('/:id', FlightController.getFlightDetails);

export default router;
