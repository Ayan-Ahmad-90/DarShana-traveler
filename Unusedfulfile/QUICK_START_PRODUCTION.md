# Quick Start: Deploy Green Routes Backend to Production

Your DarShana Travel app is **95% complete**. The frontend is ready on Vercel, but the backend needs to be deployed.

## Choose Your Deployment Platform

### Option 1: Render.com (Recommended) ⭐
**Easiest for beginners, free tier available**

1. Go to [render.com](https://render.com) → Sign up with GitHub
2. Click "New +" → "Web Service"
3. Connect your GitHub repo (`DarShana-travel`)
4. Settings:
   - **Name:** `darshana-green-routes-api`
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install && npm run build`
   - **Start Command:** `cd backend && npm start`
   - **Root Directory:** (leave blank)

5. Add Environment Variables (before deploy):
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `CORS_ORIGIN`: `http://localhost:5173,https://dar-shana-traveler-seven.vercel.app,https://darshana-traveler.vercel.app`
   - `NODE_ENV`: `production`

6. Click "Create Web Service" → Wait 5-10 minutes for deployment
7. Copy your URL (e.g., `https://darshana-green-routes-api.onrender.com`)

### Option 2: Railway.app
**Very fast, supports GitHub auto-deploy**

1. Go to [railway.app](https://railway.app) → Sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `DarShana-travel`
4. Set Environment Variables:
   - `MONGODB_URI`
   - `CORS_ORIGIN` (see above)
   - `NODE_ENV`: `production`

5. Add root directory: `./backend`
6. Railway auto-detects Node.js and deploys

### Option 3: Heroku (Requires Credit Card)
```bash
# Install Heroku CLI, then:
heroku login
heroku create darshana-green-routes-api
heroku config:set MONGODB_URI=<your-mongodb-uri> -a darshana-green-routes-api
heroku config:set CORS_ORIGIN="http://localhost:5173,https://dar-shana-traveler-seven.vercel.app,https://darshana-traveler.vercel.app"
git push heroku main
```

## Step 2: Get MongoDB Connection String

You need a database. Use **MongoDB Atlas** (free tier):

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Sign up → Create free cluster
3. Get connection string:
   - Click "Connect" → "Drivers"
   - Copy string like: `mongodb+srv://username:password@cluster.mongodb.net/darshana?retryWrites=true&w=majority`
4. Use this as `MONGODB_URI` in your chosen platform

## Step 3: Configure Vercel for Backend

Your frontend is on Vercel. Tell it where the backend is:

1. Go to [vercel.com](https://vercel.com) → Select `DarShana-travel` project
2. Settings → Environment Variables
3. Add new variable:
   - **Name:** `VITE_BACKEND_URL`
   - **Value:** Your backend URL (e.g., `https://darshana-green-routes-api.onrender.com`)
   - Click "Add"

4. Click "Redeploy" on the main Deployments tab

## Step 4: Test It Works

After Vercel redeploys (5-10 mins):

1. Visit: https://dar-shana-traveler-seven.vercel.app
2. Go to "Green Route Planner" (Green Routes in menu)
3. Enter:
   - **From:** New Delhi
   - **To:** Jaipur
4. Click "Plan My Route"
5. You should see 8 transport options with:
   - Time, Distance, Cost (₹)
   - CO₂ Emissions
   - Reward Points
   - Sustainability Score

### Troubleshooting

**Still getting errors?**

1. **"Backend URL not configured"**
   - Vercel needs the `VITE_BACKEND_URL` env variable
   - Check Step 3 above

2. **"Backend is not deployed yet"**
   - Your chosen platform (Render/Railway) is still deploying
   - Wait 10-15 minutes and refresh

3. **CORS errors in browser console**
   - Backend CORS_ORIGIN needs to include your Vercel URL
   - Add to your platform's env variables

4. **MongoDB connection errors**
   - Check MongoDB Atlas connection string is correct
   - Whitelist your IP in MongoDB Atlas

## Your Backend URLs

After deployment, your backend will be at:

- **Render.com:** `https://[your-service-name].onrender.com`
- **Railway.app:** `https://[project-name].up.railway.app`
- **Heroku:** `https://[app-name].herokuapp.com`

## API Endpoints Available

Your backend provides these endpoints:

```
POST /api/routes
  Input: { from: string, to: string }
  Output: { success: true, data: { routes: [...] } }

GET /api/routes?page=1&limit=10
  Returns: Paginated route history

GET /api/routes/:id
  Returns: Single route details

GET /api/routes/stats/summary
  Returns: Aggregate statistics
```

## Example Route Response

```json
{
  "success": true,
  "data": {
    "routes": [
      {
        "transportMode": "Train",
        "estimatedTime": "2h 30m",
        "distance": 250,
        "cost": 250,
        "co2Emissions": 10.25,
        "sustainability": {
          "score": 9,
          "isEcoChoice": true
        },
        "rewardPoints": 45
      }
    ]
  }
}
```

## Next Steps

1. ✅ Deploy backend to production platform
2. ✅ Set MongoDB URI
3. ✅ Update Vercel with `VITE_BACKEND_URL`
4. ✅ Test Green Route Planner
5. 🎉 Done! Share your app!

## Need More Help?

- **Frontend setup:** See `SETUP.md`
- **Backend API docs:** See `backend/README_GREEN_ROUTES.md`
- **All deployment options:** See `DEPLOYMENT.md`

---

**Your app is production-ready!** 🚀 The hardest part (building the backend) is done. This just gets it live.
