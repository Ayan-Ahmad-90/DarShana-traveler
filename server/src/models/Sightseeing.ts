import mongoose, { Schema, Document } from 'mongoose';

interface ISightseeing extends Document {
  name: string;
  location: string;
  description: string;
  category: 'historical' | 'natural' | 'adventure' | 'cultural' | 'religious' | 'other';
  imageUrl: string;
  rating: number;
  reviews: number;
  entryFee: number;
  bestTimeToVisit: string;
  timeTaken: string;
  createdAt: Date;
  updatedAt: Date;
}

const sightseeingSchema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['historical', 'natural', 'adventure', 'cultural', 'religious', 'other'],
    required: true 
  },
  imageUrl: { type: String },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviews: { type: Number, default: 0 },
  entryFee: { type: Number, default: 0 },
  bestTimeToVisit: { type: String },
  timeTaken: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<ISightseeing>('Sightseeing', sightseeingSchema);
