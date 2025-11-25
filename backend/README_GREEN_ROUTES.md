# 🌍 DarShana Green Routes - Backend Service

A **production-ready Node.js + Express + MongoDB backend** for sustainable travel route planning. Calculates eco-friendly transportation options with real-time CO2 emissions, cost estimates, sustainability scoring, and reward points.

## 📋 Features

✅ **Multiple Transport Modes** - Flight, Train, Bus, Car, Electric Car, Metro, Bike, Cab
✅ **CO2 Emissions Calculation** - Real-world Indian transport factors
✅ **Sustainability Scoring** - 1-10 scale based on emissions and mode
✅ **Reward Points Algorithm** - Gamified eco-friendly travel
✅ **Cost Estimation** - Realistic pricing for each transport mode
✅ **Distance Calculation** - Haversine formula + OpenRouteService fallback
✅ **Route Caching** - MongoDB for fast lookups
✅ **Error Handling** - Comprehensive error responses
✅ **Logging** - Winston logger with file persistence
✅ **TypeScript** - Fully typed backend
✅ **CORS Support** - Frontend integration ready

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts         # MongoDB connection
│   │   └── environment.ts      # Environment variables
│   ├── models/
│   │   ├── Route.ts            # Route schema
│   │   ├── RouteHistory.ts     # Journey history
│   │   └── EmissionStats.ts    # Emission statistics
│   ├── services/
│   │   └── routeService.ts     # Route generation logic
│   ├── controllers/
│   │   └── routeController.ts  # API handlers
│   ├── routes/
│   │   └── routes.ts           # Express routes
│   ├── utils/
│   │   ├── emissions.ts        # CO2 calculations
│   │   ├── rewards.ts          # Reward algorithm
│   │   ├── routing.ts          # Distance + routing
│   │   └── logger.ts           # Winston logger
│   └── index.ts                # Main server file
├── .env.example                # Environment template
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
└── README.md                   # This file
```

## 🚀 Quick Start

### 1. **Install Dependencies**

```bash
cd backend
npm install
```

### 2. **Setup Environment Variables**

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/darshana-travel
CORS_ORIGIN=http://localhost:5173
```

### 3. **Start MongoDB** (Local or Atlas)

**Local MongoDB:**
```bash
mongod --dbpath ./data
```

**Or use MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/darshana-travel
```

### 4. **Run Development Server**

```bash
npm run dev
```

Server starts on `http://localhost:5000`

### 5. **Build for Production**

```bash
npm run build
npm start
```

## 📚 API Documentation

### Calculate Sustainable Routes

**Endpoint:** `POST /api/routes`

**Request:**
```json
{
  "from": "New Delhi",
  "to": "Jaipur"
}
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
      },
      {
        "mode": "Flight",
        "time": "1h 15m",
        "distance": 220,
        "cost": 450,
        "co2": 56.1,
        "greenScore": 2.0,
        "rewards": -45,
        "description": "Fast option for long distances..."
      }
    ]
  }
}
```

### Get Route History

**Endpoint:** `GET /api/routes?limit=10&skip=0`

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 156,
    "limit": 10,
    "skip": 0
  }
}
```

### Get Route Details

**Endpoint:** `GET /api/routes/:id`

### Get Statistics

**Endpoint:** `GET /api/routes/stats/summary`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRoutes": 156,
    "totalDistancePlanned": 38950,
    "totalEmissionsSaved": 12450,
    "averageDistancePerRoute": 250
  }
}
```

## 🧮 Calculation Formulas

### CO2 Emissions (kg per km)

| Mode | Factor | Notes |
|------|--------|-------|
| Flight | 0.255 | Includes RFI multiplier |
| Train | 0.041 | Indian Railways average |
| Bus | 0.089 | Fully occupied |
| Car | 0.21 | Petrol vehicle |
| E-Car | 0.05 | Grid electricity |
| Metro | 0.04 | Urban transit |
| Bike | 0.11 | Two-wheeler |
| Cab | 0.21 | Petrol taxi |

**Formula:** `emissions = distance × factor ÷ passengers`

### Sustainability Score (1-10)

