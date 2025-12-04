# Local Guide Portal - Complete Integration Guide

## Overview

This guide covers the complete integration of the Local Guide Portal system, which includes:
- **Guide Registration Portal** - For users to become verified local guides
- **Guide Dashboard** - For guides to manage bookings, earnings, and ratings
- **Guide Search Portal** - For users to find and book guides
- **Guide Request System** - For users to request specific guides for trips

---

## Architecture

### Frontend Components

```
src/components/Guide/
├── BecomeGuide.tsx           # 5-step guide registration form
├── GuideDashboard.tsx         # Dashboard for registered guides
├── LocalGuidesPortal.tsx      # User-facing guide search portal
└── GuideRequestDetail.tsx     # Request submission form for booking guides
```

### Backend

```
backend/
├── controllers/
│   └── guideRegistrationController.js    # Guide registration & management logic
├── routes/
│   └── guideRegistration.js              # All guide-related endpoints
└── models/
    └── LocalGuide.js (existing)          # Guide schema
    └── GuideRequest.js (existing)        # Request schema
```

---

## Integration Steps

### Step 1: Update Navigation Routes

In your main router/App.tsx, add these routes:

```typescript
import BecomeGuide from './components/Guide/BecomeGuide';
import GuideDashboard from './components/Guide/GuideDashboard';
import LocalGuidesPortal from './components/Guide/LocalGuidesPortal';
import GuideRequestDetail from './components/Guide/GuideRequestDetail';

// In your routing configuration:
<Route path="/become-guide" element={<BecomeGuide />} />
<Route path="/guides" element={<LocalGuidesPortal />} />
<Route path="/guide/:guideId" element={<GuideRequestDetail />} />
<Route path="/guide-dashboard" element={<GuideDashboard />} />
```

### Step 2: Update RightSidebar Navigation

Your RightSidebar.tsx already has the navigation items:
- "Local Guides" → `/guides` (takes users to guide search portal)
- "Guide portal" → `/become-guide` (takes users to registration portal)

This is correct and ready to use!

### Step 3: Backend Integration

In your main backend server file (e.g., `backend/server.js` or `backend/src/index.ts`):

```javascript
const guideRegistrationRoutes = require('./routes/guideRegistration');

// Add to your express app:
app.use('/api/guides', guideRegistrationRoutes);
```

### Step 4: Create Uploads Directory

Create a directory for guide document uploads:

```bash
mkdir -p backend/uploads/guides
```

Add to `.gitignore`:
```
backend/uploads/
```

### Step 5: Update Database Models

Ensure your `LocalGuide` model includes all these fields:

```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  location: String,
  specialties: [String],
  languages: [String],
  bio: String,
  pricePerDay: Number,
  experience: String,
  certifications: [String],
  responseTime: String,
  availability: String, // 'available', 'unavailable', 'on_leave'
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  profileImage: String,
  verified: { type: Boolean, default: false },
  totalTrips: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}
```

---

## Feature Walkthrough

### 1. Guide Registration (BecomeGuide.tsx)

**5-Step Process:**

**Step 1: Basic Information**
- Full Name, Email, Phone
- Primary Location
- Availability Status

**Step 2: Expertise & Languages**
- Select specialties (min. 3 options)
- Select languages (min. 2 options)
- Write professional bio (min. 50 chars)
- Optional certifications

**Step 3: Pricing & Experience**
- Set daily rate (₹500 - ₹50,000)
- Years of experience
- Response time preference

**Step 4: Document Verification**
- Upload ID Proof (Passport/Aadhar/License)
- Upload Background Check Certificate

**Step 5: Review & Submit**
- Verify all information
- Submit application
- Profile enters verification queue

**Endpoint:** `POST /api/guides/register`

```bash
# Request (multipart/form-data):
{
  fullName: "Raj Kumar",
  email: "raj@guide.com",
  phone: "+91-9876543210",
  location: "Goa",
  specialties: ["Beach Tourism", "Water Sports"],
  languages: ["English", "Hindi"],
  bio: "Experienced guide with 10 years in Goa tourism",
  pricePerDay: 2500,
  experience: 10,
  certifications: ["First Aid Certified"],
  availability: "available",
  responseTime: "1 hour",
  idProof: <File>,
  backgroundCheck: <File>
}

# Response:
{
  success: true,
  message: "Guide registration submitted. Please wait for verification.",
  guide: {
    _id: "...",
    name: "Raj Kumar",
    // ... all guide details
  }
}
```

### 2. Guide Search Portal (LocalGuidesPortal.tsx)

