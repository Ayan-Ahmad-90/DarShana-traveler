import Flight from '../models/Flight.js';
import axios from 'axios';
import { generateMockFlights } from '../utils/helpers.js';

export class FlightService {
  static async searchFlights(params: {
    from: string;
    to: string;
    date: Date;
    passengers?: number;
    class?: string;
  }) {
    // Try to fetch from external API (Amadeus mock)
    try {
      // For now, we'll use mock data
      // In production, integrate with Amadeus API
      const flights = generateMockFlights(params.from, params.to, params.date);
      return flights;
    } catch (error) {
      // Fallback to mock data
      return generateMockFlights(params.from, params.to, params.date);
    }
  }

  static async getFlightById(flightId: string) {
    const flight = await Flight.findById(flightId);
    return flight;
  }

  static async saveFlight(flightData: any) {
    const flight = new Flight(flightData);
    await flight.save();
    return flight;
  }

  static async getPopularRoutes() {
    const flights = await Flight.aggregate([
      { $group: { _id: { from: '$origin', to: '$destination' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    return flights;
  }
}
