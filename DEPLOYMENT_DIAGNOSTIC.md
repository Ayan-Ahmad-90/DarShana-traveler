# 🔍 Deployment Diagnostic Guide

## Current Status

| Component | Status | URL |
|-----------|--------|-----|
| Frontend (Vercel) | ✅ Deployed | https://dar-shana-traveler-seven.vercel.app |
| Backend (Render) | ⚠️ Needs Check | https://darshana-backend.onrender.com |
| MongoDB | ✅ Connected | Atlas |

## Diagnostic Steps

### Step 1: Check Render Backend Service
1. Go to: https://render.com/dashboard
2. Find service: **darshana-backend**
3. Check **Status** column:
   - Should say: **"Live"** ✅
   - If red/error: ❌ Service crashed
4. Click the service name
5. Go to **Logs** tab
6. Look for error messages

### Step 2: Check for Common Render Issues

**If you see "Address already in use":**
- Backend port (3000) is already in use
- Fix: Render restart usually resolves this

**If you see "Cannot find module":**
- Missing dependency
- Fix: Check package.json and reinstall

**If you see "MongoDB connection failed":**
- IP whitelist or credentials issue
- Fix: Verify MongoDB environment variable

**If service shows "Building":**
- Still deploying
- Fix: Wait 5-10 minutes

### Step 3: View Render Logs

In Render dashboard:
1. Click: **darshana-backend** service
2. Click: **Logs** tab
3. Look for:
   - ✅ "Green Routes Server running on port"
   - ✅ "MongoDB Connected successfully"
   - ❌ Any error messages in red

### Step 4: Check Vercel Environment Variable

1. Go to: https://vercel.com/dashboard
2. Click: **dar-shana-traveler-seven**
3. Click: **Settings** → **Environment Variables**
4. Confirm you see:
   ```
   Name: VITE_BACKEND_URL
   Value: https://darshana-backend.onrender.com
   ```
5. If missing: Add it and click Redeploy

### Step 5: Restart Backend (If Needed)

If Render service is stuck:
1. Render dashboard
2. Click: **darshana-backend**
3. Click: **... (three dots)** menu
4. Click: **Manual Deploy** or **Restart**
5. Wait 3-5 minutes

## Testing Checklist

After diagnostics, test locally first:

```bash
# Terminal 1: Start backend
cd backend
export MONGODB_URI="mongodb+srv://chaudharyayan100_db_user:DM0dcG1zgEyTYryW@cluster0.ufhvfhe.mongodb.net/darshana-travel?appName=Cluster0"
export PORT=3000
npm run build
node dist/index.js

# Terminal 2: Test API
curl http://localhost:3000/health

# Terminal 3: Start frontend (optional)
npm run dev
```

## Expected Results

### Backend Running Successfully
```
✅ MongoDB Connected successfully
✅ Green Routes Server running on port 3000
✅ Environment: development
✅ CORS Origin: configured
```

### Frontend Can Call Backend
```
✅ No connection refused errors
✅ Route calculation returns results
✅ Shows all 8 transport modes
✅ Displays CO₂ emissions
```

## Emergency Fixes

**If backend won't start:**
1. Check MongoDB password is correct
2. Verify MongoDB IP whitelist (should be 0.0.0.0/0)
3. Render: Check service build logs
4. Render: Try "Manual Deploy"

**If environment variable not working:**
1. Confirm saved in Vercel (check it's there)
2. Vercel: Click Redeploy
3. Wait 2-3 minutes for new build
4. Hard refresh browser (Ctrl+Shift+R)

**If still connection refused:**
1. Check Render service status
2. Check Vercel environment variables
3. Check MongoDB whitelist (0.0.0.0/0)
4. Try redeploying both services

## Questions to Answer

Please provide answers to these:

1. **Render Backend Status:**
   - [ ] Service shows "Live" (green)
   - [ ] Service shows "Building"
   - [ ] Service shows error (red)
   - [ ] Can't find the service

2. **Error Messages in Render Logs:**
   - [ ] No errors, running fine
   - [ ] MongoDB connection error
   - [ ] Port already in use
   - [ ] Other: ________________

3. **Vercel Environment Variable:**
   - [ ] VITE_BACKEND_URL is set
   - [ ] VITE_BACKEND_URL is NOT set
   - [ ] Not sure

4. **Frontend Status:**
   - [ ] App loads and works
   - [ ] App loads but shows connection error
   - [ ] App doesn't load at all

## Next Action

Reply with:
1. Render service status (live/building/error)
2. Any error messages from Render logs
3. Whether VITE_BACKEND_URL is set in Vercel

I'll help you fix it from there! 🚀
