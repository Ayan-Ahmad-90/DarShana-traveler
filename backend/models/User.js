import mongoose from 'mongoose';

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
  // 🔥 NEW: Username field
  username: {
    type: String,
    default: '',
    trim: true,
  },
  // 🔥 NEW: Username change limit (max 2 times)
  usernameChangeCount: {
    type: Number,
    default: 0,
  },
  // 🔥 NEW: User role (user/admin)
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
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
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  sustainabilityPoints: {
    type: Number,
    default: 0
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

export default mongoose.model('User', userSchema);
