# Render Deployment Guide

## Deploy Backend to Render

### Step 1: Prepare Backend for Render
```bash
cd backend
npm run build
```

### Step 2: Create Render Account & New Service
1. Go to https://render.com
2. Sign up/Login
3. Click "New +" → "Web Service"
4. Connect your GitHub repo: https://github.com/Ayan-Ahmad-90/DarShana-traveler

### Step 3: Configure Service
- **Name**: darshana-backend (or any name)
- **Runtime**: Node
- **Build Command**: `cd backend && npm install && npm run build`
- **Start Command**: `cd backend && node dist/index.js`
- **Region**: Choose closest to India (Singapore or Mumbai if available)

### Step 4: Add Environment Variables
In Render dashboard, go to Environment:

```
MONGODB_URI=mongodb+srv://chaudharyayan100_db_user:aRKyLPdwBcjsktoU@cluster0.ufhvfhe.mongodb.net/darshana-travel?appName=Cluster0
PORT=10000
NODE_ENV=production
CORS_ORIGIN=https://dar-shana-traveler-seven.vercel.app,https://darshana-traveler.vercel.app,http://localhost:5173
```

### Step 5: Add MongoDB IP Whitelist
1. Go to https://cloud.mongodb.com/
2. Security → Network Access
3. Add IP Address → Allow from anywhere (0.0.0.0/0) for Render
4. Or add Render's IP after deployment

### Step 6: Deploy
Click "Create Web Service" and wait for deployment

### Step 7: Get Backend URL
After deployment, Render will give you a URL like:
```
https://darshana-backend.onrender.com
```

### Step 8: Update Frontend .env.production
In Vercel dashboard:
- Settings → Environment Variables
- Add: `VITE_BACKEND_URL=https://darshana-backend.onrender.com`

### Step 9: Redeploy Frontend
1. Go to Vercel
2. Select DarShana project
3. Click "Redeploy"

## Final Check

Test at: https://dar-shana-traveler-seven.vercel.app/#/sustainable

Try route: Red Fort → India Gate (should work now!)

## Troubleshooting

If still getting CORS error:
- Check Render backend is running: Visit `https://darshana-backend.onrender.com/health`
- Should return: `{"status":"ok","service":"darshana-green-routes"}`

If MongoDB connection fails:
- Check IP whitelist in MongoDB Atlas
- Verify connection string is correct
- Check credentials are right
