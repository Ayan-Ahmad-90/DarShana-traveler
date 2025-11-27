import mongoose, { Schema, Document } from 'mongoose';

interface IFestivalAlert extends Document {
  name: string;
  region: string;
  date: Date;
  description: string;
  templateId: string;
  subscribers: string[];
  createdAt: Date;
}

const festivalAlertSchema = new Schema<IFestivalAlert>(
  {
    name: {
      type: String,
      required: true
    },
    region: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    templateId: {
      type: String,
      default: 'template_ysa4wpb'
    },
    subscribers: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IFestivalAlert>('FestivalAlert', festivalAlertSchema);
