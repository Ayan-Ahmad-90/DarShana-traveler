import { Schema, model, Document, Types } from 'mongoose';

export type RefundStatus = 'requested' | 'approved' | 'rejected' | 'refunded' | 'partial';

export interface RefundDocument extends Document {
  booking: Types.ObjectId;
  payment: Types.ObjectId;
  user: Types.ObjectId;
  amountRequested: number;
  amountApproved?: number;
  status: RefundStatus;
  reason?: string;
  adminNote?: string;
  providerRefundId?: string;
  processedBy?: Types.ObjectId;
  timeline: Array<{ status: RefundStatus; note?: string; timestamp: Date; actor?: Types.ObjectId }>;
}

const refundSchema = new Schema<RefundDocument>(
  {
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    payment: { type: Schema.Types.ObjectId, ref: 'Payment', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amountRequested: { type: Number, required: true },
    amountApproved: Number,
    status: {
      type: String,
      enum: ['requested', 'approved', 'rejected', 'refunded', 'partial'],
      default: 'requested'
    },
    reason: String,
    adminNote: String,
    providerRefundId: String,
    processedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    timeline: [
      {
        status: {
          type: String,
          enum: ['requested', 'approved', 'rejected', 'refunded', 'partial'],
          required: true
        },
        note: String,
        timestamp: { type: Date, default: Date.now },
        actor: { type: Schema.Types.ObjectId, ref: 'User' }
      }
    ]
  },
  { timestamps: true }
);

export default model<RefundDocument>('Refund', refundSchema);
