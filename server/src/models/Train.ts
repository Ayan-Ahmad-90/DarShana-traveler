import mongoose from 'mongoose';

const trainSchema = new mongoose.Schema(
  {
    trainNumber: { type: String, required: true },
    trainName: { type: String, required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    duration: { type: String },
    trainType: { type: String, enum: ['shatabdi', 'rajdhani', 'intercity', 'express', 'local'] },
    classes: [
      {
        className: String,
        price: Number,
        availableSeats: Number,
      },
    ],
    stops: [{ stationName: String, arrivalTime: Date, departureTime: Date }],
    frequency: { type: String }, // 'daily', 'mon-fri', etc.
    source_api: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Train', trainSchema);
