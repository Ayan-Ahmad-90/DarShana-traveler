# Green Routes Backend - Quick Setup Guide

## ✅ 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/darshana-travel
CORS_ORIGIN=http://localhost:5173
```

### Step 3: Start MongoDB
```bash
# Option A: Local MongoDB
mongod --dbpath ./data

# Option B: MongoDB Atlas (update MONGODB_URI in .env)
```

### Step 4: Run Server
```bash
npm run dev
```

✅ Server running: `http://localhost:5000`

---

## 🧪 Test API

### Using cURL

```bash
# Calculate routes
curl -X POST http://localhost:5000/api/routes \
  -H "Content-Type: application/json" \
  -d '{"from":"New Delhi","to":"Jaipur"}'

# Get route history
curl http://localhost:5000/api/routes

# Get statistics
curl http://localhost:5000/api/routes/stats/summary
```

### Using Postman

1. **Import Collection:**
   ```json
   {
     "info": {
       "name": "Green Routes API",
       "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
     },
     "item": [
       {
         "name": "Calculate Routes",
         "request": {
           "method": "POST",
           "header": [{"key": "Content-Type", "value": "application/json"}],
           "url": {"raw": "http://localhost:5000/api/routes", "protocol": "http", "host": ["localhost"], "port": "5000", "path": ["api", "routes"]},
           "body": {"mode": "raw", "raw": "{\"from\":\"New Delhi\",\"to\":\"Jaipur\"}"}
         }
       }
     ]
   }
   ```

### Using Insomnia

Create a POST request to `http://localhost:5000/api/routes` with JSON body:
```json
{
  "from": "New Delhi",
  "to": "Jaipur"
}
```

---

## 📊 API Examples

### Example 1: Delhi → Jaipur (250 km)

**Request:**
```bash
curl -X POST http://localhost:5000/api/routes \
  -H "Content-Type: application/json" \
  -d '{"from":"New Delhi","to":"Jaipur"}'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "from": "New Delhi",
    "to": "Jaipur",
    "distance": 238.4,
    "options": [
      {
        "mode": "Train",
        "time": "3h 30m",
        "distance": 250,
        "cost": 125,
        "co2": 10.25,
        "greenScore": 8.2,
        "rewards": 245,
        "description": "Comfortable journey with meals..."
      },
      {
        "mode": "Bus",
        "time": "4h 45m",
        "distance": 238,
        "cost": 95,
        "co2": 21.2,
        "greenScore": 7.1,
        "rewards": 180,
        "description": "Affordable and eco-friendly..."
      }
    ]
  }
}
```

### Example 2: Mumbai → Bangalore (800 km)

**Request:**
```bash
curl -X POST http://localhost:5000/api/routes \
  -H "Content-Type: application/json" \
  -d '{"from":"Mumbai","to":"Bangalore"}'
```

**Response:** Includes Flight, Train, Bus options

### Example 3: Get Statistics

**Request:**
```bash
curl http://localhost:5000/api/routes/stats/summary
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRoutes": 42,
    "totalDistancePlanned": 15000,
    "totalEmissionsSaved": 8500,
    "averageDistancePerRoute": 357
  }
}
```

---

## 🔍 Supported Cities

- New Delhi / Delhi
- Mumbai
- Bangalore
- Hyderabad
- Pune
- Jaipur
- Ahmedabad
- Kolkata
- Chennai
- Agra
- Varanasi
- Goa
- Kerala
- Rajasthan

---

## 📦 Project Structure

```
backend/src/
├── config/           # Database & environment setup
├── models/           # MongoDB schemas
├── services/         # Business logic (route generation)
├── controllers/      # API request handlers
├── routes/           # Express route definitions
├── utils/            # Helper functions
│   ├── emissions.ts  # CO2 calculations
│   ├── rewards.ts    # Points algorithm
│   ├── routing.ts    # Distance calculations
│   └── logger.ts     # Logging setup
└── index.ts          # Server entry point
```

---

## 🐛 Common Issues

### Issue: Cannot find module 'express'
```bash
npm install
npm run build
```

### Issue: MongoDB connection timeout
- Ensure MongoDB is running: `mongod`
- Or update MONGODB_URI to Atlas connection string

### Issue: CORS error from frontend
Update `.env`:
```env
CORS_ORIGIN=http://your-frontend-url:port
```

### Issue: Port 5000 already in use
```env
PORT=5001  # Change to different port
```

---

## 📱 Frontend Integration

```typescript
// src/services/sustainableService.ts
export const fetchRoutes = async (from: string, to: string) => {
  const response = await fetch('http://localhost:5000/api/routes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to })
  });
  
  const data = await response.json();
  if (data.success) {
    return data.data;
  }
  throw new Error(data.error);
};
```

---

## 🚀 Deployment Checklist

- [ ] Update `.env` with production values
- [ ] Set `NODE_ENV=production`
- [ ] Configure MongoDB Atlas
- [ ] Enable external APIs if needed
- [ ] Setup SSL/HTTPS
- [ ] Configure CORS for production domain
- [ ] Setup logging to persistent storage
- [ ] Setup database backups
- [ ] Monitor error logs

---

## 📞 Next Steps

1. Test all endpoints locally
2. Connect frontend to backend
3. Verify route calculations
4. Add user authentication (future)
5. Deploy to production

---

**Happy sustainable traveling! 🌍**
