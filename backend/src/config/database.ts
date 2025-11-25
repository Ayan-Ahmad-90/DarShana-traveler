import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/darshana-travel';
    
    await mongoose.connect(mongoUri, {
      retryWrites: true,
      w: 'majority',
    });
    
    logger.info('✅ MongoDB Connected successfully');
    return mongoose.connection;
  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    logger.info('✅ MongoDB disconnected');
  } catch (error) {
    logger.error('❌ Error disconnecting from MongoDB:', error);
  }
};
