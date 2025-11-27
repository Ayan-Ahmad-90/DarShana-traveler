import mongoose, { Schema, Document } from 'mongoose';

interface ITrip extends Document {
  userId: string;
  mode: string;
  from: string;
  to: string;
  date: Date;
  returnDate?: Date;
  price: number;
  bookingId: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  passengers: {
    name: string;
    email: string;
    phone: string;
  }[];
  specialRequests?: string;
  paymentMethod: string;
  totalPrice: number;
  createdAt: Date;
}

const tripSchema = new Schema<ITrip>(
  {
    userId: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      enum: ['flight', 'train', 'cab', 'bus', 'bike', 'hotel', 'package'],
      required: true
    },
    from: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    returnDate: {
      type: Date
    },
    price: {
      type: Number,
      required: true
    },
    bookingId: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'cancelled'],
      default: 'upcoming'
    },
    passengers: [
      {
        name: { type: String },
        email: { type: String },
        phone: { type: String }
      }
    ],
    specialRequests: {
      type: String
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'netbanking'],
      default: 'card'
    },
    totalPrice: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ITrip>('Trip', tripSchema);
