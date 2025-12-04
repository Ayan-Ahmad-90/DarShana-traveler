import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/database.js';
import { environment } from './config/environment.js';
import logger from './config/logger.js';

dotenv.config();

const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(environment.port, () => {
    logger.info(`🚀 DarShana backend running on port ${environment.port}`);
  });
};

startServer().catch((error) => {
  logger.error('Failed to start server', error);
  process.exit(1);
});
