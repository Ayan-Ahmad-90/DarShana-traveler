import mongoose, { Schema, Document } from 'mongoose';

interface IEcoActivity extends Document {
  userId: mongoose.Types.ObjectId;
  activityType: 'walking' | 'cycling' | 'public_transport' | 'carpool' | 'electric_vehicle';
  distance: number;
  carbonSaved: number;
  points: number;
  date: Date;
  location: string;
  description: string;
  createdAt: Date;
}

const ecoActivitySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  activityType: { 
    type: String, 
    enum: ['walking', 'cycling', 'public_transport', 'carpool', 'electric_vehicle'],
    required: true 
  },
  distance: { type: Number, default: 0 },
  carbonSaved: { type: Number, default: 0 },
  points: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  location: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IEcoActivity>('EcoActivity', ecoActivitySchema);
