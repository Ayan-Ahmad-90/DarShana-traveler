import { Request, Response } from 'express';
import Festival from '../models/Festival';
import Sightseeing from '../models/Sightseeing';
import BudgetOption from '../models/BudgetOption';

export class SuggestionController {
  // Get festivals for a specific month and location
  static async getFestivals(req: Request, res: Response) {
    try {
      const { month, location } = req.query;
      
      let query: any = {};
      if (month) query.month = parseInt(month as string);
      if (location) query.location = new RegExp(location as string, 'i');

      const festivals = await Festival.find(query).sort({ popularity: -1 });
      res.status(200).json({
        success: true,
        count: festivals.length,
        festivals
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Get sightseeing by location
  static async getSightseeing(req: Request, res: Response) {
    try {
      const { location, category, minRating } = req.query;
      
      let query: any = {};
      if (location) query.location = new RegExp(location as string, 'i');
      if (category) query.category = category;
      if (minRating) query.rating = { $gte: parseFloat(minRating as string) };

      const sightseeing = await Sightseeing.find(query).sort({ rating: -1 });
      res.status(200).json({
        success: true,
        count: sightseeing.length,
        sightseeing
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Get budget-friendly options
  static async getBudgetOptions(req: Request, res: Response) {
    try {
      const { location, category, maxPrice } = req.query;
      
      let query: any = {};
      if (location) query.location = new RegExp(location as string, 'i');
      if (category) query.category = category;
      if (maxPrice) query['priceRange.max'] = { $lte: parseFloat(maxPrice as string) };

      const budgetOptions = await BudgetOption.find(query).sort({ rating: -1 });
      res.status(200).json({
        success: true,
        count: budgetOptions.length,
        budgetOptions
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Get combined suggestions for trip planning
  static async getCompleteSuggestions(req: Request, res: Response) {
    try {
      const { month, location } = req.query;
      
      const festivals = await Festival.find({
        ...(month && { month: parseInt(month as string) }),
        ...(location && { location: new RegExp(location as string, 'i') })
      }).limit(5);

      const sightseeing = await Sightseeing.find({
        ...(location && { location: new RegExp(location as string, 'i') })
      }).limit(10);

      const budgetOptions = await BudgetOption.find({
        ...(location && { location: new RegExp(location as string, 'i') })
      }).limit(8);

      res.status(200).json({
        success: true,
        suggestions: {
          festivals,
          sightseeing,
          budgetOptions
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
