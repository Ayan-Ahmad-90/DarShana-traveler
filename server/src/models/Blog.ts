import { Schema, model, Document } from 'mongoose';

export interface BlogDocument extends Document {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  tags: string[];
  heroImage: string;
}

const blogSchema = new Schema<BlogDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    body: { type: String, required: true },
    tags: [{ type: String }],
    heroImage: { type: String, required: true }
  },
  { timestamps: true }
);

export default model<BlogDocument>('Blog', blogSchema);
