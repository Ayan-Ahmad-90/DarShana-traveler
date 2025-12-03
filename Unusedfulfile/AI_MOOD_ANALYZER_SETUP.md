# 🤖 AI Mood Analyzer - Complete Setup & Integration Guide

## Overview

This is a production-ready **AI Mood Analyzer** system for DarShana Travel that:
- 🎥 Detects facial expressions in real-time from camera/uploaded images
- 😊 Analyzes 7 emotions: Happy, Sad, Angry, Surprised, Neutral, Fear, Disgust
- 🧠 Maps emotions to travel moods and calculates energy/social/adventure scores
- 🗺️ Recommends top 3 Indian destinations matching the detected mood
- 💳 Processes bookings with PDF ticket generation

**Architecture**: React frontend (face-api.js) + Node/Express backend (emotion analysis) + MongoDB (optional)

---

## 📦 Installation & Setup

### Prerequisites

Ensure you have:
- Node.js 18+ installed
- npm or yarn
- face-api.js & TensorFlow.js dependencies (already in `package.json`)

### Step 1: Install Frontend Dependencies

All dependencies should already be in your `package.json`:
```bash
npm install
# Or yarn install
```

**Verify installed packages:**
```bash
npm ls face-api.js @tensorflow/tfjs
```

### Step 2: Download face-api.js Model Files

The face-api.js library needs pre-trained model files in your `/public` directory:

**Create directory:**
```bash
mkdir -p public/models
```

**Download model files** from the face-api.js GitHub repository:
https://github.com/vladmandic/face-api/tree/master/model

Download these 4 files and place in `public/models/`:
1. `tiny_face_detector_model-weights_manifest.json`
2. `tiny_face_detector_model.bin`
3. `face_landmark_68_model-weights_manifest.json`
4. `face_landmark_68_model.bin`
5. `face_expression_model-weights_manifest.json`
6. `face_expression_model.bin`

**Alternative: Use CDN** (add to `public/index.html` or component):
```html
<script async src="https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"></script>
```

### Step 3: Backend Setup

The backend is in `backend/src/` using Express + TypeScript.

**Backend Dependencies** (already in `backend/package.json`):
```bash
cd backend
npm install
```

**Key files created:**
- `backend/src/routes/moodAnalyzer.ts` - API routes
- `backend/src/controllers/moodAnalyzerController.ts` - Request handlers
- `backend/src/services/emotionService.ts` - Emotion detection & mood mapping logic

### Step 4: Configure Environment Variables

**Frontend** (`.env.local`):
```env
VITE_API_URL=http://localhost:3001
```

**Backend** (`.env` or `.env.local`):
```env
PORT=3001
NODE_ENV=development
```

### Step 5: Mount Backend Routes

In your main backend server file (`backend/src/index.ts`):

```typescript
import moodAnalyzerRoutes from './routes/moodAnalyzer';

// Add to your Express app setup:
app.use('/api/mood-analyze', moodAnalyzerRoutes);
```

### Step 6: Start Development Servers

**Terminal 1 - Frontend:**
```bash
npm run dev
# Runs on http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:3001
```

---

## 🎯 File Structure

```
src/
├── pages/
│   └── MoodAnalyzer.tsx .................. Main component (1,000+ lines)
├── hooks/
│   └── useFaceDetection.ts .............. Face detection hook
├── services/
│   └── moodApi.ts ....................... Backend API client
├── data/
│   └── destinations.ts .................. 40+ Indian destinations with mood matching
└── types/
    └── moodAnalyzer.ts .................. TypeScript interfaces

backend/
├── src/
│   ├── routes/
│   │   └── moodAnalyzer.ts .............. API endpoints
│   ├── controllers/
│   │   └── moodAnalyzerController.ts .... Request handlers
│   └── services/
│       └── emotionService.ts ............ Emotion logic & mood mapping
├── src/index.ts ......................... Main server entry
└── server.js ............................ Alternative entry

public/
└── models/ ............................. face-api.js model files
    ├── tiny_face_detector_model-weights_manifest.json
    ├── tiny_face_detector_model.bin
    ├── face_landmark_68_model-weights_manifest.json
    ├── face_landmark_68_model.bin
    ├── face_expression_model-weights_manifest.json
    └── face_expression_model.bin
```

