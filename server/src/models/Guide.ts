import { Schema, model, Document, Types } from 'mongoose';

export type GuideStatus = 'pending' | 'approved' | 'rejected' | 'frozen';

interface DocumentUpload {
  type: string;
  url: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: Date;
}

export interface GuideDocument extends Document {
  user: Types.ObjectId;
  biography?: string;
  languages: string[];
  experienceYears: number;
  expertiseAreas: string[];
  commissions: {
    rate: number;
    currency: string;
  };
  earnings: {
    total: number;
    pendingPayout: number;
  };
  status: GuideStatus;
  documents: DocumentUpload[];
  availability?: Array<{
    date: Date;
    slots: Array<{ start: string; end: string; isBooked: boolean }>;
  }>;
}

const guideSchema = new Schema<GuideDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    biography: String,
    languages: { type: [String], default: ['English'] },
    experienceYears: { type: Number, default: 0 },
    expertiseAreas: { type: [String], default: [] },
    commissions: {
      rate: { type: Number, default: 0.1 },
      currency: { type: String, default: 'INR' }
    },
    earnings: {
      total: { type: Number, default: 0 },
      pendingPayout: { type: Number, default: 0 }
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'frozen'],
      default: 'pending'
    },
    documents: [
      {
        type: { type: String, required: true },
        url: { type: String, required: true },
        status: {
          type: String,
          enum: ['pending', 'verified', 'rejected'],
          default: 'pending'
        },
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    availability: [
      {
        date: Date,
        slots: [
          {
            start: String,
            end: String,
            isBooked: { type: Boolean, default: false }
          }
        ]
      }
    ]
  },
  { timestamps: true }
);

export default model<GuideDocument>('Guide', guideSchema);
