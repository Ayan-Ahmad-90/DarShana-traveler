import mongoose from 'mongoose';

const guideRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LocalGuide',
    required: true,
  },
  requestType: {
    type: String,
    enum: [
      'travel_queries',
      'trip_planning',
      'recommendations',
      'emergency',
      'booking_assistance',
    ],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: Date,
});

export default mongoose.model('GuideRequest', guideRequestSchema);
