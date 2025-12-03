# Production Deployment Checklist

## Backend Deployment (Choose One)

### Render.com Route
- [ ] Create Render account (free tier)
- [ ] Connect GitHub repo
- [ ] Create Web Service with:
  - Build: `cd backend && npm install && npm run build`
  - Start: `cd backend && npm start`
  - Root: (blank)
- [ ] Add environment variables:
  - [ ] `MONGODB_URI` = [Your MongoDB Atlas string]
  - [ ] `CORS_ORIGIN` = Full list from SETUP.md
  - [ ] `NODE_ENV` = production
- [ ] Deploy and get URL (takes 5-10 min)
- [ ] **Copy the backend URL**

### Railway.app Route
- [ ] Create Railway account
- [ ] Import from GitHub
- [ ] Set root directory to `./backend`
- [ ] Add same environment variables as above
- [ ] **Copy the backend URL**

### Heroku Route
- [ ] Install Heroku CLI
- [ ] Run heroku create/config commands (see QUICK_START_PRODUCTION.md)
- [ ] Push to Heroku
- [ ] **Copy the backend URL**

## MongoDB Setup
- [ ] Create MongoDB Atlas account
- [ ] Create free cluster
- [ ] Get connection string
- [ ] Add it as `MONGODB_URI` env variable to your deployment platform

## Frontend Configuration
- [ ] Go to Vercel dashboard
- [ ] Select DarShana-travel project
- [ ] Settings → Environment Variables
- [ ] Add: `VITE_BACKEND_URL` = [Your backend URL from above]
- [ ] Click "Redeploy" (auto-redeploys with new env var)

## Testing (after 10 min)
- [ ] Visit: https://dar-shana-traveler-seven.vercel.app
- [ ] Go to menu → Green Route Planner
- [ ] Test: New Delhi → Jaipur
- [ ] Check: See 8 transport options
- [ ] Verify: CO₂, cost, rewards shown

## Troubleshooting
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Check browser console (F12) for error messages
- [ ] Verify backend URL in Vercel env variables
- [ ] Wait 15 min for platform to finish deploying
- [ ] Check MongoDB Atlas IP whitelist (if needed)

---

**Estimated Time:** 20-30 minutes total  
**Cost:** Free (if using free tiers)  
**Status:** ✅ Everything else is done, this is the final step!
