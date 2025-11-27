import { Request, Response } from 'express';
import { FlightService } from '../services/flightService.js';
import { flightSearchSchema } from '../utils/validators.js';

export class FlightController {
  static async searchFlights(req: Request, res: Response) {
    try {
      const { error, value } = flightSearchSchema.validate({
        ...req.query,
        date: new Date(req.query.date as string),
      });

      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const flights = await FlightService.searchFlights(value);
      res.status(200).json({
        success: true,
        count: flights.length,
        data: flights,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getFlightDetails(req: Request, res: Response) {
    try {
      const flight = await FlightService.getFlightById(req.params.id);
      if (!flight) {
        return res.status(404).json({ message: 'Flight not found' });
      }
      res.status(200).json(flight);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getPopularRoutes(req: Request, res: Response) {
    try {
      const routes = await FlightService.getPopularRoutes();
      res.status(200).json(routes);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}
