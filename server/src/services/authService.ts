import bcryptjs from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../models/User.js';

export class AuthService {
  static async register(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcryptjs.hash(userData.password, 10);
    const user = new User({
      ...userData,
      password: hashedPassword,
    });

    await user.save();
    return { message: 'User registered successfully', userId: user._id };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const secret = process.env.JWT_SECRET || 'secret_key_for_jwt';
    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      secret,
      { expiresIn: '7d' }
    );

    return { token, user: { id: user._id, name: user.name, email: user.email } };
  }

  static async getUserById(userId: string) {
    const user = await User.findById(userId).populate('bookings');
    return user;
  }

  static async updateProfile(userId: string, updateData: Partial<typeof User>) {
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    return user;
  }
}
