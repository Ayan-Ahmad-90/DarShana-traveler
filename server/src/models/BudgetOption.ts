import mongoose, { Schema, Document } from 'mongoose';

interface IBudgetOption extends Document {
  location: string;
  category: 'accommodation' | 'food' | 'transport' | 'activity' | 'other';
  name: string;
  description: string;
  priceRange: {
    min: number;
    max: number;
  };
  rating: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const budgetOptionSchema = new Schema({
  location: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['accommodation', 'food', 'transport', 'activity', 'other'],
    required: true 
  },
  name: { type: String, required: true },
  description: { type: String },
  priceRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IBudgetOption>('BudgetOption', budgetOptionSchema);
