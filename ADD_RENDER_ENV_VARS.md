# ⚡ Add Environment Variables to Render - CRITICAL

## Status
**❌ NO ENVIRONMENT VARIABLES SET IN RENDER**

This is why the backend is not working!

## What To Do

### Step 1: You Should Be in Render Dashboard Already
URL: https://render.com/dashboard
Service: darshana-backend

You should see the screen showing:
"No Environment Variables Added"

### Step 2: Add Environment Variables

Look for the section that says:
"Add Environment Variables to Production, Preview, and Development environments"

Click that section to expand it.

### Step 3: Add Variable #1 - MONGODB_URI

In the input fields:
- **KEY:** MONGODB_URI
- **VALUE:** 
```
mongodb+srv://chaudharyayan100_db_user:DM0dcG1zgEyTYryW@cluster0.ufhvfhe.mongodb.net/darshana-travel?appName=Cluster0
```
- Click: **Add**

### Step 4: Add Variable #2 - PORT

In the input fields:
- **KEY:** PORT
- **VALUE:** 10000
- Click: **Add**

### Step 5: Add Variable #3 - NODE_ENV

In the input fields:
- **KEY:** NODE_ENV
- **VALUE:** production
- Click: **Add**

### Step 6: Add Variable #4 - CORS_ORIGIN

In the input fields:
- **KEY:** CORS_ORIGIN
- **VALUE:** https://dar-shana-traveler-seven.vercel.app
- Click: **Add**

### Step 7: Deploy with New Variables

After adding all 4 variables, you should see:
- A button that says **"Create new"** or **"Deploy"**
- Click it

### Step 8: Wait for Deployment

- Wait 5-10 minutes for the deployment to complete
- The page will show a spinning icon while deploying
- When done, it will show "Live" with a green indicator

### Step 9: Verify

After deployment:
1. Check the **Logs** tab
2. Look for:
   - "✅ MongoDB Connected successfully"
   - "🚀 Green Routes Server running on port"
3. If you see these = Success ✅

## All Variables at Once (For Copy-Paste)

```
MONGODB_URI = mongodb+srv://chaudharyayan100_db_user:DM0dcG1zgEyTYryW@cluster0.ufhvfhe.mongodb.net/darshana-travel?appName=Cluster0
PORT = 10000
NODE_ENV = production
CORS_ORIGIN = https://dar-shana-traveler-seven.vercel.app
```

## After Render is Fixed

Then also verify in **Vercel**:
1. Go to: https://vercel.com/dashboard
2. Click: dar-shana-traveler-seven
3. Settings → Environment Variables
4. Make sure **VITE_BACKEND_URL** is set to:
   ```
   https://darshana-backend.onrender.com
   ```

If not set, add it and click Redeploy.

## Expected Result

After both Render and Vercel are configured:

1. Visit: https://dar-shana-traveler-seven.vercel.app
2. Enter: Delhi
3. Enter: Mumbai
4. Click: Calculate Route
5. See: All 8 transport modes with CO₂ emissions ✅

## Troubleshooting

**If "Create new" button is greyed out:**
- Make sure you've added at least one variable
- Click elsewhere on the page and try again

**If still seeing 404:**
- Wait the full 5-10 minutes for deployment
- Check logs for errors
- Make sure all 4 variables are added

**If MongoDB connection error:**
- Double-check the MONGODB_URI value
- Make sure it includes the password: DM0dcG1zgEyTYryW
- Make sure MongoDB whitelist is set to 0.0.0.0/0

Let me know once you've added these variables and Render is deploying! 🚀
