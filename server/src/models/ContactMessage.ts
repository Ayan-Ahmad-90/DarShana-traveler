import { Schema, model, Document } from 'mongoose';

export interface ContactMessageDocument extends Document {
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  source?: string;
}

const contactMessageSchema = new Schema<ContactMessageDocument>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    message: { type: String, required: true },
    source: { type: String }
  },
  { timestamps: true }
);

export default model<ContactMessageDocument>('ContactMessage', contactMessageSchema);
