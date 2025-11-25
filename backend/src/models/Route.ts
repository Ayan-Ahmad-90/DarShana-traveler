import mongoose, { Schema, Document } from 'mongoose';

export interface IRoute extends Document {
  from: string;
  to: string;
  distance: number; // km
  options: Array<{
    mode: string;
    time: string; // e.g., "4 hours"
    cost: number; // estimated cost in INR
    co2: number; // kg CO2
    greenScore: number; // 1-10
    rewards: number;
    description: string;
  }>;
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
        cost: { type: Number, required: true },
        co2: { type: Number, required: true },
        greenScore: { type: Number, required: true, min: 1, max: 10 },
        rewards: { type: Number, required: true },
        description: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Index for faster queries
RouteSchema.index({ from: 1, to: 1 });

export const Route = mongoose.model<IRoute>('Route', RouteSchema);
