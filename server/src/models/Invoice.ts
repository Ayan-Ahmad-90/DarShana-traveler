import { Schema, model, Document, Types } from 'mongoose';

export interface InvoiceDocument extends Document {
  booking: Types.ObjectId;
  invoiceNumber: string;
  amount: number;
  currency: string;
  gstAmount: number;
  taxDetails?: Record<string, number>;
  downloadUrl?: string;
  pdfPath?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
}

const invoiceSchema = new Schema<InvoiceDocument>(
  {
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    gstAmount: { type: Number, default: 0 },
    taxDetails: Schema.Types.Mixed,
    downloadUrl: String,
    pdfPath: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

export default model<InvoiceDocument>('Invoice', invoiceSchema);
