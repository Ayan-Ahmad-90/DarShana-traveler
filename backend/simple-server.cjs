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

    // Mock emotion detection with random variation
    const moods = [
      { name: 'Happy & Excited', energy: 8, social: 9, adventure: 7, keys: ['Nightlife', 'Street Food', 'Beach'] },
      { name: 'Calm & Peaceful', energy: 3, social: 2, adventure: 2, keys: ['Yoga', 'Temples', 'Nature'] },
      { name: 'Adventurous', energy: 9, social: 6, adventure: 10, keys: ['Trekking', 'Paragliding', 'Snow'] },
      { name: 'Romantic', energy: 5, social: 4, adventure: 3, keys: ['Houseboat', 'Palaces', 'Lakes'] },
      { name: 'Cultural', energy: 4, social: 7, adventure: 4, keys: ['History', 'Architecture', 'Festivals'] }
    ];

    // Pick a random mood for demo purposes (or based on simple image hash if we wanted consistency)
    const randomMood = moods[Math.floor(Math.random() * moods.length)];

    const mockEmotions = {
      happy: randomMood.name.includes('Happy') ? 0.8 : 0.1,
      sad: 0.05,
      angry: 0.0,
      surprised: randomMood.name.includes('Adventurous') ? 0.6 : 0.1,
      neutral: randomMood.name.includes('Calm') ? 0.8 : 0.1,
      fear: 0.0,
      disgust: 0.0
    };

    // Response
    const response = {
      detectedMood: randomMood.name,
      confidence: 0.85 + Math.random() * 0.1,
      emotions: mockEmotions,
      energyLevel: randomMood.energy,
      socialScore: randomMood.social,
      adventureScore: randomMood.adventure,
      reasoning: `AI Analysis: Detected facial expressions matching '${randomMood.name}'. Recommended for ${randomMood.keys.join(', ')} experiences.`,
      recommendedKeys: randomMood.keys
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
