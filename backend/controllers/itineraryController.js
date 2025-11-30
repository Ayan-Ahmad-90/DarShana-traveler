import Itinerary from '../models/Itinerary.js';
import jwt from 'jsonwebtoken';

// Get itineraries for a user
export const getItineraries = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const itineraries = await Itinerary.find({ userId }).sort({ createdAt: -1 });

    res.json(itineraries);
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new itinerary
export const createItinerary = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { startingLocation, destination, dates, preferences, planData } = req.body;

    const itinerary = new Itinerary({
      userId,
      startingLocation,
      destination,
      dates,
      preferences,
      planData,
    });

    await itinerary.save();

    res.status(201).json(itinerary);
  } catch (error) {
    console.error('Error creating itinerary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default { getItineraries, createItinerary };