# Travel Hub - Complete Full-Stack Platform

A comprehensive travel booking platform built with React, Express, and MongoDB. Search and book flights, trains, cruises, private jets, cabs, and bike rentals all in one place.

## 🎯 Project Overview

Travel Hub is a full-stack web application that allows users to:
- Search for multiple transport modes (flights, trains, cruises, private jets, cabs, bikes)
- Compare prices and options
- Create user accounts and manage bookings
- View booking history
- Get AI-powered travel suggestions

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 19 + TypeScript
- Tailwind CSS v4
- React Router v7.9.6
- Vite v7.2.2
- Lucide React Icons

**Backend:**
- Express.js + TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Joi Validation

**Testing:**
- Jest
- Supertest

## 📁 Project Structure

```
DarShana-travel/
├── src/                          # Frontend source
│   ├── pages/
│   │   ├── TravelHub.tsx        # Main search page (flights, trains, etc)
│   │   ├── Login.tsx            # User login
│   │   ├── Register.tsx         # User registration
│   │   └── MyBookings.tsx       # View past bookings
│   ├── services/
│   │   ├── api.ts               # API client & endpoints
│   │   └── geminiService.ts     # Existing Gemini service
│   ├── context/
│   │   └── AuthContext.tsx      # Authentication state
│   └── components/
│
├── server/                       # Backend source
│   ├── src/
│   │   ├── index.ts             # Main Express app
│   │   ├── routes/
│   │   │   ├── authRoutes.ts    # Auth endpoints
│   │   │   ├── flightRoutes.ts  # Flight search
│   │   │   ├── trainRoutes.ts   # Train search
│   │   │   ├── bookingRoutes.ts # Booking management
│   │   │   ├── transportRoutes.ts
│   │   │   └── smartPlannerRoutes.ts
│   │   ├── controllers/         # Request handlers
│   │   ├── services/            # Business logic
│   │   ├── models/              # MongoDB schemas
│   │   ├── middleware/
│   │   │   ├── auth.ts          # JWT authentication
│   │   │   └── errorHandler.ts  # Error handling
│   │   ├── utils/
│   │   │   ├── validators.ts    # Input validation
│   │   │   └── helpers.ts       # Helper functions
│   │   └── config/
│   │       └── database.ts      # MongoDB connection
│   ├── tests/
│   │   └── api.test.ts          # API tests
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.json
│   └── .env.example
│
└── package.json                 # Frontend dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- npm or yarn

### Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
echo "VITE_BACKEND_URL=http://localhost:3001/api" > .env.production

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Configure your .env.local with:
# - MONGODB_URI (MongoDB Atlas connection string)
# - JWT_SECRET (random secret key)
# - PORT (default 3001)
# - CORS_ORIGIN (frontend URL)

# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## 📡 API Endpoints

### Authentication

```
POST   /api/auth/register          # Create new account
POST   /api/auth/login             # Login user
GET    /api/auth/profile           # Get user profile (protected)
PUT    /api/auth/profile           # Update profile (protected)
```

### Flight Search

```
GET    /api/flights/search         # Search flights
       ?from=Delhi&to=Mumbai&date=2024-01-15&passengers=1

GET    /api/flights/popular-routes # Popular routes
GET    /api/flights/:id            # Flight details
```

### Train Search

```
GET    /api/trains/search          # Search trains
       ?from=Delhi&to=Mumbai&date=2024-01-15

GET    /api/trains/schedule        # Train schedule
GET    /api/trains/:id             # Train details
```

### Bookings

```
POST   /api/bookings               # Create booking (protected)
GET    /api/bookings/my-bookings   # User's bookings (protected)
GET    /api/bookings/:bookingId    # Booking details (protected)
POST   /api/bookings/:bookingId/cancel  # Cancel booking (protected)
GET    /api/bookings/stats         # Booking statistics (protected)
```

### Transport Options

```
GET    /api/transport/cabs/search  # Search cabs
GET    /api/transport/cruises/search
GET    /api/transport/jets/search  # Private jets
GET    /api/transport/bikes/search # Bike rentals
```

### Smart Planner

```
GET    /api/planner/suggestions    # Get suggestions
       ?budget=15000&mood=relaxed&weather=sunny
```

## 🛂 Authentication Flow

1. User registers via `/register` page
2. Password hashed with bcryptjs
3. User stored in MongoDB
4. User logs in, receives JWT token
5. Token stored in localStorage
6. Token sent in Authorization header for protected routes
7. Backend validates token with middleware
8. User data retrieved from token payload

## 📦 Database Models

### User
- name, email, phone
- password (hashed)
- preferences (airlines, hotels, seat preference)
- bookings array
- timestamps

### Flight
- flightNumber, airline, aircraft
- origin, destination
- departureTime, arrivalTime, duration
- price, availableSeats
- amenities, class

### Train
- trainNumber, trainName, trainType
- source, destination
- departureTime, arrivalTime
- classes (AC1, AC2, AC3, Sleeper, General)
- stops, frequency

### Cab
- provider (uber, ola, taxi)
- pickupLocation, dropoffLocation
- distance, estimatedDuration
- price, driverRating

### Cruise
- cruiseName, cruiseLine
- embarkPort, disembarkPort
- departureDate, returnDate, duration
- cabinTypes, amenities

### Booking
- bookingId (unique)
- userId, bookingType, itemId
- passengers array
- totalPrice, paymentStatus, bookingStatus
- specialRequests, insuranceIncluded

## 🧪 Testing

Run backend tests:

```bash
cd server
npm test                 # Run tests
npm run test:watch     # Watch mode
```

Tests cover:
- User registration & login
- Flight search
- Train search
- Booking creation
- API health checks

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Input validation with Joi
- CORS protection
- Protected routes with auth middleware
- MongoDB injection prevention
- Error handling without stack traces in production

## 📊 Mock Data

For development, the backend provides mock data for:
- 4 flights per search with random times and prices
- 4 train types with multiple classes
- 2 cab options (Uber, Ola)
- 1 cruise option
- 1 private jet option
- Multiple bike rental options

## 🌐 Deployment

### Frontend (Vercel)

```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Render)

```bash
cd server
npm run build
# Deploy with environment variables configured
```

## 🔧 Configuration

### Environment Variables

**Frontend (.env.production):**
```
VITE_BACKEND_URL=https://your-backend-url.com/api
```

**Backend (.env.local):**
```
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:5173,https://your-frontend.com
```

## 📝 Features

✅ **Search:**
- Multi-mode transport search
- Date & city selection
- Passenger count options

✅ **Booking:**
- Secure booking creation
- Unique booking IDs
- Passenger details management
- Special requests

✅ **User Accounts:**
- Registration & login
- Profile management
- Booking history
- Preference settings

✅ **Smart Features:**
- AI-powered suggestions (mock implementation)
- Budget-based recommendations
- Weather considerations
- Mood-based transport suggestions

## 🐛 Troubleshooting

**CORS Errors:**
- Ensure CORS_ORIGIN environment variable includes frontend URL
- Check backend is running on correct port
- Verify credentials: true in CORS options

**MongoDB Connection:**
- Check connection string format
- Verify IP whitelist in MongoDB Atlas
- Confirm database user credentials

**Authentication Issues:**
- Verify JWT_SECRET is set
- Check token expiration
- Clear localStorage and re-login

## 📚 API Documentation

For detailed API documentation, see `/server/README.md`

## 🤝 Contributing

This is a portfolio project. Feel free to fork and extend!

## 📄 License

MIT License

## 👥 Author

Built with ❤️ as a full-stack travel booking platform demo.

---

**Status:** ✅ MVP Complete with full search, booking, and authentication features
