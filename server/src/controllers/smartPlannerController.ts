import { Request, Response } from 'express';
import { SmartPlannerService } from '../services/smartPlannerService.js';

export class SmartPlannerController {
  static async getSuggestions(req: Request, res: Response) {
    try {
      const suggestions = await SmartPlannerService.getSuggestions(req.query as any);
      res.status(200).json({
        success: true,
        suggestions,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}
