import mongoose, { Schema, Document } from 'mongoose';

export interface IRoute extends Document {
  from: string;
  to: string;
  distance: number; // km
  options: Array<{
    mode: string;
    time: string; // e.g., "4 hours"
    durationMinutes: number;
    cost: number; // estimated cost in INR
    co2: number; // kg CO2
    greenScore: number; // 1-10
    rewards: number;
    description: string;
  }>;
  summary?: {
    distanceKm: number;
    durationMinutes: number;
    source: 'api' | 'cached' | 'calculated';
    emissions: {
      baseline: number;
      best: number;
      savings: number;
      savingsPercentage: number;
    };
    bestMode: {
      mode: string;
      time: string;
      durationMinutes: number;
      distance: number;
      cost: number;
      co2: number;
      greenScore: number;
      rewards: number;
      description: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const RouteSchema = new Schema<IRoute>(
  {
    from: { type: String, required: true, index: true },
    to: { type: String, required: true, index: true },
    distance: { type: Number, required: true },
    options: [
      {
        mode: { type: String, required: true },
        time: { type: String, required: true },
        durationMinutes: { type: Number, required: true },
        cost: { type: Number, required: true },
        co2: { type: Number, required: true },
        greenScore: { type: Number, required: true, min: 1, max: 10 },
        rewards: { type: Number, required: true },
        description: { type: String },
      },
    ],
    summary: {
      distanceKm: { type: Number },
      durationMinutes: { type: Number },
      source: { type: String, enum: ['api', 'cached', 'calculated'] },
      emissions: {
        baseline: { type: Number },
        best: { type: Number },
        savings: { type: Number },
        savingsPercentage: { type: Number },
      },
      bestMode: {
        mode: { type: String },
        time: { type: String },
        durationMinutes: { type: Number },
        distance: { type: Number },
        cost: { type: Number },
        co2: { type: Number },
        greenScore: { type: Number },
        rewards: { type: Number },
        description: { type: String },
      },
    },
  },
  { timestamps: true }
);

// Index for faster queries
RouteSchema.index({ from: 1, to: 1 });

export const Route = mongoose.model<IRoute>('Route', RouteSchema);
