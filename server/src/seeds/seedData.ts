import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/database.js';
import Destination from '../models/Destination.js';
import Package from '../models/Package.js';
import Blog from '../models/Blog.js';
import { mockDestinations, mockPackages, defaultBlogs } from '../utils/mockData.js';
import logger from '../config/logger.js';

dotenv.config();

const seed = async (): Promise<void> => {
  try {
    await connectDB();

    await Destination.deleteMany();
    await Destination.insertMany(mockDestinations);

    await Package.deleteMany();
    await Package.insertMany(mockPackages);

    await Blog.deleteMany();
    await Blog.insertMany(defaultBlogs);

    logger.info('🌱 Seed data inserted');
  } catch (error) {
    logger.error('Seed failed', error);
  } finally {
    await disconnectDB();
  }
};

seed();
