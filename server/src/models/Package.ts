import { Schema, model, Document } from 'mongoose';

export interface PackageDocument extends Document {
  title: string;
  slug: string;
  duration: string;
  price: number;
  description: string;
  inclusions: string[];
  exclusions: string[];
  itinerary: string[];
  heroImage: string;
  tags: string[];
}

const packageSchema = new Schema<PackageDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    itinerary: [{ type: String }],
    heroImage: { type: String, required: true },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

export default model<PackageDocument>('Package', packageSchema);
