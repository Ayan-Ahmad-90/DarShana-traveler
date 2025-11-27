import { Request, Response } from 'express';

export class TransportController {
  static async searchCabs(req: Request, res: Response) {
    try {
      const { from, to, date } = req.query;

      // Mock cab data
      const cabs = [
        {
          id: '1',
          provider: 'uber',
          carType: 'economy',
          pickupLocation: from,
          dropoffLocation: to,
          distance: Math.floor(Math.random() * 50) + 10,
          estimatedDuration: `${Math.floor(Math.random() * 60) + 20} mins`,
          price: Math.floor(Math.random() * 2000) + 500,
          currency: 'INR',
          driverRating: (Math.random() * 2 + 3).toFixed(1),
          availability: true,
        },
        {
          id: '2',
          provider: 'ola',
          carType: 'comfort',
          pickupLocation: from,
          dropoffLocation: to,
          distance: Math.floor(Math.random() * 50) + 10,
          estimatedDuration: `${Math.floor(Math.random() * 60) + 20} mins`,
          price: Math.floor(Math.random() * 3000) + 800,
          currency: 'INR',
          driverRating: (Math.random() * 2 + 3).toFixed(1),
          availability: true,
        },
      ];

      res.status(200).json({
        success: true,
        count: cabs.length,
        data: cabs,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async searchCruises(req: Request, res: Response) {
    try {
      const { from, to, date } = req.query;

      const cruises = [
        {
          id: '1',
          cruiseName: 'Goa Paradise Cruise',
          cruiseLine: 'Royal Caribbean',
          embarkPort: from,
          disembarkPort: to,
          departureDate: date,
          duration: 7,
          price: Math.floor(Math.random() * 200000) + 50000,
          currency: 'INR',
          amenities: ['swimming pool', 'casino', 'dining', 'entertainment'],
        },
      ];

      res.status(200).json({
        success: true,
        count: cruises.length,
        data: cruises,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async searchPrivateJets(req: Request, res: Response) {
    try {
      const { from, to, date } = req.query;

      const jets = [
        {
          id: '1',
          jetName: 'Cessna Citation X',
          operator: 'XYZ Private Aviation',
          aircraft: 'Luxury Jet',
          origin: from,
          destination: to,
          departureTime: date,
          capacity: 8,
          totalPrice: Math.floor(Math.random() * 500000) + 200000,
          currency: 'INR',
          amenities: ['wifi', 'gourmet catering', 'luxury seating'],
        },
      ];

      res.status(200).json({
        success: true,
        count: jets.length,
        data: jets,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async searchBikes(req: Request, res: Response) {
    try {
      const { from, to, startDate, endDate } = req.query;

      const bikes = [
        {
          id: '1',
          bikeName: 'Honda CB 350',
          rentalCompany: 'Bike Rental Co',
          bikeType: 'bike',
          pickupLocation: from,
          dropoffLocation: to,
          pickupDate: startDate,
          dropoffDate: endDate,
          pricePerDay: Math.floor(Math.random() * 1000) + 300,
          totalPrice: Math.floor(Math.random() * 5000) + 1500,
          currency: 'INR',
          condition: 'good',
          helmet: true,
          insurance: false,
          rating: (Math.random() * 2 + 3).toFixed(1),
        },
      ];

      res.status(200).json({
        success: true,
        count: bikes.length,
        data: bikes,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}
