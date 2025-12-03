# Travel Hub Installation & Complete Setup Guide

## 🎯 Overview

This guide will walk you through setting up the complete Travel Hub platform from scratch.

## ✅ Prerequisites

- **Node.js** v18+ (download from nodejs.org)
- **npm** (comes with Node.js)
- **Git** (optional, for version control)
- **MongoDB Atlas account** (free tier available at mongodb.com)
- **Text Editor** (VS Code recommended)

## 📋 Step-by-Step Installation

### Phase 1: Project Setup

#### 1.1 Navigate to Project Directory

```bash
cd c:\Users\Dell\OneDrive\Desktop\DarShana-travel
```

#### 1.2 Verify Project Structure

```bash
# Should see:
# - src/          (React frontend)
# - server/       (Express backend)
# - package.json  (Frontend dependencies)
```

### Phase 2: Frontend Setup

#### 2.1 Install Frontend Dependencies

```bash
# In project root directory
npm install
```

This installs:
- React 19
- TypeScript
- Tailwind CSS
- React Router
- Lucide Icons
- Vite

#### 2.2 Create Frontend Environment File

Create `.env.production` in the root directory:

```env
VITE_BACKEND_URL=http://localhost:3001/api
```

For production deployment, change to:
```env
VITE_BACKEND_URL=https://your-backend-url.com/api
```

#### 2.3 Start Frontend Dev Server

```bash
npm run dev
```

Output:
```
  VITE v7.2.4  ready in 1482 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Visit http://localhost:5173 in your browser ✅

### Phase 3: Backend Setup

#### 3.1 Navigate to Server Directory

```bash
cd server
```

#### 3.2 Install Backend Dependencies

```bash
npm install
```

This installs:
- Express.js
- MongoDB/Mongoose
- JWT
- bcryptjs
- Joi
- TypeScript
- Testing libraries (Jest, Supertest)

#### 3.3 Setup MongoDB Atlas

1. Go to **mongodb.com** and create account
2. Create a new project (free tier)
3. Create a cluster
4. Add IP whitelist: **0.0.0.0/0** (for development)
5. Create database user with credentials
6. Copy connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/darshana-travel?retryWrites=true&w=majority
   ```

#### 3.4 Create Backend Environment File

Create `.env.local` in `/server` directory:

```env
# Server
PORT=3001
NODE_ENV=development

# Database - REPLACE WITH YOUR MONGODB CONNECTION STRING
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/darshana-travel?retryWrites=true&w=majority

# Authentication - Change this to a random secret!
JWT_SECRET=your_super_secret_key_at_least_32_characters_long_for_production
JWT_EXPIRE=7d

# CORS (allows frontend to access backend)
CORS_ORIGIN=http://localhost:5173
```

#### 3.5 Test Database Connection

```bash
# Still in /server directory
npm run dev
```

You should see:
```
MongoDB connected successfully
✅ Server started on http://localhost:3001
```

If you see connection error:
- Check MongoDB connection string
- Verify IP whitelist (0.0.0.0/0)
- Verify username/password don't have special characters that need encoding

### Phase 4: API Testing

#### 4.1 Test Server Health

```bash
curl http://localhost:3001/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-10T...",
  "uptime": 123.45
}
```

#### 4.2 Test User Registration

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

Success response:
```json
{
  "message": "User registered successfully",
  "userId": "user_id_here"
}
```

#### 4.3 Test Flight Search

```bash
curl "http://localhost:3001/api/flights/search?from=Delhi&to=Mumbai&date=2024-01-15&passengers=1"
```

Should return 4 mock flights with prices, times, airlines ✅

### Phase 5: Frontend-Backend Integration

#### 5.1 Verify API Service Configuration

Open `src/services/api.ts` and check:

```typescript
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api';
```

This should use your `.env.production` VITE_BACKEND_URL

#### 5.2 Test Frontend API Calls

1. Open http://localhost:5173 in browser
2. Navigate to Travel Hub page
3. Enter: From = "Delhi", To = "Mumbai", Date = "2024-01-15"
4. Click "Search & Compare"
5. Should see 4 mock flights with prices ✅

#### 5.3 Test User Registration

1. Click "Register" button
2. Fill in details
3. Click "Create Account"
4. Should see success message
5. Redirected to Login page ✅

#### 5.4 Test User Login

1. Use registered email/password
2. Should receive JWT token
3. Redirected to Travel Hub page ✅

### Phase 6: Run Tests

#### 6.1 Backend Tests

```bash
cd server
npm test
```

Should see:
```
PASS  tests/api.test.ts
  Authentication Tests
    ✓ should register a new user
    ✓ should login a user
  Flight Search Tests
    ✓ should search flights
  ✓ should return health status
```

### Phase 7: Production Build

#### 7.1 Build Frontend

```bash
# In project root
npm run build
```

Creates `/dist` folder with optimized production build

#### 7.2 Build Backend

```bash
cd server
npm run build
```

