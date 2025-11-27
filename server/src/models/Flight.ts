import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema(
  {
    flightNumber: { type: String, required: true },
    airline: { type: String, required: true },
    airlineCode: { type: String },
    airlineLogo: { type: String },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    duration: { type: String }, // e.g., "2h 30m"
    stops: { type: Number, default: 0 },
    aircraft: { type: String },
    price: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    availableSeats: { type: Number, default: 100 },
    amenities: [String], // e.g., ['wifi', 'meal', 'entertainment']
    class: { type: String, enum: ['economy', 'premium_economy', 'business', 'first'], default: 'economy' },
    source: { type: String }, // 'amadeus', 'mock', 'external_api'
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Flight', flightSchema);
