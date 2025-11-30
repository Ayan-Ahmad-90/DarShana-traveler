import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    duration: { type: String, required: true },
    hotel: String,
    transport: String,
    price: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    includes: [String],
    excludes: [String],
    itinerary: [String],
    category: { type: String, default: 'general' },
  },
  { timestamps: true }
);

const Package = mongoose.model('Package', packageSchema);
export default Package;