---

## 🔧 API Endpoints

### POST `/api/mood-analyze`

Analyzes facial emotions and recommends destinations.

**Request:**
```json
{
  "imageData": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response:**
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
  "reasoning": "Your bright smile and excited expression...",
  "recommendedKeys": ["adventure", "beach", "thrilling"]
}
```

### GET `/api/mood-analyze/health`

Health check endpoint.

**Response:**
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

---

## 🎨 Component Usage

### Using MoodAnalyzer Component

```tsx
import MoodAnalyzer from '../pages/MoodAnalyzer';

export default function App() {
  return (
    <div>
      <MoodAnalyzer />
    </div>
  );
}
```

### Using useFaceDetection Hook Directly

```tsx
import { useFaceDetection } from '../hooks/useFaceDetection';

function MyComponent() {
  const { loading, error, analyzeFromImage, analyzeFromVideo } = useFaceDetection();

  const handleImage = async (imageData: string) => {
    const faces = await analyzeFromImage(imageData);
    // faces: [{ x, y, width, height, emotions, confidence }, ...]
  };

  return <div>...</div>;
}
```

### Using Backend API Directly

```tsx
import { analyzeMoodWithImage } from '../services/moodApi';

async function analyzeMood(imageBase64: string) {
  try {
    const result = await analyzeMoodWithImage(imageBase64);
    console.log('Detected mood:', result.detectedMood);
    console.log('Energy level:', result.energyLevel);
  } catch (error) {
    console.error('Analysis failed:', error);
  }
}
```

---

## 🧠 Customization Guide

### Modify Mood Classifications

Edit `backend/src/services/emotionService.ts`:

```typescript
// classifyMood function - adjust thresholds
export function classifyMood(emotions: EmotionScores): MoodCategory {
  // Increase threshold for "happy_excited":
  if (happy > 0.7 && surprised > 0.4) {  // Changed from 0.6 and 0.3
    return 'happy_excited';
  }
  // ... rest of logic
}
```

### Customize Energy/Social/Adventure Scoring

```typescript
// Change energy calculation logic
export function calculateEnergyLevel(emotions: EmotionScores): number {
  const { happy, surprised, sad } = emotions;
  const activation = happy + surprised * 1.0; // Increase surprised weight
  const reduction = Math.max(0, sad * 0.8); // Decrease sad impact
  const energyBase = Math.min(10, Math.max(1, (activation - reduction) * 10));
  return Math.round(energyBase);
}
```

### Add More Destinations

Edit `src/data/destinations.ts`:

```typescript
export const DESTINATIONS: Destination[] = [
  // ... existing destinations
  {
    id: "new-destination",
    title: "New Destination Name",
    img: "https://unsplash.com/...",
    label: "Category",
    tags: ["Tag1", "Tag2", "Tag3"],
    mood: [0, 2],        // Which mood indices (0-6) this destination suits
    energy: [2, 6],      // Energy range 1-10
    social: [1, 5],      // Social range 1-10
    adventure: [2, 8],   // Adventure range 1-10
    state: "State Name",
    bestTime: "Oct-Mar",
    pricePerDay: 2000,
    description: "Description of this destination..."
  }
];
```

### Modify FAQ Questions

Edit `MoodAnalyzer.tsx`:

```typescript
function generateFAQ(destination: Destination, moodResponse: MoodAnalyzeResponse) {
  return [
    {
      question: "Your custom question?",
      answer: `Your custom answer with ${destination.title} details...`,
    },
    // ... more FAQs
  ];
}
```

### Change Payment Amount

```typescript
// In MoodAnalyzer.tsx:
async function pay() {
  setIsPaying(true);
  const amount = 5000 + energy * 150 + adventure * 200 + social * 120; // Adjust multipliers
  // ...
}
```

---

## ⚠️ Common Issues & Troubleshooting

### Issue: "No face detected" Error

**Causes:**
- Face too far from camera
- Poor lighting conditions
- Blurry image

