# Travel Hub - Complete User Account System

## Backend API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
```json
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "securepass123",
  "confirmPassword": "securepass123"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  }
}
```

#### POST /api/auth/login
Login user
```json
Request:
{
  "email": "john@example.com",
  "password": "securepass123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "profileImage": "url_or_null",
    "preferredLanguage": "en"
  }
}
```

#### GET /api/auth/me
Get current user (requires authentication)
```json
Response:
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "gender": "male",
    "dob": "1990-01-01",
    "profileImage": null,
    "address": "123 Main St",
    "preferredLanguage": "en",
    "travelInterests": ["Adventure", "Beach"]
  }
}
```

### User Profile Endpoints

#### GET /api/user/profile
Get complete user profile (requires auth)

#### PUT /api/user/profile
Update user profile (requires auth)
```json
Request:
{
  "name": "Jane Doe",
  "phone": "9876543210",
  "gender": "female",
  "dob": "1990-01-01",
  "address": "123 New St",
  "city": "New York",
  "country": "USA",
  "travelInterests": ["Adventure", "Beach", "Food"]
}
```

#### PUT /api/user/profile-image
Update profile image (requires auth)
```json
Request:
{
  "profileImage": "https://example.com/image.jpg"
}
```

#### DELETE /api/user/account
Delete user account (requires auth)

### Trip Management Endpoints

#### GET /api/trips/my-trips
Get user's trips (requires auth)
```json
Response:
{
  "success": true,
  "upcomingTrips": [...],
  "pastTrips": [...],
  "total": 5
}
```

#### POST /api/trips/book
Book a new trip (requires auth)
```json
Request:
{
  "mode": "flight",
  "from": "New York",
  "to": "London",
  "date": "2024-12-25",
  "returnDate": "2024-12-31",
  "price": 500,
  "passengers": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210"
    }
  ],
  "specialRequests": "Window seat preferred",
  "paymentMethod": "card"
}

Response:
{
  "success": true,
  "message": "Trip booked successfully",
  "booking": {
    "bookingId": "BK-1234567890-123",
    "status": "upcoming",
    "totalPrice": 500,
    "date": "2024-12-25"
  }
}
```

#### GET /api/trips/:tripId
Get trip details (requires auth)

#### PUT /api/trips/:tripId/cancel
Cancel a trip (requires auth)

### Festival Alerts Endpoints

#### GET /api/festivals/alerts
Get festival alerts (requires auth)
```json
Query params:
- region: "North India" (optional)

Response:
{
  "success": true,
  "alerts": [
    {
      "_id": "festival_id",
      "name": "Diwali",
      "region": "North India",
      "date": "2024-11-01",
      "description": "Festival of lights",
      "templateId": "template_ysa4wpb"
    }
  ]
}
```

#### POST /api/festivals/subscribe
Subscribe to festival alerts (requires auth)
```json
Request:
{
  "festivalId": "festival_id",
  "region": "North India"
}
```

#### POST /api/festivals/unsubscribe
Unsubscribe from festival alerts (requires auth)
```json
Request:
{
  "festivalId": "festival_id"
}
```

#### PUT /api/festivals/preferences
Update notification preferences (requires auth)
```json
Request:
{
  "emailNotifications": true,
  "festivalAlerts": true,
  "smsNotifications": false,
  "region": "North India"
}
```

### Language Endpoints

#### GET /api/language/list
Get available languages (requires auth)
```json
Response:
{
  "success": true,
  "languages": [
    { "code": "en", "name": "English" },
    { "code": "hi", "name": "हिन्दी (Hindi)" },
    { "code": "ur", "name": "اردو (Urdu)" },
    { "code": "ta", "name": "தமிழ் (Tamil)" },
    { "code": "te", "name": "తెలుగు (Telugu)" },
    { "code": "kn", "name": "ಕನ್ನಡ (Kannada)" },
    { "code": "ml", "name": "മലയാളം (Malayalam)" }
  ]
}
```

#### GET /api/language/user-language
Get user's language preference (requires auth)

#### PUT /api/language/user-language
Update user's language preference (requires auth)
```json
Request:
{
  "language": "hi"
}
```

## Frontend Components

### Pages Created
1. **Login.tsx** - Combined Sign In/Sign Up page
2. **Profile.tsx** - User profile management
3. **MyTrips.tsx** - View upcoming and past trips
4. **FestivalAlerts.tsx** - Subscribe to festival notifications
5. **LanguageSelector.tsx** - Change language preference
6. **Register.tsx** - Trip booking form

### Context
- **AuthContext** - Manages authentication state, user data, and methods

### API Services
- **authApi** - Authentication endpoints
- **userApi** - User profile management
- **tripApi** - Trip management
- **festivalApi** - Festival alerts
- **languageApi** - Language preferences

### Routes to Add in App.tsx

```typescript
import MyTrips from './pages/MyTrips';
import FestivalAlerts from './pages/FestivalAlerts';
import LanguageSelector from './pages/LanguageSelector';

// Add in Routes component:
<Route path="/my-trips" element={<MyTrips />} />
<Route path="/festival-alerts" element={<FestivalAlerts />} />
<Route path="/language" element={<LanguageSelector />} />
```

## Menu Behavior After Login

When user is logged in, the sidebar/navbar should show:
- My Profile
- My Trips
- Festival Alerts
- Language
- Logout

When user is not logged in, show:
- Sign In
- Register

## Database Models

### User
- name, email, phone (required)
- password (hashed with bcrypt)
- gender, dob, profileImage, address, city, country
- savedTrips: []
- notificationPreferences: {emailNotifications, festivalAlerts, smsNotifications, region}
- preferredLanguage: (en, hi, ur, ta, te, kn, ml)
- travelInterests: []

### Trip
- userId (required)
- mode: flight/train/cab/bus/bike/hotel/package
- from, to, date, price (required)
- returnDate, bookingId, status, passengers, specialRequests, paymentMethod, totalPrice

### FestivalAlert
- name, region, date, description (required)
- templateId: template_ysa4wpb
- subscribers: []

## Authentication Flow

1. User navigates to /login
2. User can toggle between Sign In and Sign Up
3. On successful auth, token saved in localStorage
4. JWT token sent with every authenticated request
5. On app load, auto-login using stored token
6. User stays logged in across sessions

## Production Checklist

- [ ] Replace "secret" with strong JWT_SECRET in .env
- [ ] Update MONGODB_URI to actual database
- [ ] Update CORS_ORIGIN for production domains
- [ ] Test all endpoints with Postman
- [ ] Add password reset functionality
- [ ] Add email verification
- [ ] Add rate limiting
- [ ] Add input validation with joi
- [ ] Test complete auth flow
- [ ] Deploy frontend and backend
