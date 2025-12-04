import mongoose, { Schema, Document } from 'mongoose';

export interface IRouteHistory extends Document {
  userId: string;
  from: string;
  to: string;
  selectedMode: string;
  distance: number;
  emissionsSaved: number; // Compared to baseline
  rewardPoints: number;
  journeyDate: Date;
  cost: number;
  createdAt: Date;
}

const RouteHistorySchema = new Schema<IRouteHistory>(
  {
    userId: { type: String, required: true, index: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    selectedMode: { type: String, required: true },
    distance: { type: Number, required: true },
    emissionsSaved: { type: Number, default: 0 },
    rewardPoints: { type: Number, required: true },
    journeyDate: { type: Date, default: Date.now },
    cost: { type: Number },
  },
  { timestamps: true }
);

RouteHistorySchema.index({ userId: 1, journeyDate: -1 });

export const RouteHistory = mongoose.model<IRouteHistory>('RouteHistory', RouteHistorySchema);