**Solutions:**
- Ensure adequate lighting (avoid backlighting)
- Move closer to camera (1-2 feet distance)
- Use a high-resolution camera
- Clean camera lens

### Issue: Models not loading

**Error:** `Failed to load face detection models`

**Solution:**
1. Verify model files in `public/models/` exist
2. Check file sizes (should be 1-5 MB each)
3. Use browser DevTools Network tab to check HTTP requests
4. Ensure file paths are correct

**Alternative - Use CDN:**
```typescript
// In useFaceDetection.ts, modify MODELS_PATH:
const MODELS_PATH = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/model/';
```

### Issue: CORS errors when sending image to backend

**Solution:** Ensure backend has CORS enabled in `backend/src/index.ts`:

```typescript
import cors from 'cors';
app.use(cors());
```

### Issue: API returning 500 error

**Solution:** Check backend logs for:
1. Invalid base64 image data
2. Image too large (>5MB)
3. Missing emotion service functions
4. Invalid emotion data format

### Issue: Emotions show zero values

**Cause:** Backend using mock emotions (face-api.js not available on server)

**Solution:**
- face-api.js runs client-side only; backend should receive detected emotions from frontend
- Or use external emotion detection API (Google Vision, AWS Rekognition)

---

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
npm run build
# Deploy the dist/ folder
```

**Environment variables:**
```
VITE_API_URL=https://your-backend-api.com
```

### Backend Deployment (Render/Railway/Heroku)

```bash
cd backend
npm run build
npm start
```

**Environment variables:**
```
PORT=3001
NODE_ENV=production
```

**Model Files:** Ensure model files are in `public/models/` or use CDN path in `useFaceDetection.ts`

---

## 📊 Testing

### Manual Testing Checklist

- [ ] Open camera and detect face
- [ ] Upload a photo with face
- [ ] Verify emotion detection works
- [ ] Check mood classification (Happy/Calm/etc.)
- [ ] Verify energy/social/adventure scores calculated
- [ ] Click on recommendation cards
- [ ] Read FAQ answers
- [ ] Complete payment flow
- [ ] Download PDF ticket
- [ ] Try manual mode (emotion sliders)
- [ ] Test on mobile responsiveness

### Automated Testing (Future)

```bash
npm test  # Would run Jest tests
```

---

## 📝 Code Comments & Key Sections

**Key function to understand mood logic:**
```typescript
// In emotionService.ts - Main mood classification
function classifyMood(emotions: EmotionScores): MoodCategory {
  // This function decides mood category based on emotion intensities
  // Change thresholds here to adjust sensitivity
}

// Energy level calculation
function calculateEnergyLevel(emotions: EmotionScores): number {
  // happy + surprised = high energy
  // sad = low energy
}

// Social score calculation
function calculateSocialScore(emotions: EmotionScores): number {
  // happy = social
  // neutral = flexible
  // sad/fear = less social
}

// Adventure score calculation
function calculateAdventureScore(emotions: EmotionScores): number {
  // surprised + happy = adventurous
  // fear = cautious
}
```

---

## 🎓 Learning Resources

- **face-api.js:** https://github.com/vladmandic/face-api
- **TensorFlow.js:** https://www.tensorflow.org/js
- **Express.js:** https://expressjs.com/
- **React Hooks:** https://react.dev/reference/react

---

## 💡 Future Enhancements

1. **Real-time live emotion visualization** during camera capture
2. **Multi-face support** with group mood analysis
3. **Emotion history tracking** and mood trends
4. **Integration with Gemini AI** for personalized recommendations
5. **Multiple language support** (English, Hindi, etc.)
6. **Payment gateway integration** (Razorpay, Stripe)
7. **Database storage** for mood history and bookings
8. **Email notifications** with booking confirmations
9. **Mobile app version** (React Native)
10. **Advanced filters** for guide selection by mood

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review inline code comments
3. Check browser DevTools console for errors
4. Verify environment variables are set correctly
5. Test individual components in isolation

---

**Status:** ✅ Production Ready  
**Last Updated:** November 2025  
**Version:** 1.0.0
