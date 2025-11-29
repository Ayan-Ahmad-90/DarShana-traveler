import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  userId: String,
  questionId: mongoose.Schema.Types.ObjectId,
  responseQuality: { type: Number, min: 1, max: 5 },
  relevance: { type: Number, min: 1, max: 5 },
  accuracy: { type: Number, min: 1, max: 5 },
  comment: String,
  liked: Boolean,
  disliked: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const UserFeedback = mongoose.model('UserFeedback', feedbackSchema);
export default UserFeedback;

