# 🏗️ DarShana Travel - Architecture Overview

## Current Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      END USER                                   │
│                   (Browser/Mobile)                              │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                            │
│        https://dar-shana-traveler-seven.vercel.app             │
│                                                                 │
│  • React 18 + TypeScript                                       │
│  • Vite v7.2.4 (build tool)                                    │
│  • Tailwind CSS v4                                             │
│  • Firebase Authentication                                     │
│  • i18next (English/Hindi)                                     │
│  • All Pages (Home, Register, Green Routes, etc)               │
│                                                                 │
│  Env: VITE_BACKEND_URL=<backend-url>                          │
│  Env: VITE_GEMINI_API_KEY=<key>                               │
│  Env: VITE_FIREBASE_CONFIG=<config>                           │
└────────────────────────┬────────────────────────────────────────┘
                         │ REST API (JSON)
                         │ POST /api/routes
                         │ GET /api/routes
                         │ GET /api/routes/:id
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                 BACKEND (To Deploy)                             │
│          Render.com / Railway.app / Heroku                     │
│                                                                 │
│  • Express.js (TypeScript)                                     │
│  • Node.js runtime                                             │
│  • 8 Transport Mode Calculations                               │
│  • Route optimization                                          │
│  • CO₂ emissions calculation                                   │
│  • Reward points system                                        │
│  • Winston logging                                             │
│  • Joi validation                                              │
│                                                                 │
│  Env: MONGODB_URI=<db-url>                                    │
│  Env: CORS_ORIGIN=<allowed-domains>                           │
│  Env: NODE_ENV=production                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │ Mongoose ODM
                         │ Query/Aggregation
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│               DATABASE (To Setup)                               │
│          MongoDB Atlas (Free Tier 512MB)                        │
│                                                                 │
│  Collections:                                                  │
│  • routes (calculated route options)                           │
│  • routehistories (user journey tracking)                      │
│  • emissionstats (aggregated data)                            │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow: Green Route Planner

```
1. USER ENTERS ROUTE
   From: "New Delhi"
   To: "Jaipur"
         │
         ▼
2. FRONTEND VALIDATES INPUT
   • Check non-empty
   • Check not identical
   • Show loading spinner
         │
         ▼
3. FRONTEND SENDS REQUEST
   POST /api/routes
   {
     "from": "New Delhi",
     "to": "Jaipur"
   }
         │
         ▼
4. BACKEND PROCESSES
   ✓ Validate locations
   ✓ Calculate distance (Haversine)
   ✓ Generate 8 transport options
   ✓ Calculate for each:
     - Estimated time
     - Cost in ₹
     - CO₂ emissions
     - Reward points
     - Sustainability score
         │
         ▼
5. BACKEND STORES IN MONGODB
   • Save route record
   • Add to history
   • Update statistics
         │
         ▼
6. BACKEND RETURNS RESPONSE
   {
     "success": true,
     "data": {
       "routes": [
         {
           "transportMode": "Train",
           "estimatedTime": "2h 30m",
           "distance": 250,
           "cost": 250,
           "co2Emissions": 10.25,
           "sustainability": {
             "score": 9,
             "isEcoChoice": true
           },
           "rewardPoints": 45
         },
         ... (7 more options)
       ]
     }
   }
         │
         ▼
7. FRONTEND DISPLAYS RESULTS
   • Grid of 8 transport options
   • Shows time, distance, cost
   • Shows CO₂ with visual scale
   • Shows reward points
   • Highlights "Eco Choice" badge
   • Green sustainability bar
         │
         ▼
8. USER SEES COMPARISON
   ✓ Train: 10 kg CO₂ (best choice)
   ✓ Bus: 22 kg CO₂ (good)
   ✓ Metro: 10 kg CO₂ (eco choice)
   ✗ Flight: 64 kg CO₂ (high impact)
   (etc for all 8 modes)
```

## Environment Variables Checklist

### Frontend (Vercel)
```
VITE_BACKEND_URL=https://your-backend.onrender.com  (Production only)
VITE_GEMINI_API_KEY=AIzaSy...                        (From Google Cloud)
VITE_FIREBASE_CONFIG={...}                           (From Firebase)
```

