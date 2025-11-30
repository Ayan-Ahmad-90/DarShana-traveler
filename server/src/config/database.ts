import mongoose from 'mongoose';
import logger from './logger.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/darshana_travel';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('✅ MongoDB connected');
  } catch (error) {
    logger.error('❌ MongoDB connection error', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
};
