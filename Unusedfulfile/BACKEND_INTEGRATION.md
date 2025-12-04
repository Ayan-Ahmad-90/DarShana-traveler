# Backend Integration - Copy-Paste Ready Code

This file contains exact code snippets to mount the AI Mood Analyzer routes in your backend.

---

## For backend/src/index.ts (TypeScript)

### Full Example Setup

Find your current file and add these lines:

```typescript
import express from 'express';
import cors from 'cors';
// ... your other imports ...

// 👇 ADD THIS IMPORT
import moodAnalyzerRoutes from './routes/moodAnalyzer.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ... your other middleware ...

// Routes
app.use('/api/questions', questionRoutes);  // Example existing route
app.use('/api/chat', chatRoutes);           // Example existing route

// 👇 ADD THIS LINE
app.use('/api/mood-analyze', moodAnalyzerRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
```

---

## For backend/server.js (CommonJS - Node.js)

### Full Example Setup

```javascript
const express = require('express');
const cors = require('cors');
// ... your other requires ...

// 👇 ADD THIS REQUIRE
const moodAnalyzerRoutes = require('./src/routes/moodAnalyzer.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ... your other middleware ...

// Routes
app.use('/api/questions', questionRoutes);  // Example existing route
app.use('/api/chat', chatRoutes);           // Example existing route

// 👇 ADD THIS LINE
app.use('/api/mood-analyze', moodAnalyzerRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
```

---

## Minimal Integration (Just the essentials)

If your server file is already complex, just add these two lines:

```typescript
import moodAnalyzerRoutes from './routes/moodAnalyzer.js';  // ← Add this import

// ... rest of code ...

app.use('/api/mood-analyze', moodAnalyzerRoutes);  // ← Add this route
```

---

## Testing the Integration

### 1. Start your backend
```bash
cd backend
npm run dev
```

### 2. In another terminal, test the health endpoint
```bash
curl http://localhost:3001/api/mood-analyze/health
```

### 3. Expected response
```json
{
  "status": "healthy",
  "service": "mood-analyzer",
  "testResult": {
    "detectedMood": "Balanced & Open",
    "confidence": 0.42
  }
}
```

### 4. Test the mood analysis endpoint (with sample image)
```bash
curl -X POST http://localhost:3001/api/mood-analyze \
  -H "Content-Type: application/json" \
  -d '{
    "imageData": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k"
  }'
```

---

## Troubleshooting

### Error: "Cannot find module './routes/moodAnalyzer.js'"

**Solution:**
1. Verify file exists: `backend/src/routes/moodAnalyzer.ts`
2. Check the import path matches exactly
3. If using TypeScript, file extension in import can be `.js` (TypeScript transpiles it)

### Error: "CORS error when calling from frontend"

**Solution:** Add CORS middleware before routes:
```typescript
import cors from 'cors';
app.use(cors());
```

### Error: Port 3001 already in use

**Solution:** Use a different port:
```typescript
const PORT = process.env.PORT || 3001;  // Change 3001 to another port
```

Or kill the process using port 3001:
```bash
# Mac/Linux:
lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows (in PowerShell as admin):
Get-Process | Where-Object {$_.Port -eq 3001} | Stop-Process -Force
```

---

## Environment Variables

### Create `.env.local` in backend root

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

### Access in your code

```typescript
const port = process.env.PORT || 3001;
const env = process.env.NODE_ENV || 'development';
```

---

## Verify Everything is Working

Run this in your backend directory:

```bash
# 1. Check that TypeScript compiles
npm run build

# 2. Check that routes file exists and is valid
cat src/routes/moodAnalyzer.ts

# 3. Check that controller file exists
cat src/controllers/moodAnalyzerController.ts

# 4. Check that service file exists
cat src/services/emotionService.ts

# 5. Start the server
npm run dev

# 6. In another terminal, test the endpoint
curl http://localhost:3001/api/mood-analyze/health
```

---

## What These Routes Do

### POST /api/mood-analyze

**Purpose:** Analyze a user's facial emotions and return mood recommendations

**Input:**
- `imageData`: Base64 encoded image with a face

**Output:**
```json
{
  "detectedMood": "Happy & Excited",
  "confidence": 0.87,
  "emotions": {
    "happy": 0.85,
    "sad": 0.02,
    "angry": 0,
    "surprised": 0.1,
    "neutral": 0.03,
    "fear": 0,
    "disgust": 0
  },
  "energyLevel": 8,
  "socialScore": 7,
  "adventureScore": 9,
  "reasoning": "Your bright smile and excited expression suggest you're ready for adventure.",
  "recommendedKeys": ["adventure", "beach", "thrilling"]
}
```

**Used by:** MoodAnalyzer.tsx after user captures/uploads a photo

---

### GET /api/mood-analyze/health

**Purpose:** Verify the mood analyzer service is running

**Output:**
```json
{
  "status": "healthy",
  "service": "mood-analyzer",
  "testResult": {
    "detectedMood": "Balanced & Open",
    "confidence": 0.42
  }
}
```

**Used by:** Frontend to verify backend is reachable before attempting analysis

---

## Frontend Expects

The frontend will call these endpoints from `src/services/moodApi.ts`:

```typescript
// This is what the frontend does:
const response = await fetch('http://localhost:3001/api/mood-analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ imageData: base64ImageData })
});

const result = await response.json();
// result now contains the mood analysis response
```

Make sure your backend mounted at `/api/mood-analyze` returns the expected JSON structure.

---

## Next Steps

1. ✅ Copy one of the integration snippets above into your `backend/src/index.ts` or `backend/server.js`
2. ✅ Add the import line for `moodAnalyzerRoutes`
3. ✅ Add the `app.use('/api/mood-analyze', moodAnalyzerRoutes)` line
4. ✅ Run `npm run dev` in the backend directory
5. ✅ Test with `curl http://localhost:3001/api/mood-analyze/health`
6. ✅ Frontend will automatically work once backend is running

---

## Reference Files

The files mounted at `/api/mood-analyze`:

- **Routes:** `backend/src/routes/moodAnalyzer.ts` (35 lines)
  - Defines POST / and GET /health endpoints

- **Controllers:** `backend/src/controllers/moodAnalyzerController.ts` (180 lines)
  - Handles request validation and response formatting

- **Service:** `backend/src/services/emotionService.ts` (280+ lines)
  - Contains all emotion detection and mood classification logic

---

**Status:** ✅ Ready to integrate  
**Time to implement:** ~2 minutes  
**Testing time:** ~5 minutes  
**Difficulty:** ⭐ Easy (just 2 lines of code!)
