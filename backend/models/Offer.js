import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    discount: String,
    details: String,
    startDate: Date,
    endDate: Date,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Offer = mongoose.model('Offer', offerSchema);
export default Offer;
