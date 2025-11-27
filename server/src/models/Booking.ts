import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookingType: {
      type: String,
      enum: ['flight', 'train', 'cruise', 'private_jet', 'cab', 'bike'],
      required: true,
    },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true }, // reference to Flight/Train/etc
    passengers: [
      {
        name: String,
        email: String,
        phone: String,
        dateOfBirth: Date,
        documentId: String,
      },
    ],
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'pending', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    bookingDate: { type: Date, default: Date.now },
    departureDate: Date,
    returnDate: Date,
    specialRequests: String,
    insuranceIncluded: { type: Boolean, default: false },
    cancellationPolicy: String,
    paymentMethod: String,
    transactionId: String,
    notes: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
