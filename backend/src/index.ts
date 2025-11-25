import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database.js';
import { env } from './config/environment.js';
import logger from './utils/logger.js';
import routeRoutes from './routes/routes.js';

const app = express();

// Middleware
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'darshana-green-routes',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/routes', routeRoutes);

// 404 handler
app.use((req, res) => {
  logger.warn(`404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// Database connection and server startup
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();
    
    // Start server
    app.listen(env.PORT, () => {
      logger.info(`🚀 Green Routes Server running on port ${env.PORT}`);
      logger.info(`📍 Environment: ${env.NODE_ENV}`);
      logger.info(`🌐 CORS Origin: ${env.CORS_ORIGIN}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
