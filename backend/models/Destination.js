const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    region: String,
    description: String,
    heroImage: String,
    galleryImages: [String],
    temperature: String,
    weather: String,
    mapLink: String,
    rating: Number,
    reviews: Number,
    tags: [String],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Destination', destinationSchema);
