import mongoose from 'mongoose';

const cabSchema = new mongoose.Schema(
  {
    provider: { type: String, enum: ['uber', 'ola', 'local_taxi'], required: true },
    carType: { type: String, required: true }, // 'economy', 'comfort', 'premium'
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    distance: { type: Number }, // in km
    estimatedDuration: { type: String },
    price: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    driverRating: { type: Number, min: 1, max: 5 },
    availability: { type: Boolean, default: true },
    maxPassengers: { type: Number },
    luggage: { type: String }, // 'small', 'medium', 'large'
    source_api: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Cab', cabSchema);
