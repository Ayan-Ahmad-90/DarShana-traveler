import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import festivalRoutes from './routes/festivalRoutes.js';
import languageRoutes from './routes/languageRoutes.js';
import flightRoutes from './routes/flightRoutes.js';
import trainRoutes from './routes/trainRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import transportRoutes from './routes/transportRoutes.js';
import smartPlannerRoutes from './routes/smartPlannerRoutes.js';
import suggestionRoutes from './routes/suggestionRoutes.js';
import rewardRoutes from './routes/rewardRoutes.js';
import guideRoutes from './routes/guideRoutes.js';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'X-Total-Count'],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/festivals', festivalRoutes);
app.use('/api/language', languageRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/planner', smartPlannerRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/guides', guideRoutes);

// Health Check
app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// 404 Handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler
app.use(errorHandler);

// Connect to MongoDB and Start Server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      console.log(`\n✅ Server started on http://localhost:${PORT}`);
      console.log(`📚 API Documentation:`);
      console.log(`   Flights: GET /api/flights/search?from=&to=&date=`);
      console.log(`   Trains: GET /api/trains/search?from=&to=&date=`);
      console.log(`   Bookings: POST /api/bookings`);
      console.log(`   Auth: POST /api/auth/register | POST /api/auth/login`);
      console.log(`\n`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();

export default app;
