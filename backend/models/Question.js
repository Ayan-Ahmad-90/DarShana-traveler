const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['itinerary', 'safety', 'emergency', 'culture', 'experience', 'practical'],
    required: true
  },
  categoryLabel: String,
  question: {
    type: String,
    required: true
  },
  questionHi: String,
  answer: {
    type: String,
    required: true
  },
  answerHi: String,
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;

