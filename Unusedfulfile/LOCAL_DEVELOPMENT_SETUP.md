# 🚀 Quick Start - Run Both Servers Locally

Your app has two parts that need to run together:

## Frontend Server ✅ Running
- **URL:** http://localhost:5173
- **Command:** `npm run dev` (already running)
- **Status:** VITE development server is active

## Backend Server ⏳ Need to Setup
- **URL:** http://localhost:5000
- **Command:** `npm start` (in backend folder)
- **Requirement:** MongoDB connection

---

## ⚠️ Problem: MongoDB Not Found

The backend needs a database connection. You have **2 options**:

### Option 1: Use MongoDB Atlas (Easiest - Cloud)
No installation needed, just get a connection string.

**Steps:**
1. Go to https://mongodb.com/cloud/atlas
2. Create free account
3. Create free cluster (512MB)
4. Get connection string like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/darshana?retryWrites=true
   ```
5. Set environment variable:
   ```powershell
   $env:MONGODB_URI='mongodb+srv://username:password@cluster.mongodb.net/darshana?retryWrites=true'
   $env:PORT='5000'
   cd backend
   npm start
   ```

### Option 2: Install MongoDB Locally (Recommended for Dev)

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Run installer
3. Choose "Install MongoDB as a Service"
4. MongoDB will auto-start on next reboot
5. Or start manually:
   ```powershell
   "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
   ```

**Then run backend:**
```powershell
cd c:\Users\Dell\OneDrive\Desktop\DarShana-travel\backend
$env:MONGODB_URI='mongodb://localhost:27017/darshana-travel'
$env:PORT='5000'
npm start
```

---

## ✅ What to Do Right Now

### For Quick Testing with MongoDB Atlas:
1. Create MongoDB Atlas account (free tier)
2. Get connection string
3. In new PowerShell window:
   ```powershell
   cd c:\Users\Dell\OneDrive\Desktop\DarShana-travel\backend
   $env:MONGODB_URI='your-connection-string-here'
   $env:PORT='5000'
   npm start
   ```

### For Local MongoDB:
1. Install MongoDB Community Edition
2. After install, run same commands above with `mongodb://localhost:27017/darshana-travel`

---

## 🎮 Once Both Servers Running

**Frontend is ready at:** http://localhost:5173

Test Green Route Planner:
1. Go to menu → Green Route Planner (or Green Routes)
2. Enter: From: "New Delhi", To: "Jaipur"
3. Click "Plan My Route"
4. Should see 8 transport options with CO₂, cost, rewards

---

## 📝 Terminal Commands Reference

**Frontend (already running):**
- In frontend folder: `npm run dev`
- Ctrl+C to stop

**Backend (needs MongoDB):**
- In backend folder: `npm start`
- Ctrl+C to stop

**Building:**
- Frontend build: `npm run build`
- Backend build: `npm run build` (in backend folder)

---

## 🆘 Still Having Issues?

**"Connection refused on localhost:5000"**
→ Backend isn't running or MongoDB isn't connected

**"Backend is not deployed yet"** (in browser)
→ Frontend can't reach backend. Make sure:
1. Backend is running: `npm start` in backend folder
2. MongoDB is connected
3. No firewall blocking localhost:5000

**MongoDB connection errors**
→ Either:
1. MongoDB not running (install and start it)
2. Connection string wrong (check MongoDB Atlas)
3. IP not whitelisted (if using Atlas, add 0.0.0.0/0)

---

## 📚 Related Docs
- See `QUICK_START_PRODUCTION.md` for production deployment
- See `SETUP.md` for full development environment setup
- See `backend/README_GREEN_ROUTES.md` for API documentation

---

**Next Step:** Set up MongoDB (Atlas or local), then run backend server! 🎉
