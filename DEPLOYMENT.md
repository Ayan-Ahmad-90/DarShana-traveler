# 🚀 Production Deployment Guide

## Issues Fixed

### 1. ✅ Tailwind CSS CDN Removed
- Removed `<script src="https://cdn.tailwindcss.com"></script>` from `index.html`
- Using proper Tailwind setup with build process
- This fixes the "should not be used in production" warning

### 2. ✅ CORS Configured for Production
- Backend now accepts requests from:
  - `http://localhost:5173` (development)
  - `https://dar-shana-traveler-seven.vercel.app` (production)
  - `https://darshana-traveler.vercel.app` (alternative)
- Updated `backend/src/config/environment.ts` with multiple origins
- Updated `backend/src/index.ts` with proper CORS handler

### 3. ✅ Environment-Aware API Configuration
- Created `src/config/api.ts` that automatically detects environment
- Development: Uses `http://localhost:5000`
- Production: Uses configured backend URL
- Frontend now uses this configuration instead of hardcoded localhost

---

## 📋 Deployment Checklist

### Frontend (Vercel)
- [x] Remove Tailwind CDN
- [x] Configure environment-aware API endpoints
- [ ] Deploy to Vercel
- [ ] Test Green Route Planner feature

### Backend (Choose one)
**Option A: Render.com (Recommended)**
1. Push code to GitHub
2. Connect repo on Render.com
3. Set environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=production
   CORS_ORIGIN=https://dar-shana-traveler-seven.vercel.app,https://darshana-traveler.vercel.app
   ```
4. Deploy
5. Get the deployed URL (e.g., `https://darshana-backend.onrender.com`)

**Option B: Railway.app**
1. Create Railway account
2. Connect GitHub repository
3. Add MongoDB plugin (or use external MongoDB URI)
4. Set environment variables (same as above)
5. Deploy

**Option C: Heroku**
1. `heroku login`
2. `heroku create darshana-backend`
3. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_uri
   heroku config:set CORS_ORIGIN=https://dar-shana-traveler-seven.vercel.app
   ```
4. `git push heroku main`

---

## 🔧 Configuration After Backend Deployment

Once backend is deployed, update frontend:

**Create `.env.production` in root directory:**
```env
VITE_BACKEND_URL=https://your-backend-url.com
VITE_GEMINI_API_KEY=your_gemini_key
VITE_FIREBASE_API_KEY=your_firebase_key
```

Or update `src/config/api.ts`:
```typescript
// In getBackendUrl() function, change:
return import.meta.env.VITE_BACKEND_URL || 'https://your-backend-url.com';
```

---

## 🧪 Testing Production Setup

### 1. Test Backend Health
```bash
curl https://your-backend-url.com/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "darshana-green-routes",
  "timestamp": "2025-11-26T02:30:00.000Z"
}
```

### 2. Test Routes Endpoint
```bash
curl -X POST https://your-backend-url.com/api/routes \
  -H "Content-Type: application/json" \
  -d '{"from":"New Delhi","to":"Jaipur"}'
```

### 3. Test Frontend
1. Visit deployed Vercel URL
2. Navigate to "Green Route Planner"
3. Enter origin and destination
4. Click "Calculate Impact"
5. Should see 8 transport options

---

## 📊 Performance Tips

### Frontend Optimization
- ✅ Tailwind CSS build optimization
- ✅ Remove unused CSS in production build
- ✅ Enable gzip compression on Vercel

### Backend Optimization
- ✅ Enable caching for frequently accessed routes
- ✅ Use MongoDB indexes
- ✅ Consider CDN for API responses

---

## 🔐 Security

### Environment Variables
Never commit:
- API keys (Gemini, Firebase)
- MongoDB connection strings
- CORS origins with secrets

### Backend
- CORS properly configured
- Only allow known origins
- Validate all inputs
- Rate limiting (can be added)

### Frontend
- Remove console logs in production
- Use HTTPS only
- Validate API responses

---

## 🆘 Troubleshooting

### "CORS policy blocked"
- Check backend CORS configuration
- Ensure Vercel domain is in CORS_ORIGIN list
- Restart backend if changed

### "Cannot reach backend"
- Verify backend URL in `src/config/api.ts`
- Check if backend is running
- Check network connectivity

### "Routes not showing"
- Open DevTools → Network tab
- Check `/api/routes` request status
- Look for error messages in console

---

## 📈 Next Steps

1. Deploy backend first
2. Get backend URL
3. Update frontend configuration
4. Deploy frontend
5. Test all features
6. Monitor logs and errors

**Support:** Check backend logs on your hosting platform for detailed errors

---

**Last updated:** November 26, 2025
