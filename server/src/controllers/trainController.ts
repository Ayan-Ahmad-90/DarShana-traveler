import { Request, Response } from 'express';
import { TrainService } from '../services/trainService.js';
import { trainSearchSchema } from '../utils/validators.js';

export class TrainController {
  static async searchTrains(req: Request, res: Response) {
    try {
      const { error, value } = trainSearchSchema.validate({
        ...req.query,
        date: new Date(req.query.date as string),
      });

      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const trains = await TrainService.searchTrains(value);
      res.status(200).json({
        success: true,
        count: trains.length,
        data: trains,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getTrainDetails(req: Request, res: Response) {
    try {
      const train = await TrainService.getTrainById(req.params.id);
      if (!train) {
        return res.status(404).json({ message: 'Train not found' });
      }
      res.status(200).json(train);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getSchedule(req: Request, res: Response) {
    try {
      const { from, to } = req.query;
      const schedule = await TrainService.getSchedule(from as string, to as string);
      res.status(200).json(schedule);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}
