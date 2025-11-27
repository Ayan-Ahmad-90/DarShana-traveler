import Train from '../models/Train.js';
import { generateMockTrains } from '../utils/helpers.js';

export class TrainService {
  static async searchTrains(params: {
    from: string;
    to: string;
    date: Date;
    passengers?: number;
    class?: string;
  }) {
    try {
      // Using mock Indian rail data for now
      const trains = generateMockTrains(params.from, params.to, params.date);
      return trains;
    } catch (error) {
      return generateMockTrains(params.from, params.to, params.date);
    }
  }

  static async getTrainById(trainId: string) {
    const train = await Train.findById(trainId);
    return train;
  }

  static async saveTrain(trainData: any) {
    const train = new Train(trainData);
    await train.save();
    return train;
  }

  static async getSchedule(source: string, destination: string) {
    const trains = await Train.find({ source, destination });
    return trains;
  }
}
