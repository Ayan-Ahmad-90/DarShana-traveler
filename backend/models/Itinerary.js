const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startingLocation: {
    type: String,
    required: true,
    trim: true,
  },
  destination: {
    type: String,
    required: true,
    trim: true,
  },
  dates: {
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
  },
  preferences: {
    type: Object,
    default: {},
  },
  planData: [{
    day: Number,
    activities: [{
      time: String,
      activity: String,
      location: String,
      description: String,
    }],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Itinerary', itinerarySchema);