import mongoose, { Schema, Document } from 'mongoose';

interface ILocalGuide extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  location: string;
  languages: string[];
  specialization: string[];
  bio: string;
  profileImage: string;
  rating: number;
  totalReviews: number;
  pricePerDay: number;
  availability: {
    startTime: string;
    endTime: string;
    daysAvailable: string[];
  };
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const localGuideSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  languages: [{ type: String }],
  specialization: [{ 
    type: String,
    enum: ['historical', 'adventure', 'cultural', 'nature', 'religious', 'food', 'other']
  }],
  bio: { type: String },
  profileImage: { type: String },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  totalReviews: { type: Number, default: 0 },
  pricePerDay: { type: Number, required: true },
  availability: {
    startTime: { type: String, default: '08:00' },
    endTime: { type: String, default: '18:00' },
    daysAvailable: [{ type: String }]
  },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<ILocalGuide>('LocalGuide', localGuideSchema);
