import { Request, Response } from 'express';

// Lightweight placeholder implementations for trip planner endpoints
export const createTripPlan = async (req: Request, res: Response) => {
  const { origin, destination } = req.body || {};
  return res.status(200).json({
    success: true,
    message: 'Trip plan created (placeholder)',
    data: {
      origin: origin || 'Unknown',
      destination: destination || 'Unknown',
      itinerary: [],
      notes: 'This is a placeholder response. Replace with real planner logic.',
    },
  });
};

export const getTripRecommendations = async (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    recommendations: [
      { id: 'rec-1', name: 'Sample City A', score: 0.9 },
      { id: 'rec-2', name: 'Sample City B', score: 0.77 },
    ],
  });
};

export const addToItinerary = async (req: Request, res: Response) => {
  const { tripId } = req.params;
  return res.status(200).json({ success: true, message: `Added to itinerary for ${tripId}` });
};

export const calculateBudget = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, budget: { estimated: 123.45 } });
};

export const getNearbyAttractions = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, attractions: [] });
};

export const getWeatherForecast = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, forecast: {} });
};

export const shareTrip = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: 'Trip shared (placeholder)' });
};

export const exportTrip = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: 'Exported trip (placeholder)' });
};

export default {
  createTripPlan,
  getTripRecommendations,
  addToItinerary,
  calculateBudget,
  getNearbyAttractions,
  getWeatherForecast,
  shareTrip,
  exportTrip,
};
