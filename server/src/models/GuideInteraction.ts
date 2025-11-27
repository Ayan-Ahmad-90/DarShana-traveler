import mongoose, { Schema, Document } from 'mongoose';

interface IGuideInteraction extends Document {
  userId: mongoose.Types.ObjectId;
  guideId: mongoose.Types.ObjectId;
  interactionType: 'inquiry' | 'booking' | 'review' | 'message';
  message: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  tripDate: Date;
  rating: number;
  reviewText: string;
  createdAt: Date;
  updatedAt: Date;
}

const guideInteractionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  guideId: { type: Schema.Types.ObjectId, ref: 'LocalGuide', required: true },
  interactionType: { 
    type: String, 
    enum: ['inquiry', 'booking', 'review', 'message'],
    required: true 
  },
  message: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'completed', 'cancelled'],
    default: 'pending'
  },
  tripDate: { type: Date },
  rating: { type: Number, min: 0, max: 5 },
  reviewText: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IGuideInteraction>('GuideInteraction', guideInteractionSchema);
