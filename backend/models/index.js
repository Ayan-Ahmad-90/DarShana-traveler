// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  profileImage: {
    type: String,
    default: null,
  },
  preferences: {
    language: {
      type: String,
      enum: ['en', 'hi'],
      default: 'en',
    },
    notifications: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
  },
  savedDestinations: [mongoose.Schema.Types.ObjectId],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);

// backend/models/Trip.js
const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  destination: {
    id: String,
    name: String,
    country: String,
    state: String,
    description: String,
    image: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  travelers: [
    {
      fullName: String,
      email: String,
      phone: String,
      age: Number,
      documentType: {
        type: String,
        enum: ['passport', 'aadhar', 'license'],
      },
      documentNumber: String,
      relationship: String,
    },
  ],
  transport: {
    type: String,
    enum: ['Plane', 'Train', 'Bus', 'Ship', 'Bike', 'Car'],
    required: true,
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  bookingId: mongoose.Schema.Types.ObjectId,
  totalCost: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Trip', tripSchema);

// backend/models/Booking.js
const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  bookingReference: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Booking', bookingSchema);

// backend/models/LocalGuide.js
const localGuideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  location: String,
  specialties: [String],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  profileImage: String,
  bio: String,
  languages: [String],
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('LocalGuide', localGuideSchema);

// backend/models/GuideRequest.js
const guideRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LocalGuide',
    required: true,
  },
  requestType: {
    type: String,
    enum: [
      'travel_queries',
      'trip_planning',
      'recommendations',
      'emergency',
      'booking_assistance',
    ],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: Date,
});

module.exports = mongoose.model('GuideRequest', guideRequestSchema);

// backend/models/ContactMessage.js
const contactMessageSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'read', 'resolved'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);

// backend/models/Festival.js
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

module.exports = mongoose.model('Festival', festivalSchema);

// backend/models/Notification.js
const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['festival_alert', 'booking_update', 'guide_response', 'general'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  relatedId: mongoose.Schema.Types.ObjectId,
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notification', notificationSchema);

// backend/models/FestivalReminder.js
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

module.exports = mongoose.model('FestivalReminder', festivalReminderSchema);
