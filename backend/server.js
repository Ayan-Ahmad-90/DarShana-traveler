import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import questionRoutes from './routes/questions.js';
import chatRoutes from './routes/chat.js';
import authRoutes from './routes/auth.js';
import reviewRoutes from './routes/reviews.js';
import plannerRoutes from './routes/planner.js';
import safetyRoutes from './routes/safety.js';
import yatraShayakRoutes from './routes/yatraShayak.js';
import guideRegistrationRoutes from './routes/guideRegistration.js';
import itineraryRoutes from './routes/itineraries.js';
import aiRoutes from './routes/ai.js';
import profileRoutes from './routes/profile.js';
import festivalRoutes from './routes/festivals.js';
import bookingRoutes from './routes/bookings.js';
import contactRoutes from './routes/contact.js';
import guideRoutes from './routes/guides.js';
import notificationRoutes from './routes/notifications.js';
import moodAnalyzerRoutes from './routes/moodAnalyzer.js';

dotenv.config();

const app = express();

// Middleware - CORS with all origins allowed
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/yatra-shayak', yatraShayakRoutes);
app.use('/api/guides', guideRegistrationRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/festivals', festivalRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/local-guides', guideRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/mood-analyze', moodAnalyzerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running! ✅' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🚀 DarShana Travel Backend Started    ║
║  Port: ${PORT}                            
║  Environment: ${process.env.NODE_ENV || 'development'}
╚════════════════════════════════════════╝
  `);
});
