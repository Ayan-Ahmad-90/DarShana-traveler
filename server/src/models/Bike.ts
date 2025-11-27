import mongoose from 'mongoose';

const bikeRentalSchema = new mongoose.Schema(
  {
    bikeName: { type: String, required: true },
    rentalCompany: { type: String, required: true },
    bikeType: { type: String, enum: ['scooter', 'bike', 'motorcycle', 'sportbike'], required: true },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    pickupDate: { type: Date, required: true },
    dropoffDate: { type: Date, required: true },
    pricePerDay: { type: Number, required: true },
    totalDays: { type: Number },
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    condition: { type: String }, // 'new', 'good', 'fair'
    fuel: { type: String }, // 'full_tank', 'partial'
    helmet: { type: Boolean, default: true },
    insurance: { type: Boolean, default: false },
    rating: { type: Number, min: 1, max: 5 },
    availability: { type: Boolean, default: true },
    images: [String],
    source_api: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Bike', bikeRentalSchema);
