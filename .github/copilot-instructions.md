# DarShana Travel - AI Coding Agent Instructions

## Project Overview
**DarShana Travel** is a full-stack sustainable travel platform with React (Vite) frontend, Express.js backend, and MongoDB. Focus: eco-friendly route planning, local guide booking, festival alerts, and AI-powered mood analysis.

## Architecture

### Monorepo Structure
- **Frontend**: React 19 + TypeScript + Vite 7 + Tailwind CSS 4 (root `src/`)
- **Backend**: Express.js + MongoDB (in `backend/` subfolder, CommonJS)
- **Server** (TypeScript): Alternative backend in `server/` (not actively used)

### Key Data Flow
1. Frontend (`http://localhost:5173`) → Backend API (`http://localhost:5000` or 3001)
2. Backend uses Mongoose ODM → MongoDB Atlas or local MongoDB
3. Authentication: JWT tokens stored in localStorage, validated via `backend/middleware/auth.js`
4. Firebase Auth integrated for alternative login flow

## Development Commands

### Frontend (run from root)
```powershell
npm run dev          # Start Vite dev server on :5173
npm run build        # TypeScript compile + Vite production build
npm run preview      # Preview production build
```

### Backend (run from `backend/` folder)
```powershell
cd backend
npm run dev          # Start Express with nodemon on :5000 (default)
npm start            # Production mode
```

**Critical**: Backend requires MongoDB connection. Set `MONGODB_URI` environment variable:
```powershell
$env:MONGODB_URI='mongodb://localhost:27017/darshana-travel'
$env:PORT='5000'
```

## Environment Variables

### Frontend (`.env` or `.env.local`)
- `VITE_BACKEND_URL`: Backend API URL (default: `http://localhost:3001`)
- `VITE_GEMINI_API_KEY`: Google Gemini API key for AI chat
- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc.: Firebase config
- `VITE_API_URL`: Alternative backend URL for mood analyzer

### Backend (`.env`)
- `MONGODB_URI`: MongoDB connection string (required)
- `PORT`: Server port (default: 5000)
- `JWT_SECRET`: Secret for JWT token signing
- `NODE_ENV`: `development` or `production`
- `CORS_ORIGIN`: Allowed frontend origins

## Code Patterns & Conventions

### Frontend Patterns

**1. Static Assets in `public/`**
- Model files (face-api.js) go in `public/models/`
- Access via `/models/...` in code (Vite serves `public/` at root)
- Never use relative paths like `./models` or `../public/models`

**2. API Configuration** (`src/config/api.ts`)
```typescript
// Auto-detects dev vs production, uses VITE_BACKEND_URL
export const API_BASE_URL = getBackendUrl();
```

**3. Authentication Pattern** (`src/context/AuthContext.tsx`)
- Centralized auth state with React Context
- Tokens stored in localStorage
- Protected routes check `isAuthenticated`
- API calls include: `headers: { Authorization: 'Bearer ${token}' }`

**4. Internationalization** (`src/i18n.ts`)
- Uses `i18next` + `react-i18next`
- Translations in `src/locales/en/` and `src/locales/hi/`
- Language stored in localStorage
- Access: `const { t } = useTranslation();`

**5. Face Detection Hook** (`src/hooks/useFaceDetection.ts`)
- Loads face-api.js models from `/models`
- Exposes `modelsLoaded` flag - MUST be true before inference
- Use `await loadModels()` once in useEffect
- Never call `detectAllFaces` until models loaded

### Backend Patterns

**1. Route Structure** (`backend/routes/*.js`)
```javascript
// All routes are mounted in backend/server.js with /api prefix
app.use('/api/questions', questionRoutes);
app.use('/api/chat', chatRoutes);
```

**2. Authentication Middleware** (`backend/middleware/auth.js`)
```javascript
// Protect routes: router.use(auth) or router.get('/path', auth, handler)
// Sets req.userId from JWT token
```

**3. Controller Pattern**
- Controllers in `backend/controllers/*.js`
- Handle business logic, return JSON responses
- Error handling: `res.status(code).json({ message: '...' })`

**4. MongoDB Models** (`backend/models/*.js`)
- Use Mongoose schemas
- Models indexed in `backend/models/index.js`

**5. Database Connection** (`backend/config/database.js`)
```javascript
// Connects to MongoDB on server start
// Logs connection status with emoji indicators
```

## Integration Points

### Green Route Planner
- Frontend: `src/pages/GreenRouteForm.tsx`
- Backend: `server/src/routes/` (TypeScript version)
- Calculates 8 transport modes with CO₂, cost, rewards
- Uses Haversine formula for distance

### Mood Analyzer (AI Feature)
- Frontend: `src/pages/MoodAnalyzer.tsx` + `src/hooks/useFaceDetection.ts`
- Requires face-api.js models in `public/models/`
- Backend endpoint: `/api/mood-analyze` (mount in server.js)
- Uses Google Gemini for emotion-to-destination mapping

### Local Guide Booking
- Routes: `backend/routes/guideRegistration.js`
- File uploads use multer middleware
- Guide profile includes verification status
- Rating system integrated

### Festival Alerts
- Notification system: `backend/routes/notifications.js`
- User preferences in profile: `notificationPreferences.festivalAlerts`

## Common Pitfalls

1. **Model Loading Errors**: Ensure all face-api.js `.bin` and `weights_manifest.json` files are in `public/models/`, not corrupted
2. **CORS Issues**: Backend CORS must allow frontend origin (dev: `http://localhost:5173`, prod: Vercel domain)
3. **Port Conflicts**: Frontend default :5173, backend varies (:5000, :3001, :3000) - check `VITE_BACKEND_URL`
4. **MongoDB Not Running**: Backend crashes without valid `MONGODB_URI`
5. **Import Path Confusion**: Backend uses CommonJS (`require`), frontend uses ESM (`import`)
6. **Static File 404s**: Vite only serves `public/` at root in dev/preview, not `src/` files

## Testing & Debugging

- **Frontend HMR**: Vite provides instant updates, logs show in browser console
- **Backend Logs**: Winston logging configured, check terminal output
- **API Testing**: Health check at `/api/health` or `/health`
- **Database Queries**: Use MongoDB Compass to inspect collections

## Deployment Context

- **Frontend**: Deployed to Vercel (see `DEPLOYMENT.md`)
- **Backend**: Target Render.com or Railway (see `RENDER_DEPLOYMENT.md`)
- **Database**: MongoDB Atlas free tier (512MB)
- Production requires setting all `VITE_*` env vars in Vercel
- Backend needs `MONGODB_URI` and `CORS_ORIGIN` in Render

## Key Files Reference

- Architecture overview: `ARCHITECTURE.md`
- Setup guides: `LOCAL_DEVELOPMENT_SETUP.md`, `SETUP_GUIDE.md`
- Backend integration: `BACKEND_INTEGRATION.md`, `MONGODB_CONNECTION_GUIDE.md`
- Main backend server: `backend/server.js`
- API config: `src/config/api.ts`
- Auth context: `src/context/AuthContext.tsx`
- Package deps: `package.json` (root), `backend/package.json`

---

**When adding new features:**
1. Frontend: Create component in `src/components/` or page in `src/pages/`
2. Add route in `src/App.tsx` (React Router v7)
3. Backend: Create controller in `backend/controllers/`, route in `backend/routes/`
4. Mount route in `backend/server.js` with `/api` prefix
5. Update TypeScript types in `src/types/` if needed
6. For protected endpoints: add `auth` middleware
7. Test locally before deploying
