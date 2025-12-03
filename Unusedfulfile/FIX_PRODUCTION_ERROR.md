# 🚨 FIX: Production Environment Variable

## Problem
Your app is showing: `ERR_CONNECTION_REFUSED` on localhost:3000

This means the frontend can't find the backend URL.

## Solution
Add the backend URL to Vercel environment variables and redeploy.

## Step-by-Step Instructions

### Step 1: Open Vercel Dashboard
Go to: **https://vercel.com/dashboard**

### Step 2: Select Your Project
Click on: **dar-shana-traveler-seven**

### Step 3: Go to Settings
Click: **Settings** (top navigation bar)

### Step 4: Environment Variables
Left sidebar → Click: **Environment Variables**

### Step 5: Add New Variable
Click the green **+ Add New** button

### Step 6: Fill in the Details
```
Name:  VITE_BACKEND_URL
Value: https://darshana-backend.onrender.com
```

Click: **Add**

### Step 7: Redeploy
1. Go back to your project (click project name)
2. Find your latest deployment
3. Click the **...** (three dots)
4. Select: **Redeploy**
5. Confirm: **Redeploy**

### Step 8: Wait
⏳ The build will take 2-3 minutes

You'll see the status change from "Building" → "Ready"

### Step 9: Test
1. Go to your app: https://dar-shana-traveler-seven.vercel.app
2. Enter: Delhi → Mumbai
3. Click: Calculate Route
4. Should see: All 8 transport modes with CO₂ emissions

## Why This Works

Your app code has this logic:

```typescript
const isProduction = window.location.hostname.includes('vercel.app');

if (isProduction) {
  return process.env.VITE_BACKEND_URL; // Uses the env var
}
```

When running on `*.vercel.app`, it needs `VITE_BACKEND_URL` to know where your backend is.

Without it, it falls back to `http://localhost:3000` which doesn't work in production.

## Troubleshooting

### "Still getting connection refused"
1. Make sure you clicked **Add** after filling in the variable
2. Make sure you clicked **Redeploy** 
3. Wait another minute for the build to complete
4. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### "Build failed"
1. Check Vercel logs for the actual error
2. Usually just means the redeploy is still in progress
3. Wait 30 seconds and refresh

### "Backend URL is empty"
1. Double-check you typed the URL correctly
2. Should be: `https://darshana-backend.onrender.com` (with https://)
3. No trailing slash

## Confirm It Worked

After redeploy completes, you should see:

✅ App loads at https://dar-shana-traveler-seven.vercel.app
✅ Can enter city names
✅ Calculate Route works
✅ See results with transport modes and CO₂ data

If you see this, everything is working! 🎉
