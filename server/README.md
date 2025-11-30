# DarShana TypeScript Backend

India-first travel APIs backing the DarShana TravelHub. Built with Express + TypeScript + MongoDB, focused on smart discovery, mood-aware planning, and sustainable routing for domestic journeys.

## 📁 Project Structure
```
server/
  src/
   app.ts                # Express app configuration
   server.ts             # Entry point
   config/               # DB, logger, swagger, rate limiter
   controllers/          # Feature-specific handlers
   routes/               # REST routes for each module
   models/               # Mongoose schemas (Destination, Package, User, Review, Blog, ContactMessage)
   middlewares/          # Error handler, validator, API logger, 404 handler
   utils/                # Mock data + helpers
   seeds/seedData.ts     # Dummy data bootstrapper
```

## ⚙️ Setup
1. **Install dependencies**
  ```bash
  cd server
  npm install
  ```
2. **Environment variables**
  ```bash
  cp .env.example .env
  # edit values (Mongo URI, CORS origins, etc.)
  ```
3. **Run locally**
  ```bash
  npm run dev              # tsx watch mode (http://localhost:3001)
  npm run build && npm start   # production build
  ```
4. **Seed mock data (optional)**
  ```bash
  npx ts-node src/seeds/seedData.ts
  ```

## 🔐 Middleware & Observability
- Helmet security headers
- Configurable CORS whitelist
- Express-rate-limit (per minute)
- Winston structured logging + custom API logger
- Joi-powered request validation
- Centralized error handler + typed ApiError
- Swagger docs exposed at `/api/docs`

## ✅ Implemented APIs
| Module | Method | Route | Description |
| --- | --- | --- | --- |
| Hero Search | POST | `/api/search/hero` | Smart hero banner recommendations, budget & season suggestions |
| Journey Planner | POST | `/api/search/journey` | Multi-modal transport options (mock data) |
| Destinations | GET/GET/:id/POST/PUT | `/api/destinations` | CRUD with Mongo fallback to mock data |
| Travel Categories | GET | `/api/categories` | Adventure, Beaches, Hills, Pilgrimage, Heritage |
| Tour Packages | GET/GET/:id/POST | `/api/packages` | Curated itineraries with pricing |
| Gallery | GET | `/api/gallery` | Moodboards for Indian locales |
| Special Features | POST | `/api/features/mood` | Mood analyzer suggestions |
| | POST | `/api/features/green-route` | CO₂-optimized route helper |
| | POST | `/api/features/budget` | Budget estimator & breakdown |
| Reviews | GET/POST | `/api/reviews` | Testimonials + DB-backed submissions |
| Blog | GET/GET/:id | `/api/blogs` | India-only travel guides |
| Contact Support | POST | `/api/contact` | Capture inquiries + create ticket reference |

Swagger schema + sample payloads available at `/api/docs` once the server runs.

## 🗄️ Models
- `Destination` – region, seasonality, highlights, gallery, rating.
- `Package` – slug, duration, INR price, inclusions, itinerary steps.
- `User` – basic profile + preferences (for future auth).
- `Review` – rating/comment tied to user/destination.
- `Blog` – slugged articles with tags + hero image.
- `ContactMessage` – captured support requests.

## 🌱 Mock Data & Seeding
`src/utils/mockData.ts` centralizes:
- Hero banner recommendations & season tips
- Journey transport combos
- Travel categories & gallery cards
- Sample destinations, packages, blogs, reviews

Run `npx ts-node src/seeds/seedData.ts` to dump these into Mongo. APIs automatically fall back to mock arrays if the database is empty, so the frontend keeps working even without seeding.

## 🚀 Render Deployment Guide
1. Push repo to GitHub.
2. Create a **Render Web Service** → set root directory to `server`.
3. Build & start commands:
  - Build: `npm install && npm run build`
  - Start: `npm start`
4. Environment variables to set:
  - `NODE_ENV=production`
  - `PORT=10000` (Render auto-injects, but keep fallback)
  - `MONGODB_URI=<your Atlas connection string>`
  - `CORS_ORIGIN=https://your-frontend.vercel.app`
  - `RATE_LIMIT=150`
  - `LOG_LEVEL=info`
5. Enable the health check endpoint `/api/health` for Render monitoring.

## 🧪 Useful Commands
| Command | Description |
| --- | --- |
| `npm run dev` | Live reload dev server |
| `npm run build` | TypeScript compile to `dist/` |
| `npm start` | Run compiled server |
| `npm test` | Jest test suite (placeholder) |
| `npx ts-node src/seeds/seedData.ts` | Seed database with mock data |

## 🔄 Next Integrations
- Plug hero/journey APIs into real IRCTC/flight partners
- Connect Mood Analyzer to face-api + Gemini endpoint
- Expand admin CMS for destinations/packages/reviews
- Harden auth & RBAC for editors and local guides

> Need another module? Create a controller + route, register it under `/src/routes/index.ts`, and wire a Joi schema. Logging, rate limiting, Swagger, and error handling will automatically cover it. 🚀
