import { Schema, model, Document, Types } from 'mongoose';

export interface TicketDocument extends Document {
  booking: Types.ObjectId;
  ticketNumber: string;
  qrCodeUrl?: string;
  pdfUrl?: string;
  passengers: Array<{ name: string; age?: number; gender?: string }>;
  travelInfo: {
    from: string;
    to: string;
    date: Date;
  };
  guideInfo?: {
    guideId: Types.ObjectId;
    name: string;
    phone?: string;
  };
  status: 'active' | 'cancelled';
}

const ticketSchema = new Schema<TicketDocument>(
  {
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    ticketNumber: { type: String, required: true, unique: true },
    qrCodeUrl: String,
    pdfUrl: String,
    passengers: [
      {
        name: { type: String, required: true },
        age: Number,
        gender: String
      }
    ],
    travelInfo: {
      from: { type: String, required: true },
      to: { type: String, required: true },
      date: { type: Date, required: true }
    },
    guideInfo: {
      guideId: { type: Schema.Types.ObjectId, ref: 'Guide' },
      name: String,
      phone: String
    },
    status: {
      type: String,
      enum: ['active', 'cancelled'],
      default: 'active'
    }
  },
  { timestamps: true }
);

export default model<TicketDocument>('Ticket', ticketSchema);
