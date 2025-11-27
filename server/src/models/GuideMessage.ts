
import mongoose, { Schema, Document } from 'mongoose';

export interface IGuideMessage extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
}

const GuideMessageSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IGuideMessage>('GuideMessage', GuideMessageSchema);
