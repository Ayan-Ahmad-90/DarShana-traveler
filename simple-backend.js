const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'mood-analyzer' });
});

// Main mood analyze endpoint
app.post('/api/mood-analyze', (req, res) => {
  try {
    const { imageData, mood } = req.body;

    console.log('📸 Received mood analysis request');
    
    if (!imageData && !mood) {
      return res.status(400).json({
        error: 'Missing imageData or mood in request body'
      });
    }

    // Mock emotion detection
    const mockEmotions = {
      happy: 0.8,
      sad: 0.05,
      angry: 0.0,
      surprised: 0.1,
      neutral: 0.05,
      fear: 0.0,
      disgust: 0.0
    };

    // Response
    const response = {
      detectedMood: 'Happy & Excited',
      confidence: 0.87,
      emotions: mockEmotions,
      energyLevel: 8,
      socialScore: 7,
      adventureScore: 6,
      reasoning: 'Detected 1 face with happy expression. User appears energetic and ready for social experiences.',
      recommendedKeys: ['adventure', 'culture', 'social', 'nature']
    };

    console.log('✅ Mood analysis complete');
    res.json(response);
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  console.warn(`404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║  🚀 Simple Mood Analyzer Backend      ║');
  console.log('║  Server running on port 3001          ║');
  console.log('║  Endpoints:                           ║');
  console.log('║  - GET  /health                       ║');
  console.log('║  - POST /api/mood-analyze             ║');
  console.log('╚════════════════════════════════════════╝\n');
});
