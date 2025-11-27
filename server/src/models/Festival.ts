import mongoose, { Schema, Document } from 'mongoose';

interface IFestival extends Document {
  name: string;
  location: string;
  month: number;
  startDate: Date;
  endDate: Date;
  description: string;
  imageUrl: string;
  categories: string[];
  popularity: number;
  createdAt: Date;
  updatedAt: Date;
}

const festivalSchema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  month: { type: Number, required: true, min: 1, max: 12 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  categories: [{ type: String }],
  popularity: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IFestival>('Festival', festivalSchema);
