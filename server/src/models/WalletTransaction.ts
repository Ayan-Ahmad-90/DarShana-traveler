import { Schema, model, Document, Types } from 'mongoose';

export type WalletTransactionType = 'credit' | 'debit';

export interface WalletTransactionDocument extends Document {
  user: Types.ObjectId;
  booking?: Types.ObjectId;
  type: WalletTransactionType;
  amount: number;
  currency: string;
  balanceAfter: number;
  reason: string;
  reference?: string;
  actor?: Types.ObjectId;
}

const walletTransactionSchema = new Schema<WalletTransactionDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking' },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    balanceAfter: { type: Number, required: true },
    reason: { type: String, required: true },
    reference: String,
    actor: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default model<WalletTransactionDocument>('WalletTransaction', walletTransactionSchema);
