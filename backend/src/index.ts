import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database.js';
import { env } from './config/environment.js';
import logger from './utils/logger.js';
import routeRoutes from './routes/routes.js';
import moodAnalyzerRoutes from './routes/moodAnalyzer.js';

const app = express();

const allowedOrigins = env.CORS_ORIGIN.split(',').map(origin => origin.trim()).filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    logger.warn(`🚫 Blocked CORS origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: any, res: any, next: any) => {
  console.log(`\n📨 ${req.method} ${req.path}`);
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req: any, res: any) => {
  console.log('✅ Health check requested');
  res.status(200).json({
    status: 'ok',
    service: 'darshana-green-routes',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
console.log('\n🔌 Mounting API routes...');
app.use('/api/routes', routeRoutes);
console.log('✅ Mounted: /api/routes');

app.use('/api/mood-analyze', moodAnalyzerRoutes);
console.log('✅ Mounted: /api/mood-analyze');

// 404 handler
app.use((req: any, res: any) => {
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
      logger.info(`🌐 Allowed Origins: ${allowedOrigins.join(', ')}`);
      logger.info(`🧠 Mood Analyzer Endpoint: http://localhost:${env.PORT}/api/mood-analyze`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
