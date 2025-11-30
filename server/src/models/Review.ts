import { Schema, model, Document, Types } from 'mongoose';

export interface ReviewDocument extends Document {
  user: Types.ObjectId;
  destination?: Types.ObjectId;
  title: string;
  rating: number;
  comment: string;
}

const reviewSchema = new Schema<ReviewDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: Schema.Types.ObjectId, ref: 'Destination' },
    title: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true }
  },
  { timestamps: true }
);

export default model<ReviewDocument>('Review', reviewSchema);
