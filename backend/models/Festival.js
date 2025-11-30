import mongoose from 'mongoose';

const festivalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  description: String,
  image: String,
  significance: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Festival', festivalSchema);

