# 🚀 How to Run Travel Hub Locally

## Prerequisites
- Node.js v18+ installed
- MongoDB running locally OR MongoDB Atlas account
- Git (already cloned)

---

## Quick Start (3 Steps)

### Step 1: Install Dependencies (Frontend)
```bash
cd c:\Users\Dell\OneDrive\Desktop\DarShana-travel
npm install
```

### Step 2: Install Dependencies (Backend)
```bash
cd server
npm install
cd ..
```

### Step 3: Start Both Servers
```bash
# Terminal 1: Start Frontend
npm run dev

# Terminal 2 (New): Start Backend  
cd server
npm run dev
```

---

## Access the App
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

---

## First Time Setup

### 1. Create Account
- Go to http://localhost:5173/#/login
- Click "Sign Up" tab
- Fill in: Name, Email, Phone, Password
- Click "Register"
- **✨ You're auto-logged in!**

### 2. Complete Your Profile
- Click "My Profile" in sidebar
- Click "Edit Profile"
- Fill in additional fields (Gender, DOB, Address, etc.)
- Click "Save Changes"

### 3. Book a Trip
- Click "My Trips" in sidebar
- Fill in trip details
- Click "Book Trip"
- View your booking with ID

### 4. Subscribe to Festivals
- Click "Festival Alerts" in sidebar
- Select region
- Click "Subscribe" on festivals
- View subscriber count

### 5. Change Language
- Click "Language" in sidebar
- Select a language
- Language is saved automatically

---

## Troubleshooting

### "Cannot connect to MongoDB"
**Solution**: Make sure MongoDB is running
```bash
# On Windows with MongoDB installed:
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in server/.env with your connection string
```

### "Port 5173 already in use"
**Solution**: Stop other processes or use different port
```bash
# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### "Backend not responding"
**Solution**: Check if backend is running on port 3001
```bash
# Verify backend is running:
curl http://localhost:3001/api/auth/me
# Should see error (requires auth token) but connection works
```

### "Login not working"
**Solution**: Make sure you:
1. Registered account first
2. Backend is running
3. MongoDB is connected
4. Check browser console for errors (F12)

---

## File Structure Quick Reference

```
DarShana-travel/
├── src/pages/
│   ├── Login.tsx ← Auth
│   ├── Profile.tsx ← Profile management
│   ├── MyTrips.tsx ← Trip management
│   ├── FestivalAlerts.tsx ← Festival alerts
│   ├── LanguageSelector.tsx ← Language
│   └── Register.tsx ← Booking form
│
├── src/context/
│   └── AuthContext.tsx ← State management
│
├── src/services/
│   └── api.ts ← API calls
│
├── server/src/
│   ├── models/ ← Database schemas
│   ├── controllers/ ← Business logic
│   └── routes/ ← API endpoints
│
└── .env files
    ├── .env (frontend)
    └── server/.env (backend)
```

---

## Common Commands

```bash
# Development
npm run dev              # Start frontend dev
npm run build           # Build for production
npm run preview         # Preview production build

# Backend
cd server
npm run dev             # Start backend dev
npm run build           # Build backend
npm start               # Start production

# Utility
npm install             # Install dependencies
npm update              # Update dependencies
npm test                # Run tests (if configured)
```

---

## What to Test

After starting the app, test these features:

- [ ] **Register** new account
- [ ] **Login** with credentials
- [ ] **View Profile** page
- [ ] **Edit Profile** and save
- [ ] **View My Trips** page
- [ ] **Book a Trip**
- [ ] **Cancel a Trip**
- [ ] **Subscribe** to festival
- [ ] **Unsubscribe** from festival
- [ ] **Change Language**
- [ ] **Logout** user
- [ ] **Refresh page** (should stay logged in)

---

## API Endpoints (For Testing)

### Register
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Profile (with token)
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Environment Variables

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://localhost:3001
```

### Backend (server/.env)
```
MONGODB_URI=mongodb://localhost:27017/darshana-travel
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:5173
PORT=3001
NODE_ENV=development
```

---

## Feature Status

| Feature | Status | Default Route |
|---------|--------|---|
| Sign Up | ✅ | /login |
| Sign In | ✅ | /login |
| Profile Management | ✅ | /profile |
| Trip Booking | ✅ | /register |
| My Trips | ✅ | /my-trips |
| Festival Alerts | ✅ | /festival-alerts |
| Language Selection | ✅ | /language |
| Logout | ✅ | Sidebar |

---

## Production Deployment

When ready to deploy:

1. **Build frontend**: `npm run build`
2. **Build backend**: `cd server && npm run build`
3. **Deploy dist/ folder** to hosting (Vercel, Netlify, etc.)
4. **Deploy server/** to hosting (Render, Railway, Heroku, etc.)
5. **Update environment variables** on hosting platform
6. **Configure MongoDB Atlas** for production database

---

## Support & Issues

### Check Logs
- Frontend logs in browser console (F12)
- Backend logs in terminal

### Common Issues
- **401 Unauthorized**: Token expired or invalid
- **400 Bad Request**: Check request body
- **500 Internal Server Error**: Check backend logs
- **MongoDB connection error**: Make sure MongoDB is running

### Reset Everything
```bash
# Clear browser data
# 1. Open DevTools (F12)
# 2. Application → Local Storage
# 3. Delete all entries
# 4. Refresh page

# Restart servers
# 1. Ctrl+C in both terminals
# 2. npm run dev (both)
```

---

## Next Steps

1. ✅ Run the app locally
2. ✅ Test all features
3. ✅ Deploy to production
4. ✅ Add email notifications
5. ✅ Add payment gateway
6. ✅ Add more features

---

**Happy coding! 🎉**

