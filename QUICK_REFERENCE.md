# 🚀 Green Routes Backend - Quick Reference

## 5-Minute Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

MongoDB running? → Visit `http://localhost:5000/health`

---

## API Endpoints

### 1. Calculate Routes (Most Important)
```bash
POST /api/routes
Content-Type: application/json

{
  "from": "New Delhi",
  "to": "Jaipur"
}
```

**Returns:** Multiple transport options with CO2, cost, time, sustainability score, rewards

### 2. Get History
```bash
GET /api/routes?limit=10&skip=0
```

### 3. Get Stats
```bash
GET /api/routes/stats/summary
```

### 4. Health Check
```bash
GET /health
```

---

## File Locations

| File | Purpose |
|------|---------|
| `backend/src/index.ts` | Server entry point |
| `backend/src/services/routeService.ts` | Route generation (8+ modes) |
| `backend/src/utils/emissions.ts` | CO2 calculations |
| `backend/src/utils/rewards.ts` | Reward points algorithm |
| `backend/README_GREEN_ROUTES.md` | Full documentation |
| `backend/SETUP_GUIDE.md` | Setup instructions |

---

## Supported Transport Modes

| Mode | Score | CO2/km |
|------|-------|--------|
| 🚂 Train | 8/10 | 0.041 |
| 🚌 Bus | 7/10 | 0.089 |
| 🚇 Metro | 8/10 | 0.04 |
| 🚗 Car | 3/10 | 0.21 |
| ⚡ E-Car | 9/10 | 0.05 |
| 🏍️ Bike | 9/10 | 0.11 |
| 🛫 Flight | 2/10 | 0.255 |
| 🚕 Cab | 3/10 | 0.21 |

---

## Environment Variables

```env
# Required
MONGODB_URI=mongodb://localhost:27017/darshana-travel

# Optional but recommended
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info
```

---

## Database Models

1. **Route** - Calculated routes with all options
2. **RouteHistory** - User journey history
3. **EmissionStats** - Aggregated emission data

All indexed for fast queries.

---

## Supported Cities (Pre-configured)

- New Delhi
- Mumbai
- Bangalore
- Hyderabad
- Pune
- Jaipur
- Kolkata
- Chennai
- Agra
- Goa
- Kerala
- And more...

---

## Error Handling

All responses follow this format:

**Success:**
```json
{ "success": true, "data": {...} }
```

**Error:**
```json
{ "success": false, "error": "Message" }
```

---

## Common Issues

| Issue | Fix |
|-------|-----|
| No MongoDB | Run `mongod` or use Atlas URI |
| Port 5000 in use | Change PORT in `.env` |
| CORS blocked | Update CORS_ORIGIN in `.env` |
| Module not found | Run `npm install` |

---

## Testing Locally

```bash
# Test with cURL
curl -X POST http://localhost:5000/api/routes \
  -H "Content-Type: application/json" \
  -d '{"from":"New Delhi","to":"Jaipur"}'

# Or use Postman/Insomnia
```

---

## Production Deploy

```bash
npm run build
NODE_ENV=production npm start
```

---

## Next Steps

1. ✅ Backend running
2. ✅ Test `/api/routes` endpoint
3. → Connect frontend (update Sustainable.tsx)
4. → Add user authentication
5. → Deploy to production

---

## Key Files to Understand

1. **index.ts** - Server setup, middleware, routes
2. **routeService.ts** - Route generation logic (where magic happens)
3. **emissions.ts** - CO2 calculations
4. **rewards.ts** - Reward algorithm
5. **Route.ts** - Database schema

---

## Calculations Summary

```
CO2 = distance × emission_factor ÷ passengers
Score = base_score - (emissions_penalty)
Rewards = distance × sustainability × emissions × mode_bonus
Cost = distance × cost_per_km
Time = distance ÷ average_speed
```

---

**For full documentation, see `backend/README_GREEN_ROUTES.md`**

🌍 **Happy sustainable traveling!**
