import mongoose, { Schema, Document } from 'mongoose';

interface IReward extends Document {
  userId: mongoose.Types.ObjectId;
  totalPoints: number;
  badges: string[];
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  redeemablePoints: number;
  totalCarbonSaved: number;
  activities: number;
  createdAt: Date;
  updatedAt: Date;
}

const rewardSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  totalPoints: { type: Number, default: 0 },
  badges: [{ 
    type: String,
    enum: ['carbon_warrior', 'green_traveler', 'eco_champion', 'nature_lover', 'sustainability_star']
  }],
  tier: { 
    type: String, 
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  redeemablePoints: { type: Number, default: 0 },
  totalCarbonSaved: { type: Number, default: 0 },
  activities: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IReward>('Reward', rewardSchema);
