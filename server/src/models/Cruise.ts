import mongoose from 'mongoose';

const cruiseSchema = new mongoose.Schema(
  {
    cruiseName: { type: String, required: true },
    cruiseLine: { type: String, required: true },
    embarkPort: { type: String, required: true },
    disembarkPort: { type: String, required: true },
    departureDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    duration: { type: Number }, // days
    capacity: { type: Number },
    availableCabins: { type: Number },
    cabinTypes: [
      {
        type: String,
        price: Number,
        count: Number,
      },
    ],
    amenities: [String],
    destinations: [String],
    imageUrl: { type: String },
    price: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    source_api: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Cruise', cruiseSchema);