**Features:**
- Search by guide name, location, specialty
- Filter by:
  - Location (Goa, Kerala, Rajasthan, etc.)
  - Specialty (select from list)
  - Minimum Rating (4.0+, 4.5+, 4.8+)
  - Maximum Daily Rate
  - Verified guides only
  - Languages spoken

**Guide Cards Display:**
- Profile image with verification badge
- Rating (stars + number of reviews)
- Location
- Daily rate
- Top specialties (2 shown, +X more)
- Book Now & Details buttons

**Modal Details View:**
- Full bio
- All specialties & languages
- Contact information
- Statistics (completed trips, response time)
- Action buttons (Book Now, Send Message)

**Endpoints:**
- `GET /api/guides` - Get all verified guides
- `GET /api/guides/:guideId` - Get single guide details
- `GET /api/guides/:guideId/availability` - Check availability

### 3. Guide Request Form (GuideRequestDetail.tsx)

**Form Fields:**
- **Destination** - Where you want to go (required)
- **Start Date** - Trip start date (required)
- **End Date** - Trip end date (required, must be after start)
- **Number of Travelers** - 1-10 people (required)
- **Request Type** - travel_queries, trip_planning, recommendations, emergency, booking_assistance
- **Message** - Detailed message (min. 20 chars, required)

**Cost Calculator:**
- Shows daily rate, number of days, travelers count
- Calculates total estimated cost
- Displays pricing breakdown

**Endpoint:** `POST /api/guide-requests`

```bash
# Request:
{
  guideId: "guide_id_here",
  destination: "Goa",
  startDate: "2025-12-20",
  endDate: "2025-12-25",
  travelers: 3,
  requestType: "trip_planning",
  message: "Looking for a 5-day beach tour with water sports activities"
}

# Response:
{
  success: true,
  message: "Request sent to guide successfully",
  request: {
    _id: "...",
    userId: "...",
    guideId: "...",
    status: "pending",
    createdAt: "..."
  }
}
```

### 4. Guide Dashboard (GuideDashboard.tsx)

**Tab 1: Overview**
- Total Requests, Completed Trips, Total Earnings, Current Rating
- Quick stats cards
- Earnings chart placeholder

**Tab 2: Requests**
- List of all incoming requests
- Shows destination, dates, travelers, message
- Status badges (pending, accepted, completed)
- Action buttons: Accept, Decline

**Tab 3: Profile**
- Display all guide information
- Edit profile button
- View specialties, languages
- Verification status

**Tab 4: Earnings**
- Total earnings (all time)
- Monthly earnings estimate
- Average earnings per trip
- Payment method management
- Recent transactions list

**Endpoints:**
- `GET /api/guides/me` - Get my profile
- `GET /api/guides/stats` - Get statistics
- `GET /api/guides/requests` - Get all requests
- `PUT /api/guides/requests/:requestId/accept` - Accept request
- `PUT /api/guides/requests/:requestId/reject` - Reject request
- `PUT /api/guides/requests/:requestId/complete` - Mark trip complete
- `PUT /api/guides/:guideId/rate` - Add guide rating

---

## API Endpoints Reference

### Public Endpoints

```
GET /api/guides
  - Get all verified guides with optional filters
  - Query: location, specialty, minRating, verified
  
GET /api/guides/:guideId
  - Get single guide details
  
GET /api/guides/:guideId/availability
  - Check guide availability for date range
  - Query: startDate, endDate
```

### Protected Endpoints (Require Auth Token)

```
POST /api/guides/register
  - Register as a guide
  - Body: multipart/form-data with all guide info + documents
  
GET /api/guides/me
  - Get current user's guide profile
  
PUT /api/guides/me
  - Update guide profile
  - Body: fields to update (excluding verified, rating)
  
GET /api/guides/stats
  - Get guide statistics and analytics
  
GET /api/guides/requests
  - Get all requests for current guide
  - Query: status (optional filter)
  
PUT /api/guides/requests/:requestId/accept
  - Accept a guide request
  
PUT /api/guides/requests/:requestId/reject
  - Reject a guide request
  - Body: { reason: "optional reason" }
  
PUT /api/guides/requests/:requestId/complete
  - Mark trip as completed
  
PUT /api/guides/:guideId/rate
  - Rate a guide
  - Body: { rating: 1-5, review: "optional review" }
```

---

## TypeScript Types

All types are defined in `src/types/index.ts`:

