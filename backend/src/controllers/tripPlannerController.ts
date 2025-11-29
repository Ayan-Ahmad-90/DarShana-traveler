import { Request, Response } from 'express';
import logger from '../utils/logger.js';

/**
 * Trip Planner Controller
 * Handles trip planning, itineraries, budgets, and recommendations
 */

// Create a new trip plan
export const createTripPlan = async (req: Request, res: Response) => {
  try {
    const { title, startDate, endDate, destinations, budget, transport, travelers } = req.body;

    // Validate required fields
    if (!title || !startDate || !endDate || !destinations || destinations.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, startDate, endDate, destinations',
      });
    }

    logger.info(`Trip plan created: ${title}`);

    // Mock response - in production, save to MongoDB
    const tripPlan = {
      id: `trip_${Date.now()}`,
      title,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      destinations,
      budget: budget || 0,
      transport: transport || 'mixed',
      travelers: travelers || 1,
      itinerary: [],
      expenses: [],
      createdAt: new Date(),
      status: 'planning',
    };

    res.status(201).json({
      success: true,
      message: 'Trip plan created successfully',
      trip: tripPlan,
    });
  } catch (error) {
    logger.error('Error creating trip plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating trip plan',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get trip recommendations based on dates and budget
export const getTripRecommendations = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, budget, travelers, interests } = req.query;

    logger.info('Fetching trip recommendations');

    // Mock recommendations
    const recommendations = {
      destinations: [
        {
          id: 1,
          name: 'Goa',
          description: 'Beautiful beaches and nightlife',
          rating: 4.5,
          budget: 'budget',
          duration: '3-5 days',
          tags: ['beach', 'adventure', 'nightlife'],
          image: 'https://via.placeholder.com/300x200?text=Goa',
          estimatedCost: 15000,
        },
        {
          id: 2,
          name: 'Kerala Backwaters',
          description: 'Serene backwaters and houseboats',
          rating: 4.8,
          budget: 'budget',
          duration: '4-6 days',
          tags: ['nature', 'adventure', 'relaxation'],
          image: 'https://via.placeholder.com/300x200?text=Kerala',
          estimatedCost: 20000,
        },
        {
          id: 3,
          name: 'Rajasthan',
          description: 'Historic forts and palaces',
          rating: 4.6,
          budget: 'mid-range',
          duration: '5-7 days',
          tags: ['culture', 'history', 'adventure'],
          image: 'https://via.placeholder.com/300x200?text=Rajasthan',
          estimatedCost: 25000,
        },
      ],
      activities: [
        { name: 'Water Sports', tags: ['adventure', 'beach'] },
        { name: 'Hiking', tags: ['adventure', 'nature'] },
        { name: 'Cultural Tours', tags: ['culture', 'history'] },
        { name: 'Food Tours', tags: ['food', 'culture'] },
      ],
    };

    res.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    logger.error('Error fetching recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recommendations',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Add activity/attraction to itinerary
export const addToItinerary = async (req: Request, res: Response) => {
  try {
    const { tripId, day, activity, time, duration, cost } = req.body;

    if (!tripId || !day || !activity) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    logger.info(`Activity added to itinerary: ${activity}`);

    const itineraryItem = {
      id: `itinerary_${Date.now()}`,
      day,
      activity,
      time: time || '09:00',
      duration: duration || 120,
      cost: cost || 0,
      notes: '',
    };

    res.json({
      success: true,
      message: 'Activity added to itinerary',
      item: itineraryItem,
    });
  } catch (error) {
    logger.error('Error adding to itinerary:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to itinerary',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Calculate trip budget and expenses
export const calculateBudget = async (req: Request, res: Response) => {
  try {
    const { tripId, accommodation, food, activities, transport, misc } = req.body;

    logger.info(`Budget calculated for trip: ${tripId}`);

    const total = (accommodation || 0) + (food || 0) + (activities || 0) + (transport || 0) + (misc || 0);

    const budget = {
      accommodation: accommodation || 0,
      food: food || 0,
      activities: activities || 0,
      transport: transport || 0,
      misc: misc || 0,
      total,
      perDay: total / 5,
      savings: 0,
    };

    res.json({
      success: true,
      message: 'Budget calculated',
      budget,
    });
  } catch (error) {
    logger.error('Error calculating budget:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating budget',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get nearby attractions
export const getNearbyAttractions = async (req: Request, res: Response) => {
  try {
    const { location, radius = 10 } = req.query;

    logger.info(`Fetching attractions near: ${location}`);

    // Mock attractions
    const attractions = [
      {
        id: 1,
        name: 'Beach Park',
        type: 'Beach',
        distance: 2,
        rating: 4.5,
        hours: '06:00 - 22:00',
        cost: 'Free',
        image: 'https://via.placeholder.com/200x150?text=Beach',
      },
      {
        id: 2,
        name: 'Local Market',
        type: 'Shopping',
        distance: 3,
        rating: 4.2,
        hours: '09:00 - 21:00',
        cost: 'Free',
        image: 'https://via.placeholder.com/200x150?text=Market',
      },
      {
        id: 3,
        name: 'Museum',
        type: 'Museum',
        distance: 5,
        rating: 4.7,
        hours: '10:00 - 17:00',
        cost: '₹100',
        image: 'https://via.placeholder.com/200x150?text=Museum',
      },
    ];

    res.json({
      success: true,
      attractions,
    });
  } catch (error) {
    logger.error('Error fetching attractions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attractions',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get weather forecast for destination
export const getWeatherForecast = async (req: Request, res: Response) => {
  try {
    const { location, date } = req.query;

    logger.info(`Fetching weather for: ${location}`);

    // Mock weather data
    const weather = {
      location,
      date,
      temperature: 28,
      condition: 'Sunny',
      humidity: 65,
      windSpeed: 12,
      forecast: [
        { day: 'Mon', high: 32, low: 24, condition: 'Sunny' },
        { day: 'Tue', high: 30, low: 22, condition: 'Partly Cloudy' },
        { day: 'Wed', high: 28, low: 20, condition: 'Rainy' },
      ],
    };

    res.json({
      success: true,
      weather,
    });
  } catch (error) {
    logger.error('Error fetching weather:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching weather',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Share trip plan with others
export const shareTrip = async (req: Request, res: Response) => {
  try {
    const { tripId, email, permission = 'view' } = req.body;

    if (!tripId || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    logger.info(`Trip ${tripId} shared with ${email}`);

    res.json({
      success: true,
      message: 'Trip shared successfully',
      shareLink: `https://darshana.travel/trips/${tripId}?shared=true`,
    });
  } catch (error) {
    logger.error('Error sharing trip:', error);
    res.status(500).json({
      success: false,
      message: 'Error sharing trip',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Export trip as PDF/iCal
export const exportTrip = async (req: Request, res: Response) => {
  try {
    const { tripId, format = 'pdf' } = req.query;

    logger.info(`Trip ${tripId} exported as ${format}`);

    res.json({
      success: true,
      message: `Trip exported as ${format}`,
      downloadUrl: `/downloads/trip_${tripId}.${format === 'pdf' ? 'pdf' : 'ics'}`,
    });
  } catch (error) {
    logger.error('Error exporting trip:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting trip',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