- **Train:** 8/10
- **Bus:** 7/10
- **E-Car:** 9/10
- **Metro:** 8/10
- **Bike:** 9/10
- **Car:** 3/10
- **Cab:** 3/10
- **Flight:** 2/10

**Adjusted by:** emissions penalty (0-3 points)

### Reward Points

```
base = distance (1 point per km)
sustainability_multiplier = 1 + (score / 10)
emission_bonus = max(0, 100 - co2) / 50
mode_bonus = -0.5 to +0.6 depending on mode
total = base × sustainability × emission × mode
```

## 🔑 Environment Variables

```env
# Server
NODE_ENV=development|production
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/darshana-travel

# Caching
REDIS_URL=redis://localhost:6379 (optional)
CACHE_TTL=3600
USE_CACHE=false

# External APIs
ENABLE_EXTERNAL_APIS=false|true
OPENROUTESERVICE_KEY=your-api-key
AVIATIONSTACK_KEY=your-api-key
GOOGLE_MAPS_KEY=your-api-key

# Logging
LOG_LEVEL=info|debug|error

# Frontend
CORS_ORIGIN=http://localhost:5173
```

## 🔌 API Integration Points

### External Services (Optional)

1. **OpenRouteService** - Road distance calculation
   - API Key: https://openrouteservice.org/
   - Fallback: Haversine formula

2. **Aviationstack** - Flight data (future)
   - API Key: https://aviationstack.com/
   - Fallback: Distance-based estimation

3. **Google Maps** - Location geocoding (future)
   - API Key: Google Cloud Console
   - Fallback: City database lookup

## 📊 Supported Cities

Major Indian cities with pre-loaded coordinates:

- New Delhi, Delhi
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

*Add more cities in `routing.ts` → `getCityCoordinates()`*

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run linter
npm run lint
```

## 📦 Deployment

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install --production
RUN npm run build
CMD npm start
```

```bash
docker build -t darshana-green .
docker run -p 5000:5000 darshana-green
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/darshana
CORS_ORIGIN=https://darshana.com
LOG_LEVEL=error
ENABLE_EXTERNAL_APIS=true
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```
❌ MongooseError: Cannot connect to MongoDB
```
**Solution:** Ensure MongoDB is running or update `MONGODB_URI`

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:** Change PORT in `.env` or kill process on port 5000

### CORS Error
```
Access to XMLHttpRequest from origin 'http://localhost:3000' has been blocked
```
**Solution:** Update `CORS_ORIGIN` in `.env` to match frontend origin

### TypeScript Compilation Error
```bash
npm run build
```

## 📈 Performance Optimization

1. **Caching:** Enable Redis for route results
   ```env
   USE_CACHE=true
   REDIS_URL=redis://localhost:6379
   ```

2. **Database Indexing:** Already configured on route queries

3. **Pagination:** Use `limit` and `skip` parameters

4. **Logging:** Disable debug logs in production
   ```env
   LOG_LEVEL=error
   ```

## 🔒 Security Considerations

- ✅ Environment variables for sensitive data
- ✅ CORS configuration
- ✅ Input validation with Joi
- ✅ Error message sanitization
- ✅ Request logging
- ⚠️ TODO: Rate limiting
- ⚠️ TODO: Authentication (JWT)
- ⚠️ TODO: Data encryption

## 📝 Example Integration (Frontend)

```typescript
// React Component
const fetchRoutes = async (from: string, to: string) => {
  const response = await fetch('http://localhost:5000/api/routes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to })
  });
  
  const data = await response.json();
  setRoutes(data.data.options);
};
```

## 🚀 Future Enhancements

- [ ] Real-time flight data integration
- [ ] Train booking API
- [ ] User authentication & profiles
- [ ] Journey history tracking
- [ ] Reward redemption system
- [ ] Carbon offset calculator
- [ ] Real-time traffic data
- [ ] Multi-modal journey recommendations
- [ ] WebSocket for live updates
- [ ] Mobile app backend API

## 📞 Support

For issues or questions:
1. Check logs: `logs/error.log`
2. Review `.env` configuration
3. Ensure MongoDB is running
4. Check frontend CORS settings

## 📄 License

MIT License - See LICENSE file

---

**Built with ❤️ for sustainable travel** 🌍
