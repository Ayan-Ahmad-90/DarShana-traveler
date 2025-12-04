import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'Traveler' | 'Guide' | 'SuperAdmin' | 'Manager' | 'Finance' | 'Support';

interface KycDocument {
  type: string;
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  verifiedAt?: Date;
}

export interface UserDocument extends Document {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  primaryRole: UserRole;
  roles: UserRole[];
  status: 'pending' | 'active' | 'suspended';
  walletBalance: number;
  walletCurrency: string;
  preferences?: {
    language: string;
    notifications: boolean;
  };
  kyc?: {
    status: 'pending' | 'verified' | 'rejected';
    documents: KycDocument[];
  };
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  lastLoginAt?: Date;
  security: {
    refreshTokenVersion: number;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
  };
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true },
    primaryRole: {
      type: String,
      enum: ['Traveler', 'Guide', 'SuperAdmin', 'Manager', 'Finance', 'Support'],
      default: 'Traveler'
    },
    roles: {
      type: [
        {
          type: String,
          enum: ['Traveler', 'Guide', 'SuperAdmin', 'Manager', 'Finance', 'Support']
        }
      ],
      default: ['Traveler']
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'suspended'],
      default: 'active'
    },
    walletBalance: { type: Number, default: 0 },
    walletCurrency: { type: String, default: 'INR' },
    preferences: {
      language: { type: String, default: 'en' },
      notifications: { type: Boolean, default: true }
    },
    kyc: {
      status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
      },
      documents: [
        {
          type: {
            type: String
          },
          url: String,
          status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
          },
          verifiedAt: Date
        }
      ]
    },
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      country: { type: String, default: 'India' },
      postalCode: String
    },
    lastLoginAt: Date,
    security: {
      refreshTokenVersion: { type: Number, default: 0 },
      passwordResetToken: String,
      passwordResetExpires: Date
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export default model<UserDocument>('User', userSchema);
