import { Schema, model, Document } from 'mongoose';

export interface DestinationDocument extends Document {
  name: string;
  state: string;
  region: string;
  shortDescription: string;
  highlights: string[];
  bestSeason: string;
  climate: string;
  priceRange: string;
  rating: number;
  heroImage: string;
  gallery: string[];
  tags: string[];
}

const destinationSchema = new Schema<DestinationDocument>(
  {
    name: { type: String, required: true },
    state: { type: String, required: true },
    region: { type: String, required: true },
    shortDescription: { type: String, required: true },
    highlights: [{ type: String }],
    bestSeason: { type: String, required: true },
    climate: { type: String, required: true },
    priceRange: { type: String, required: true },
    rating: { type: Number, default: 4.5 },
    heroImage: { type: String, required: true },
    gallery: [{ type: String }],
    tags: [{ type: String }]
  },
  { timestamps: true }
);

export default model<DestinationDocument>('Destination', destinationSchema);
