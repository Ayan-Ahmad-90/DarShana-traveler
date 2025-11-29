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

dotenv.config();

const app = express();

// Middleware
app.use(cors());
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
