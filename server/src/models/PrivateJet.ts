import mongoose from 'mongoose';

const privateJetSchema = new mongoose.Schema(
  {
    jetName: { type: String, required: true },
    operator: { type: String, required: true },
    aircraft: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    capacity: { type: Number },
    pricePerHour: { type: Number },
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    amenities: [String],
    imageUrl: { type: String },
    flightDuration: { type: String },
    source_api: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('PrivateJet', privateJetSchema);
