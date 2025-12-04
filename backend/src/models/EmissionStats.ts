import mongoose, { Schema, Document } from 'mongoose';

export interface IEmissionStats extends Document {
  userId?: string;
  totalEmissions: number;
  totalDistance: number;
  journeyCount: number;
  averageEmissionsPerKm: number;
  bestMode: string;
  lastUpdated: Date;
}

const EmissionStatsSchema = new Schema<IEmissionStats>(
  {
    userId: { type: String, index: true },
    totalEmissions: { type: Number, default: 0 },
    totalDistance: { type: Number, default: 0 },
    journeyCount: { type: Number, default: 0 },
    averageEmissionsPerKm: { type: Number, default: 0 },
    bestMode: { type: String, default: 'unknown' },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const EmissionStats = mongoose.model<IEmissionStats>('EmissionStats', EmissionStatsSchema);
