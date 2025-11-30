import { Schema, model, Document, Types } from 'mongoose';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
export type BookingType = 'package' | 'custom' | 'guide';

interface TimelineEntry {
  status: string;
  note?: string;
  updatedBy?: Types.ObjectId;
  timestamp: Date;
}

interface FareBreakdown {
  baseFare: number;
  taxes: number;
  fees: number;
  discounts: number;
  total: number;
  currency: string;
  walletAmount?: number;
  payableAmount?: number;
}

interface TravelDetails {
  from: string;
  to: string;
  startDate: Date;
  endDate: Date;
  passengers: number;
  transportMode?: string;
}

export interface BookingDocument extends Document {
  bookingCode: string;
  user: Types.ObjectId;
  guide?: Types.ObjectId;
  package?: Types.ObjectId;
  destination?: Types.ObjectId;
  bookingType: BookingType;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  amountBreakdown: FareBreakdown;
  travelDetails: TravelDetails;
  addons?: Array<{ name: string; price: number }>;
  coupon?: {
    code: string;
    discountAmount: number;
  };
  walletUsed?: number;
  timeline: TimelineEntry[];
  invoice?: Types.ObjectId;
  ticket?: Types.ObjectId;
  notes?: string;
  metadata?: Record<string, unknown>;
}

const bookingSchema = new Schema<BookingDocument>(
  {
    bookingCode: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    guide: { type: Schema.Types.ObjectId, ref: 'Guide' },
    package: { type: Schema.Types.ObjectId, ref: 'Package' },
    destination: { type: Schema.Types.ObjectId, ref: 'Destination' },
    bookingType: {
      type: String,
      enum: ['package', 'custom', 'guide'],
      default: 'package'
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending'
    },
    amountBreakdown: {
      baseFare: { type: Number, required: true },
      taxes: { type: Number, default: 0 },
      fees: { type: Number, default: 0 },
      discounts: { type: Number, default: 0 },
      total: { type: Number, required: true },
      currency: { type: String, default: 'INR' },
      walletAmount: { type: Number, default: 0 },
      payableAmount: { type: Number, default: 0 }
    },
    travelDetails: {
      from: { type: String, required: true },
      to: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      passengers: { type: Number, required: true },
      transportMode: String
    },
    addons: [
      {
        name: String,
        price: Number
      }
    ],
    coupon: {
      code: String,
      discountAmount: { type: Number, default: 0 }
    },
    walletUsed: { type: Number, default: 0 },
    timeline: [
      {
        status: String,
        note: String,
        updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    invoice: { type: Schema.Types.ObjectId, ref: 'Invoice' },
    ticket: { type: Schema.Types.ObjectId, ref: 'Ticket' },
    notes: String,
    metadata: Schema.Types.Mixed
  },
  { timestamps: true }
);

export default model<BookingDocument>('Booking', bookingSchema);
