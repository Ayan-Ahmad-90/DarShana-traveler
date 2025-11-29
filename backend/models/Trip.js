import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  destination: {
    id: String,
    name: String,
    country: String,
    state: String,
    description: String,
    image: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  travelers: [
    {
      fullName: String,
      email: String,
      phone: String,
      age: Number,
      documentType: {
        type: String,
        enum: ['passport', 'aadhar', 'license'],
      },
      documentNumber: String,
      relationship: String,
    },
  ],
  transport: {
    type: String,
    enum: ['Plane', 'Train', 'Bus', 'Ship', 'Bike', 'Car'],
    required: true,
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  bookingId: mongoose.Schema.Types.ObjectId,
  totalCost: Number,
  shareSlug: {
    type: String,
    unique: true,
    sparse: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Trip', tripSchema);

