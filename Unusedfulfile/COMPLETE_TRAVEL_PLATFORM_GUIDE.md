# DarShana Travel Platform - Complete Integration Guide

## Overview
This document provides complete integration instructions for the DarShana Travel Platform with all UI components, database models, and API endpoints.

---

## PROJECT STRUCTURE

```
DarShana-travel/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── SignUp.tsx
│   │   │   │   └── Login.tsx
│   │   │   ├── Profile/
│   │   │   │   └── MyProfile.tsx
│   │   │   ├── Contact/
│   │   │   │   └── ContactUs.tsx
│   │   │   ├── Booking/
│   │   │   │   └── TripBooking.tsx
│   │   │   ├── Guides/
│   │   │   │   └── LocalGuideSupport.tsx
│   │   │   ├── Festivals/
│   │   │   │   └── FestivalAlerts.tsx
│   │   │   ├── Navigation/
│   │   │   │   └── PostLoginNav.tsx
│   │   │   └── ...
│   │   ├── types/
│   │   │   └── index.ts (TypeScript interfaces)
│   │   └── ...
│   └── package.json
├── backend/
│   ├── server.js (Express server)
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Trip.js
│   │   ├── Destination.js
│   │   ├── Festival.js
│   │   ├── LocalGuide.js
│   │   ├── GuideRequest.js
│   │   ├── ContactMessage.js
│   │   ├── Booking.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── profile.js
│   │   ├── bookings.js
│   │   ├── guides.js
│   │   ├── festivals.js
│   │   ├── contact.js
│   │   └── notifications.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── profileController.js
│   │   ├── bookingController.js
│   │   ├── guideController.js
│   │   ├── festivalController.js
│   │   ├── contactController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   └── auth.js
│   └── package.json
└── README.md
```

---

## DATABASE MODELS

### 1. User Model
```javascript
// backend/models/User.js
const userSchema = {
  _id: ObjectId,
  fullName: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  profileImage: String,
  createdAt: Date,
  updatedAt: Date,
  preferences: {
    language: String ('en' or 'hi'),
    notifications: Boolean,
    theme: String ('light' or 'dark')
  }
};
```

### 2. Trip Model
```javascript
// backend/models/Trip.js
const tripSchema = {
  _id: ObjectId,
  userId: ObjectId (ref: User),
  destination: {
    id: String,
    name: String,
    country: String,
    state: String,
    description: String,
    image: String,
    coordinates: { latitude: Number, longitude: Number },
    upcomingFestivals: [ObjectId] (ref: Festival)
  },
  startDate: Date,
  endDate: Date,
  travelers: [{
    fullName: String,
    email: String,
    phone: String,
    age: Number,
    documentType: String,
    documentNumber: String,
    relationship: String
  }],
  transport: String ('Plane', 'Train', 'Bus', 'Ship', 'Bike', 'Car'),
  status: String ('upcoming', 'completed', 'cancelled'),
  bookingId: ObjectId (ref: Booking),
  totalCost: Number,
  createdAt: Date
};
```

### 3. LocalGuide Model
```javascript
// backend/models/LocalGuide.js
const localGuideSchema = {
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  location: String,
  specialties: [String],
  rating: Number,
  reviews: Number,
  profileImage: String,
  bio: String,
  languages: [String],
  verified: Boolean,
  createdAt: Date
};
```

### 4. GuideRequest Model
```javascript
// backend/models/GuideRequest.js
const guideRequestSchema = {
  _id: ObjectId,
  userId: ObjectId (ref: User),
  guideId: ObjectId (ref: LocalGuide),
  requestType: String ('travel_queries', 'trip_planning', 'recommendations', 'emergency', 'booking_assistance'),
  message: String,
  status: String ('pending', 'accepted', 'completed'),
  createdAt: Date,
  resolvedAt: Date
};
```

### 5. ContactMessage Model
```javascript
// backend/models/ContactMessage.js
const contactMessageSchema = {
  _id: ObjectId,
  subject: String,
  fullName: String,
  email: String,
  phone: String,
  message: String,
  status: String ('pending', 'read', 'resolved'),
  createdAt: Date
};
```

### 6. Festival Model
```javascript
// backend/models/Festival.js
const festivalSchema = {
  _id: ObjectId,
  name: String,
  location: String,
  startDate: Date,
  endDate: Date,
  description: String,
  image: String,
  significance: String,
  createdAt: Date
};
```

### 7. Booking Model
```javascript
// backend/models/Booking.js
const bookingSchema = {
  _id: ObjectId,
  userId: ObjectId (ref: User),
  tripId: ObjectId (ref: Trip),
  paymentStatus: String ('pending', 'completed', 'failed'),
  bookingReference: String (unique),
  createdAt: Date,
  updatedAt: Date
};
```

