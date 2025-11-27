import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true,
      trim: true
    },
    phone: { 
      type: String, 
      required: true,
      unique: true
    },
    password: { 
      type: String, 
      required: true,
      minlength: 6
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'other'
    },
    dob: {
      type: Date
    },
    profileImage: { 
      type: String,
      default: null
    },
    address: { 
      type: String,
      default: ''
    },
    city: { 
      type: String,
      default: ''
    },
    country: { 
      type: String,
      default: ''
    },
    savedTrips: {
      type: [String],
      default: []
    },
    notificationPreferences: {
      emailNotifications: {
        type: Boolean,
        default: true
      },
      festivalAlerts: {
        type: Boolean,
        default: true
      },
      smsNotifications: {
        type: Boolean,
        default: false
      },
      region: {
        type: String,
        default: ''
      }
    },
    preferredLanguage: {
      type: String,
      default: 'en',
      enum: ['en', 'hi', 'ur', 'ta', 'te', 'kn', 'ml']
    },
    travelInterests: {
      type: [String],
      default: []
    },
    passportNumber: { 
      type: String 
    },
    preferences: {
      preferedAirlines: [String],
      preferedHotels: [String],
      seatPreference: { 
        type: String, 
        enum: ['window', 'middle', 'aisle'] 
      },
    },
    bookings: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Booking' 
    }],
    isVerified: { 
      type: Boolean, 
      default: false 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    updatedAt: { 
      type: Date, 
      default: Date.now 
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
