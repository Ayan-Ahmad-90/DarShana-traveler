# 🌿 DarShana Travel - Green Route Planner Setup Guide

## Quick Start - Backend & Frontend

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or accessible via URI
- Gemini API key (for Assistant page)
- Firebase credentials (for authentication)

---

## 🚀 Backend Setup (Express + MongoDB)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Create `.env.local` in the `backend` directory:
```env
MONGODB_URI=mongodb://localhost:27017/darshana-travel
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
OPENROUTE_SERVICE_API_KEY=your_api_key_here
LOG_DIR=./logs
```

### 3. Build & Run
```bash
# Build TypeScript to JavaScript
npm run build

# Start the server
npm start
```

Server will be available at `http://localhost:5000`

### 4. Test the API
```bash
curl -X POST http://localhost:5000/api/routes \
  -H "Content-Type: application/json" \
  -d '{"from":"New Delhi","to":"Jaipur"}'
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "from": "New Delhi",
    "to": "Jaipur",
    "distance": 250,
    "options": [
      {
        "mode": "Train",
        "time": "5 hours",
        "distance": 250,
        "cost": 125,
        "co2": 10.25,
        "greenScore": 8.2,
        "rewards": 245,
        "description": "..."
      },
      {
        "mode": "Bus",
        "time": "6 hours",
        "distance": 275,
        "cost": 110,
        "co2": 24.5,
        "greenScore": 7.1,
        "rewards": 180,
        "description": "..."
      }
      // ... 6 more transport options
    ]
  }
}
```

---

## 🎨 Frontend Setup (React + Vite)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local` in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=darshana-travel.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=darshana-travel
VITE_FIREBASE_STORAGE_BUCKET=darshana-travel.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1038207736988
VITE_FIREBASE_APP_ID=1:1038207736988:web:26079c42051b95b3b46159
```

### 3. Run Development Server
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

---

## 📖 Features

### Green Route Planner (Sustainable Page)
- **Input:** Origin & destination cities
- **Output:** 8 transport options with:
  - ✈️ Mode (Flight, Train, Bus, Car, E-Car, Metro, Bike, Cab)
  - ⏱️ Travel time estimate
  - 💰 Cost in INR
  - 🌍 CO₂ emissions in kg
  - ⭐ Sustainability score (1-10)
  - 🎁 Reward points earned

### Supported Cities
- New Delhi, Mumbai, Bangalore, Hyderabad
- Chennai, Kolkata, Pune, Ahmedabad
- Jaipur, Lucknow, Chandigarh, Indore
- And 100+ other Indian cities

### Transport Modes
| Mode | Emissions | Cost | Speed | Eco Rating |
|------|-----------|------|-------|-----------|
| **Train** | 0.041 kg CO₂/km | ₹0.5/km | 60 km/h | ⭐⭐⭐⭐⭐ |
| **Bus** | 0.089 kg CO₂/km | ₹0.4/km | 40 km/h | ⭐⭐⭐⭐ |
| **E-Car** | 0.05 kg CO₂/km | ₹0.8/km | 80 km/h | ⭐⭐⭐⭐ |
| **Metro** | 0.04 kg CO₂/km | ₹0.3/km | 50 km/h | ⭐⭐⭐⭐⭐ |
| **Bike** | 0.11 kg CO₂/km | ₹0.6/km | 30 km/h | ⭐⭐⭐⭐ |
| **Car** | 0.21 kg CO₂/km | ₹1.5/km | 80 km/h | ⭐⭐⭐ |
| **Cab** | 0.21 kg CO₂/km | ₹2/km | 80 km/h | ⭐⭐⭐ |
| **Flight** | 0.255 kg CO₂/km | ₹3/km | 800 km/h | ⭐⭐ |

---

## 🔌 API Endpoints

### POST /api/routes
Calculate sustainable route options
- **Request:** `{ "from": "Delhi", "to": "Jaipur" }`
- **Response:** Array of 8 transport options with all details

### GET /api/routes
Get route history (paginated)
- **Params:** `limit=10&skip=0`

### GET /api/routes/:id
Get specific route details

### GET /api/routes/stats/summary
Get aggregate statistics

### GET /health
Server health check

---

## 🛠️ Troubleshooting

### Backend won't start
- **Check MongoDB:** Is it running on the configured port?
- **Check port 5000:** Is it already in use?
- **Check env vars:** MONGODB_URI set correctly?

### Frontend can't reach backend
- **Check CORS:** Backend has `CORS_ORIGIN=http://localhost:5173`
- **Check port:** Backend running on 5000?
- **Network:** Try `curl http://localhost:5000/health`

### Routes not calculating
- **Check cities:** Try "New Delhi" instead of "delhi"
- **Check backend:** Restart `npm start` in backend directory
- **Check errors:** Open browser DevTools → Network tab

---

## 📊 Calculation Formulas

### CO₂ Emissions
```
emissions = distance × emission_factor × (1 / passengers)
```

### Sustainability Score
```
score = 10 - (emissions / distance × 0.5)
```
*Capped between 1-10*

### Reward Points
```
points = distance × sustainability_multiplier × emission_bonus × mode_bonus
```

---

## 🚀 Production Deployment

### Backend (Render, Railway, Heroku)
1. Set environment variables in hosting platform
2. Build: `npm run build`
3. Start: `npm start`

### Frontend (Vercel, Netlify, GitHub Pages)
1. Build: `npm run build`
2. Deploy the `dist` folder
3. Update backend URL in code if needed

---

## 📝 License
MIT - Feel free to use and modify

---

**Made with ❤️ for sustainable travel in India**
