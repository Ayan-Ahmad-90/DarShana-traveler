import express, { Request, Response } from 'express';
import {
  createTripPlan,
  getTripRecommendations,
  addToItinerary,
  calculateBudget,
  getNearbyAttractions,
  getWeatherForecast,
  shareTrip,
  exportTrip,
} from '../controllers/tripPlannerController.js';

const router = express.Router();

/**
 * Trip Planner Routes
 */

// Trip CRUD
router.post('/', createTripPlan); // Create new trip
router.get('/recommendations', getTripRecommendations); // Get destination recommendations
router.post('/:tripId/itinerary', addToItinerary); // Add activity to itinerary
router.post('/:tripId/budget', calculateBudget); // Calculate budget
router.get('/:tripId/attractions', getNearbyAttractions); // Get nearby attractions
router.get('/:tripId/weather', getWeatherForecast); // Get weather forecast
router.post('/:tripId/share', shareTrip); // Share trip with others
router.get('/:tripId/export', exportTrip); // Export trip

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'trip-planner' });
});

export default router;
