import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database.js';
import { env } from './config/environment.js';
import logger from './utils/logger.js';
import routeRoutes from './routes/routes.js';
import moodAnalyzerRoutes from './routes/moodAnalyzer.js';
import arGuideRoutes from './routes/arGuide.js';
import guideRoutes from './routes/guides.js';
import tripPlannerRoutes from './routes/tripPlanner.js';
import safetyRoutes from './routes/safety.js';

const app = express();

// CORS Configuration
const corsOptions = {
  origin: true, // Allow all origins dynamically
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

app.use(express.json({ limit: '50mb' })); // Increase limit for images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`\n ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'darshana-green-routes' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Backend is running! ' });
});

// Routes
app.use('/api/routes', routeRoutes);
app.use('/api/mood-analyze', moodAnalyzerRoutes);
app.use('/api/ar-guide', arGuideRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/trip-planner', tripPlannerRoutes);
app.use('/api/safety', safetyRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(' Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(env.PORT, () => {
      console.log(`

   DarShana Travel Backend Started    
  Port: ${env.PORT}                            
  URL:  http://localhost:${env.PORT}

      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
