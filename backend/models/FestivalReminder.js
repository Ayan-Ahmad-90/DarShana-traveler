import mongoose from 'mongoose';

const festivalReminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  festivalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Festival',
    required: true,
  },
  location: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('FestivalReminder', festivalReminderSchema);