### 8. Notification Model
```javascript
// backend/models/Notification.js
const notificationSchema = {
  _id: ObjectId,
  userId: ObjectId (ref: User),
  type: String ('festival_alert', 'booking_update', 'guide_response', 'general'),
  title: String,
  message: String,
  relatedId: ObjectId,
  read: Boolean (default: false),
  createdAt: Date
};
```

---

## API ENDPOINTS

### Authentication Endpoints

#### 1. Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "Secure@123"
}

Response (201):
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

#### 2. Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Secure@123"
}

Response (200):
{
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### 3. Logout
```
POST /api/auth/logout
Authorization: Bearer jwt_token_here

Response (200):
{
  "message": "Logged out successfully"
}
```

---

### Profile Endpoints

#### 4. Get User Profile
```
GET /api/profile
Authorization: Bearer jwt_token_here

Response (200):
{
  "id": "user_id",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "profileImage": "url",
  "upcomingTrips": [...],
  "pastTrips": [...],
  "savedDestinations": [...],
  "preferences": { ... }
}
```

#### 5. Update User Profile
```
PUT /api/profile
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "fullName": "John Updated",
  "phone": "9876543211",
  "profileImage": "url"
}

Response (200): Updated user object
```

---

### Trip Booking Endpoints

#### 6. Create Trip Booking
```
POST /api/bookings
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "destination": {
    "id": "dest_1",
    "name": "Goa",
    "country": "India",
    "state": "Goa"
  },
  "startDate": "2024-12-01",
  "endDate": "2024-12-05",
  "travelers": [
    {
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "age": 25,
      "documentType": "passport",
      "documentNumber": "A12345678"
    }
  ],
  "transport": "Plane",
  "totalCost": 50000
}

Response (201):
{
  "id": "booking_id",
  "bookingReference": "DB-ABC123",
  "status": "pending",
  "totalCost": 50000
}
```

#### 7. Get User's Bookings
```
GET /api/bookings
Authorization: Bearer jwt_token_here

Response (200):
[
  {
    "id": "booking_id",
    "destination": { ... },
    "startDate": "2024-12-01",
    "status": "upcoming",
    "totalCost": 50000
  },
  ...
]
```

#### 8. Process Payment
```
POST /api/bookings/:bookingId/payment
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "cardNumber": "1234567890123456",
  "expiryDate": "12/25",
  "cvv": "123",
  "amount": 50000
}

Response (200):
{
  "paymentStatus": "completed",
  "bookingReference": "DB-ABC123",
  "message": "Payment successful"
}
```

---

### Local Guide Endpoints

#### 9. Get Available Guides
```
GET /api/guides?location=Goa
Authorization: Bearer jwt_token_here

Response (200):
[
  {
    "id": "guide_1",
    "name": "Raj Kumar",
    "location": "Goa",
    "rating": 4.8,
    "reviews": 156,
    "specialties": ["Beach Tourism", "Water Sports"],
    "verified": true,
    "languages": ["English", "Hindi"]
  },
  ...
]
```

#### 10. Submit Guide Request
```
POST /api/guide-requests
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "guideId": "guide_1",
  "requestType": "trip_planning",
  "message": "I need help planning my 5-day Goa trip"
}

Response (201):
{
  "id": "request_id",
  "status": "pending",
  "createdAt": "2024-11-27T00:00:00Z"
}
```

#### 11. Get Guide Requests
```
GET /api/guide-requests
Authorization: Bearer jwt_token_here

Response (200):
[
  {
    "id": "request_id",
    "guideId": "guide_1",
    "requestType": "trip_planning",
    "message": "...",
    "status": "pending",
    "createdAt": "..."
  },
  ...
]
```

---

### Contact Us Endpoints

#### 12. Submit Contact Form
```
POST /api/contact
Content-Type: application/json

{
  "subject": "Booking Support",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "message": "I need help with my booking"
}

Response (201):
{
  "id": "message_id",
  "status": "pending",
  "createdAt": "2024-11-27T00:00:00Z",
  "message": "Thank you for contacting us. We'll respond shortly."
}
```

EmailJS Configuration:
- Service ID: (your EmailJS service ID)
- Template ID: template_ysa4wpb
- Public Key: (your EmailJS public key)
- Email Template Variables: to_email, subject, from_name, from_email, phone, message, timestamp

---

### Festival Endpoints

#### 13. Get All Festivals
```
GET /api/festivals
Authorization: Bearer jwt_token_here

Response (200):
[
  {
    "id": "festival_1",
    "name": "Diwali",
    "location": "Across India",
    "startDate": "2024-11-01",
    "endDate": "2024-11-02",
    "description": "Festival of Lights",
    "significance": "Celebrates victory of light over darkness",
    "image": "url"
  },
  ...
]
```

#### 14. Get Festivals by Location
```
GET /api/festivals?location=Goa
Authorization: Bearer jwt_token_here

Response (200): Filtered festivals array
```

#### 15. Set Festival Reminder
```
POST /api/festival-reminders
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "festivalId": "festival_1",
  "location": "Goa"
}

Response (201):
{
  "id": "reminder_id",
  "festivalId": "festival_1",
  "status": "active",
  "message": "Reminder set successfully"
}
```

---

### Notification Endpoints

#### 16. Get User Notifications
```
GET /api/notifications
Authorization: Bearer jwt_token_here

Response (200):
[
  {
    "id": "notif_1",
    "type": "festival_alert",
    "title": "Diwali in Delhi",
    "message": "Diwali celebrations coming up...",
    "read": false,
    "createdAt": "2024-11-27T00:00:00Z"
  },
  ...
]
```

#### 17. Mark Notification as Read
```
PUT /api/notifications/:notificationId/read
Authorization: Bearer jwt_token_here

Response (200):
{
  "id": "notif_1",
  "read": true,
  "message": "Notification marked as read"
}
```

---

## FRONTEND INTEGRATION

### Environment Variables (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=template_ysa4wpb
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
REACT_APP_ADMIN_EMAIL=admin@darshanatravel.com
```

### Usage in Components

```typescript
// Using API endpoints in components
const fetchProfile = async () => {
  const response = await fetch('/api/profile', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
  });
  const data = await response.json();
  return data;
};

