import express from 'express';
import itineraryController from '../controllers/itineraryController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.get('/', auth, itineraryController.getItineraries);
router.post('/', auth, itineraryController.createItinerary);

export default router;