```typescript
interface LocalGuide {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  specialties: string[];
  rating: number;
  reviews: number;
  profileImage: string;
  bio: string;
  languages: string[];
  verified: boolean;
  pricePerDay?: number;
  experience?: string;
  certifications?: string[];
  availability?: 'available' | 'unavailable' | 'on_leave';
  responseTime?: string;
  totalTrips?: number;
}

interface GuideRegistration {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  specialties: string[];
  languages: string[];
  bio: string;
  pricePerDay: number;
  experience: number;
  certifications: string[];
  documents: {
    idProof: File | string;
    backgroundCheck: File | string;
  };
  availability: 'available' | 'unavailable' | 'on_leave';
  responseTime: string;
  profileImage?: File | string;
}

interface GuideStats {
  totalRequests: number;
  acceptedRequests: number;
  completedTrips: number;
  totalEarnings: number;
  rating: number;
  reviewCount: number;
  responseRate: number;
}

interface GuideRequest {
  id: string;
  userId: string;
  guideId: string;
  destination?: string;
  startDate?: Date;
  endDate?: Date;
  travelers?: number;
  requestType: 'travel_queries' | 'trip_planning' | 'recommendations' | 'emergency' | 'booking_assistance';
  message: string;
  status: 'pending' | 'accepted' | 'completed' | 'rejected';
  createdAt: Date;
  resolvedAt?: Date;
}
```

---

## User Flows

### User Wants to Become a Guide

1. User logs in
2. Opens sidebar menu
3. Clicks "Guide portal" → Routes to `/become-guide`
4. Completes 5-step registration form
5. Submits application with documents
6. Receives confirmation message
7. Admin reviews and verifies profile
8. Guide can access dashboard

### User Wants to Find and Book a Guide

1. User logged in
2. Opens sidebar menu
3. Clicks "Local Guides" → Routes to `/guides`
4. Searches/filters available guides
5. Clicks "Details" to view guide profile
6. Clicks "Book This Guide"
7. Redirected to `/guide/:guideId` (GuideRequestDetail)
8. Fills out trip details
9. Submits booking request
10. Guide receives request in dashboard
11. Guide accepts/declines request
12. User notified of guide's response

### Guide Manages Requests

1. Guide logs in
2. Opens sidebar menu
3. Clicks navigation to dashboard (if added)
4. Views incoming requests in "Requests" tab
5. Reviews destination, dates, message
6. Accepts or declines request
7. Once trip complete, marks as complete
8. Earnings updated and displayed

---

## Customization Options

### Specialties List
Edit in `LocalGuidesPortal.tsx` and `BecomeGuide.tsx`:
```typescript
const specialtyOptions = [
  'Beach Tourism',
  'Mountain Trekking',
  'Cultural Tours',
  'Adventure Sports',
  // Add more...
];
```

### Languages List
Edit in components:
```typescript
const languageOptions = [
  'English',
  'Hindi',
  'Spanish',
  // Add more...
];
```

### Pricing Guidelines
Edit in `BecomeGuide.tsx` step 3:
```typescript
// Modify the pricing guidelines displayed to guides
```

### Colors & Styling
All components use Tailwind CSS with teal/blue color scheme. Modify:
- Primary: `teal-600`, `bg-teal-50`
- Secondary: `blue-600`, `bg-blue-50`
- Success: `green-600`
- Warning: `yellow-600`
- Danger: `red-600`

---

## Testing Checklist

- [ ] Guide can register with all fields
- [ ] Document upload validation works
- [ ] User can search guides by location/specialty
- [ ] Filter and sorting works correctly
- [ ] Pricing calculator works accurately
- [ ] Guide can accept/reject requests
- [ ] Status updates reflect in real-time
- [ ] Earnings calculation is correct
- [ ] Rating system works
- [ ] Email notifications sent (if configured)
- [ ] Mobile responsiveness works
- [ ] Form validation on all inputs

---

## Troubleshooting

**Issue:** Guide registration fails with "Missing required fields"
- **Solution:** Ensure all form fields are filled and validation passes before submission

**Issue:** File upload not working
- **Solution:** Check `backend/uploads/guides/` directory exists and is writable

**Issue:** Guides not appearing in search
- **Solution:** Ensure `verified: true` in database or remove filter from query

**Issue:** Cost calculation shows 0
- **Solution:** Ensure `pricePerDay` is set for guide and dates are valid

---

## Notes

- All components are fully responsive (mobile, tablet, desktop)
- Form validation prevents invalid submissions
- Mock data available for development/testing
- All endpoints require authentication where specified
- File uploads use multipart/form-data
- Cost calculations are real-time
- Earnings are based on completed trips × daily rate

---

## Next Steps

1. ✅ Frontend components created
2. ✅ Backend controller created
3. ✅ Routes defined
4. **TODO:** Connect to actual database
5. **TODO:** Implement email notifications
6. **TODO:** Add payment gateway integration
7. **TODO:** Create admin verification dashboard
8. **TODO:** Implement real-time notifications
9. **TODO:** Add guide portfolio/reviews section
10. **TODO:** Implement cancellation policies