### Backend (Render/Railway/Heroku)
```
MONGODB_URI=mongodb+srv://user:pass@cluster...      (From MongoDB Atlas)
CORS_ORIGIN=http://localhost:5173,https://dar-...  (Allowed frontend URLs)
NODE_ENV=production
```

### Database (MongoDB Atlas)
```
Create free cluster
Get connection string
Whitelist IP addresses
```

## Deployment Timeline

```
Timeline          Task                    Time      Total
────────────────────────────────────────────────────────────
Now → +2 min      Create Render account   2 min     2 min
      +3 min      Deploy backend          3 min     5 min
      +10 min     Wait for deploy         10 min    15 min
      +2 min      Create MongoDB Atlas    2 min     17 min
      +3 min      Get connection string   3 min     20 min
      +5 min      Set env variables       5 min     25 min
      +5 min      Update Vercel config    5 min     30 min
      DONE!       Everything works!
```

## Feature Breakdown

### 8 Transport Modes

| Mode | CO₂/km | Best For | Cost |
|------|--------|----------|------|
| 🚂 Train | 0.041 | Long distance | ₹ Low |
| 🚌 Bus | 0.089 | Medium distance | ₹ Low |
| 🚇 Metro | 0.04 | City travel | ₹ Very Low |
| 🚴 Bike | 0.11 | Short distance | ₹ None |
| ⚡ E-Car | 0.05 | Quick travel | ₹ Medium |
| 🚕 Cab | 0.21 | Convenient | ₹ High |
| 🚗 Car | 0.21 | Long distance | ₹ High |
| ✈️ Flight | 0.255 | Very long | ₹ Varies |

### Sustainability Scoring

```
CO₂ per km vs Average
    ▲
10  │     Train (9/10) ✅ Eco
    │ Metro (9/10)  ✅ Eco
 8  │ Bus (7/10)
    │ E-Car (8/10)
 6  │ Bike (7/10)
    │
 4  │ Car (4/10)
    │ Cab (4/10)
 2  │ Flight (2/10)
    │
  0 └─────────────────────
      0   50  100  150  200  250
           CO₂ per 100km
```

### Reward Points Algorithm

```
Base Points = (Distance / 100) × 10

Eco Multiplier:
  • Train: 4.5x (most eco-friendly)
  • Metro: 4.5x
  • Bus: 2.5x
  • E-Car: 4x
  • Bike: 3.5x
  • Cab: 1x
  • Car: 1x
  • Flight: 0.5x (penalized)

Bonus:
  • If cost < ₹500: +5 points
  • If time saved: +10 points
```

## Example: Delhi to Jaipur (250 km)

### Train Option
```
Mode: 🚂 Train
Time: 2 hours 45 minutes
Distance: 250 km
Cost: ₹250
CO₂: 10.25 kg
Sustainability: 9/10 ✅ ECO CHOICE
Rewards: 45 points 🎁
Carbon Saved: 42.25 kg vs car
Cost Saved: ₹2,500 vs taxi
```

### Flight Option
```
Mode: ✈️ Flight
Time: 1 hour 15 minutes
Distance: 250 km
Cost: ₹4,500
CO₂: 63.75 kg
Sustainability: 2/10 ⚠️ HIGH IMPACT
Rewards: 5 points (penalized)
Carbon Added: +53.5 kg vs train
Cost Added: ₹4,250 extra
```

## Security & CORS

### CORS Configuration
```
Allowed Origins:
  • http://localhost:5173 (local dev)
  • https://dar-shana-traveler-seven.vercel.app (production)
  • https://darshana-traveler.vercel.app (alternate)

All cross-origin requests validated
Credentials allowed only from trusted origins
```

### Data Privacy
- Routes not personally identified
- Location data not stored
- Only aggregated statistics saved
- GDPR compliant

## Monitoring & Logging

### Backend Logging (Winston)
```
Log Levels:
  • error: API failures, exceptions
  • warn: Missing data, validation issues
  • info: Route calculations, requests
  • debug: Database queries, detailed flow
```

### Vercel Monitoring
```
View in Vercel Dashboard:
  • Request logs
  • Error rate
  • Performance metrics
  • Build history
```

### MongoDB Monitoring
```
View in MongoDB Atlas:
  • Collection sizes
  • Query performance
  • Index usage
  • Replication status
```

---

**This is the complete architecture for your production-ready sustainable travel app!** 🌍
