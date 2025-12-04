import { Schema, model, Document, Types } from 'mongoose';

export type SupportStatus = 'open' | 'waiting' | 'resolved' | 'closed';
export type SupportPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface SupportTicketDocument extends Document {
  user: Types.ObjectId;
  booking?: Types.ObjectId;
  subject: string;
  status: SupportStatus;
  priority: SupportPriority;
  messages: Array<{
    sender: Types.ObjectId;
    body: string;
    attachments?: string[];
    createdAt: Date;
  }>;
  assignedTo?: Types.ObjectId;
}

const supportTicketSchema = new Schema<SupportTicketDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking' },
    subject: { type: String, required: true },
    status: {
      type: String,
      enum: ['open', 'waiting', 'resolved', 'closed'],
      default: 'open'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    messages: [
      {
        sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        body: { type: String, required: true },
        attachments: [String],
        createdAt: { type: Date, default: Date.now }
      }
    ],
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default model<SupportTicketDocument>('SupportTicket', supportTicketSchema);