Creates `/dist` folder with compiled JavaScript

## 🚀 Deployment Guide

### Option 1: Deploy Frontend to Vercel

1. Push code to GitHub
2. Go to **vercel.com**
3. Connect GitHub repo
4. Set environment variable:
   ```
   VITE_BACKEND_URL=https://your-backend-api.com
   ```
5. Deploy (automatic on git push)

### Option 2: Deploy Backend to Render

1. Push code to GitHub
2. Go to **render.com**
3. New Web Service → Connect GitHub
4. Set Environment Variables:
   ```
   PORT=3001
   NODE_ENV=production
   MONGODB_URI=<your_mongodb_uri>
   JWT_SECRET=<your_secret>
   CORS_ORIGIN=https://your-frontend.vercel.app
   ```
5. Deploy

## 📁 File Structure Reference

```
DarShana-travel/
├── src/
│   ├── pages/
│   │   ├── TravelHub.tsx    ← Main search page
│   │   ├── Login.tsx        ← User login
│   │   ├── Register.tsx     ← User registration  
│   │   └── MyBookings.tsx   ← View bookings
│   ├── services/
│   │   └── api.ts           ← API calls
│   ├── context/
│   │   └── AuthContext.tsx  ← Auth state
│   └── App.tsx
│
├── server/
│   ├── src/
│   │   ├── index.ts         ← Express app
│   │   ├── routes/          ← API endpoints
│   │   ├── controllers/     ← Request handlers
│   │   ├── services/        ← Business logic
│   │   ├── models/          ← MongoDB schemas
│   │   └── middleware/      ← Auth, error handling
│   ├── tests/
│   └── package.json
│
├── package.json             ← Frontend deps
├── vite.config.ts
├── tsconfig.json
└── TRAVEL_HUB_README.md
```

## 🔐 Security Checklist

- [ ] Change JWT_SECRET to a strong random string (min 32 chars)
- [ ] Use environment variables for all secrets
- [ ] Never commit .env files to Git
- [ ] Use HTTPS in production
- [ ] Add rate limiting middleware
- [ ] Enable MongoDB authentication
- [ ] Set CORS_ORIGIN to specific domain in production
- [ ] Regularly update dependencies: `npm audit fix`

## 🐛 Troubleshooting

### Frontend issues

**Port 5173 already in use:**
```bash
# Kill the process or use different port
npm run dev -- --port 5174
```

**API not connecting:**
- Check VITE_BACKEND_URL in .env.production
- Ensure backend is running on port 3001
- Check browser console for CORS errors

**Module not found errors:**
```bash
# Clear cache and reinstall
rm -r node_modules package-lock.json
npm install
```

### Backend issues

**MongoDB connection fails:**
- Verify connection string format
- Check IP whitelist includes 0.0.0.0/0
- Test string in MongoDB Atlas directly

**Port 3001 already in use:**
```bash
# Find and kill process on port 3001
netstat -ano | findstr :3001  # Windows
kill -9 <PID>
```

**JWT errors:**
- Ensure JWT_SECRET is set
- Check token format in Authorization header
- Verify token hasn't expired

## ✨ Quick Reference Commands

```bash
# Frontend
npm install              # Install deps
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview build
npm run lint            # Check code

# Backend
cd server
npm install             # Install deps
npm run dev             # Start dev server (auto-reload)
npm run build           # Build for production
npm start               # Run production build
npm test                # Run tests
npm run test:watch     # Watch tests

# Common
git status              # Check changes
git add .
git commit -m "message"
git push origin main    # Push to GitHub
```

## 📊 Expected Output

### Frontend startup (npm run dev)
```
  VITE v7.2.4  ready in 1482 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Backend startup (npm run dev in server/)
```
✅ Server started on http://localhost:3001
📚 API Documentation:
   Flights: GET /api/flights/search?from=&to=&date=
   Trains: GET /api/trains/search?from=&to=&date=
   Bookings: POST /api/bookings
   Auth: POST /api/auth/register | POST /api/auth/login
```

## 🎓 Learning Resources

- React: https://react.dev
- Express: https://expressjs.com/
- MongoDB: https://docs.mongodb.com/
- JWT: https://jwt.io/
- Tailwind CSS: https://tailwindcss.com/

## ✅ Verification Checklist

- [ ] Node.js v18+ installed
- [ ] Frontend starts on http://localhost:5173
- [ ] Backend starts on http://localhost:3001
- [ ] MongoDB connected
- [ ] Flight search returns 4 results
- [ ] User registration works
- [ ] User login works
- [ ] API tests pass
- [ ] No console errors

## 🆘 Need Help?

If stuck:
1. Check error messages carefully
2. Verify all environment variables
3. Check MongoDB Atlas settings
4. Run npm tests
5. Check browser console (F12)
6. Check backend logs

---

**Setup Status:** 🚀 Ready to launch!

Next steps:
1. Follow the installation guide above
2. Test all API endpoints
3. Deploy to Vercel & Render
4. Start booking!