// EmailJS integration in ContactUs component
import emailjs from '@emailjs/browser';

emailjs.send(
  process.env.REACT_APP_EMAILJS_SERVICE_ID,
  process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
  {
    to_email: process.env.REACT_APP_ADMIN_EMAIL,
    subject: formData.subject,
    from_name: formData.fullName,
    from_email: formData.email,
    phone: formData.phone,
    message: formData.message,
    timestamp: new Date().toLocaleString(),
  }
);
```

---

## BACKEND SETUP

### Install Dependencies
```bash
cd backend
npm install express mongoose bcryptjs jsonwebtoken dotenv cors nodemailer
```

### Express Server Setup (server.js)
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/guides', require('./routes/guides'));
app.use('/api/guide-requests', require('./routes/guides'));
app.use('/api/festivals', require('./routes/festivals'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/notifications', require('./routes/notifications'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## AUTHENTICATION MIDDLEWARE

```javascript
// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
```

---

## DEPLOYMENT CHECKLIST

- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] CORS properly configured
- [ ] JWT_SECRET set securely
- [ ] EmailJS credentials configured
- [ ] MongoDB connection string validated
- [ ] Frontend API URL updated for production
- [ ] HTTPS enabled for production
- [ ] Rate limiting implemented
- [ ] Error logging configured
- [ ] Security headers added
- [ ] Database backups scheduled

---

## USER FLOW

1. **Sign Up**: User creates account with Full Name, Email, Phone, Password
2. **Login**: User logs in and receives JWT token
3. **Dashboard**: Navigation menu appears after login
4. **My Profile**: View and edit all user details, upcoming trips, past trips, saved destinations
5. **My Trips**: Create new trip booking → Select destination → Choose transport → Fill traveler details → Confirm booking → Payment → Success
6. **Local Guide**: Browse verified guides → Send request → Get personalized assistance
7. **Contact Us**: Submit support requests that go to admin via EmailJS
8. **Festival Alerts**: Get location-based festival notifications → Set reminders
9. **Language**: Switch between English and Hindi
10. **Logout**: Clear session and authentication token

---

## FEATURES IMPLEMENTED

✅ User Authentication (Sign Up / Login / Logout)
✅ My Profile Page (Auto-save, Upcoming/Past Trips, Saved Destinations)
✅ Local Guide Support (Trust, Queries, Planning, Emergency Help)
✅ Contact Us Form (EmailJS Integration)
✅ Trip Booking Flow (6-step process with payment)
✅ Festival Alerts & Notifications (Location-based)
✅ Post-Login Navigation (8 menu items + Language selector)
✅ Responsive Design (Mobile & Desktop)
✅ Professional UI/UX
✅ TypeScript Type Safety

---

## TESTING CREDENTIALS

For development/testing:
- Email: test@example.com
- Password: Test@12345
- Phone: 9876543210

---

## SUPPORT & DOCUMENTATION

For issues or questions:
1. Check API documentation above
2. Review component TypeScript interfaces
3. Check environment variables
4. Verify database connections
5. Check browser console for errors

---

Generated: November 27, 2024
Version: 1.0.0
