import { Schema, model, Document, Types } from 'mongoose';

export type PaymentMethod = 'razorpay' | 'stripe' | 'wallet' | 'cod';
export type PaymentProvider = 'Razorpay' | 'Stripe' | 'Wallet' | 'COD';
export type PaymentRecordStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';

export interface PaymentDocument extends Document {
  booking: Types.ObjectId;
  user: Types.ObjectId;
  method: PaymentMethod;
  provider: PaymentProvider;
  providerOrderId?: string;
  providerPaymentId?: string;
  amount: number;
  currency: string;
  status: PaymentRecordStatus;
  attempts: number;
  breakdown?: {
    base: number;
    tax: number;
    fee: number;
    discount: number;
    wallet: number;
  };
  refundedAmount?: number;
  metadata?: Record<string, unknown>;
}

const paymentSchema = new Schema<PaymentDocument>(
  {
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    method: {
      type: String,
      enum: ['razorpay', 'stripe', 'wallet', 'cod'],
      required: true
    },
    provider: {
      type: String,
      enum: ['Razorpay', 'Stripe', 'Wallet', 'COD'],
      default: 'Razorpay'
    },
    providerOrderId: String,
    providerPaymentId: String,
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending'
    },
    attempts: { type: Number, default: 0 },
    breakdown: {
      base: Number,
      tax: Number,
      fee: Number,
      discount: Number,
      wallet: Number
    },
    refundedAmount: { type: Number, default: 0 },
    metadata: Schema.Types.Mixed
  },
  { timestamps: true }
);

export default model<PaymentDocument>('Payment', paymentSchema);
