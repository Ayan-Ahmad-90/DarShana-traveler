# Local Guide Portal - System Architecture & Flow Diagram

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + TypeScript)             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐   │
│  │  RightSidebar    │  │   Navigation     │  │  Dashboard   │   │
│  │  (Menu Items)    │  │   (Routes)       │  │  (Home Page) │   │
│  └────────┬─────────┘  └────────┬─────────┘  └──────────────┘   │
│           │                      │                                │
│           ├──────────────────────┼────────────────────────┐      │
│           ▼                      ▼                        ▼      │
│  ┌──────────────────────────────────────────┐  ┌─────────────┐  │
│  │        LOCAL GUIDE PORTAL SYSTEM         │  │  Other      │  │
│  │                                          │  │  Features   │  │
│  │  ┌────────────────────────────────────┐ │  └─────────────┘  │
│  │  │ 1. BecomeGuide.tsx                 │ │                   │
│  │  │    (5-Step Registration)           │ │                   │
│  │  │    - Step 1: Basic Info            │ │                   │
│  │  │    - Step 2: Expertise             │ │                   │
│  │  │    - Step 3: Pricing               │ │                   │
│  │  │    - Step 4: Documents             │ │                   │
│  │  │    - Step 5: Review                │ │                   │
│  │  └────────────────────────────────────┘ │                   │
│  │                                          │                   │
│  │  ┌────────────────────────────────────┐ │                   │
│  │  │ 2. LocalGuidesPortal.tsx           │ │                   │
│  │  │    (Guide Search & Browse)         │ │                   │
│  │  │    - Search (name/location)        │ │                   │
│  │  │    - Filters:                      │ │                   │
│  │  │      * Location                    │ │                   │
│  │  │      * Specialty                   │ │                   │
│  │  │      * Rating                      │ │                   │
│  │  │      * Price Range                 │ │                   │
│  │  │      * Languages                   │ │                   │
│  │  │      * Verified Only               │ │                   │
│  │  │    - Guide Cards                   │ │                   │
│  │  │    - Detail Modal                  │ │                   │
│  │  └────────────────────────────────────┘ │                   │
│  │                                          │                   │
│  │  ┌────────────────────────────────────┐ │                   │
│  │  │ 3. GuideRequestDetail.tsx          │ │                   │
│  │  │    (Trip Request Form)             │ │                   │
│  │  │    - Destination                   │ │                   │
│  │  │    - Travel Dates                  │ │                   │
│  │  │    - Number of Travelers           │ │                   │
│  │  │    - Request Type                  │ │                   │
│  │  │    - Message                       │ │                   │
│  │  │    - Cost Calculator               │ │                   │
│  │  └────────────────────────────────────┘ │                   │
│  │                                          │                   │
│  │  ┌────────────────────────────────────┐ │                   │
│  │  │ 4. GuideDashboard.tsx              │ │                   │
│  │  │    (Guide Management)              │ │                   │
│  │  │    - Tab 1: Overview               │ │                   │
│  │  │      * Stats & Analytics           │ │                   │
│  │  │    - Tab 2: Requests               │ │                   │
│  │  │      * Incoming Bookings           │ │                   │
│  │  │      * Accept/Reject               │ │                   │
│  │  │    - Tab 3: Profile                │ │                   │
│  │  │      * Edit Info                   │ │                   │
│  │  │    - Tab 4: Earnings               │ │                   │
│  │  │      * Revenue Stats               │ │                   │
│  │  └────────────────────────────────────┘ │                   │
│  │                                          │                   │
│  └──────────────────────────────────────────┘                   │
│                      │                                           │
└──────────────────────┼───────────────────────────────────────────┘
                       │
           HTTP/HTTPS API Requests
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js + Express)                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │            Route: /api/guides/*                            │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │  guideRegistration.js (Routes)                       │ │  │
│  │  │                                                      │ │  │
│  │  │  Public Endpoints:                                  │ │  │
│  │  │  ├─ GET    /api/guides                              │ │  │
│  │  │  ├─ GET    /api/guides/:guideId                     │ │  │
│  │  │  └─ GET    /api/guides/:guideId/availability        │ │  │
│  │  │                                                      │ │  │
│  │  │  Protected Endpoints (Auth Required):               │ │  │
│  │  │  ├─ POST   /api/guides/register                     │ │  │
│  │  │  ├─ GET    /api/guides/me                           │ │  │
│  │  │  ├─ PUT    /api/guides/me                           │ │  │
│  │  │  ├─ GET    /api/guides/stats                        │ │  │
│  │  │  ├─ GET    /api/guides/requests                     │ │  │
│  │  │  ├─ PUT    /api/guides/requests/:id/accept          │ │  │
│  │  │  ├─ PUT    /api/guides/requests/:id/reject          │ │  │
│  │  │  ├─ PUT    /api/guides/requests/:id/complete        │ │  │
│  │  │  └─ PUT    /api/guides/:id/rate                     │ │  │
│  │  │                                                      │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  │                      │                                      │  │
│  │                      ▼                                      │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │  guideRegistrationController.js (Business Logic)    │ │  │
│  │  │                                                      │ │  │
│  │  │  • registerGuide()                                  │ │  │
│  │  │  • getMyGuideProfile()                              │ │  │
│  │  │  • updateGuideProfile()                             │ │  │
│  │  │  • getAllGuides()                                   │ │  │
│  │  │  • getGuideById()                                   │ │  │
│  │  │  • getGuideStats()                                  │ │  │
│  │  │  • getGuideRequests()                               │ │  │
│  │  │  • acceptGuideRequest()                             │ │  │
│  │  │  • rejectGuideRequest()                             │ │  │
│  │  │  • completeTrip()                                   │ │  │
│  │  │  • rateGuide()                                      │ │  │
│  │  │  • getGuideAvailability()                           │ │  │
│  │  │                                                      │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  │                      │                                      │  │
│  └──────────────────────┼──────────────────────────────────────┘  │
│                         │                                         │
└─────────────────────────┼─────────────────────────────────────────┘
                          │
               Database Operations
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│                  DATABASE (MongoDB)                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Collections:                                                     │
│  ├─ LocalGuide                                                   │
│  │  ├─ _id, name, email, phone, location                        │
│  │  ├─ specialties[], languages[], bio                          │
│  │  ├─ pricePerDay, experience, certifications[]                │
│  │  ├─ responseTime, availability                               │
│  │  ├─ rating, reviews, profileImage                            │
│  │  ├─ verified, totalTrips, createdAt                          │
│  │  └─ documents (idProof, backgroundCheck)                     │
│  │                                                                │
│  ├─ GuideRequest                                                 │
│  │  ├─ _id, userId, guideId                                     │
│  │  ├─ destination, startDate, endDate, travelers               │
│  │  ├─ requestType, message                                     │
│  │  ├─ status (pending/accepted/completed/rejected)             │
│  │  ├─ createdAt, resolvedAt                                    │
│  │  └─ rejectionReason                                          │
│  │                                                                │
│  ├─ User (existing)                                              │
│  │  ├─ _id, fullName, email, phone                              │
│  │  ├─ isGuide (boolean flag)                                   │
│  │  ├─ guideId (reference to LocalGuide)                        │
│  │  └─ ... other fields                                         │
│  │                                                                │
│  └─ Other collections (Bookings, Trips, Notifications, etc.)   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### Flow 1: Guide Registration

```
User Visits /become-guide
         │
         ▼
Display BecomeGuide Component
         │
         ├─ Step 1: Collect Basic Info
         │  └─ Validate email, phone format
         │
         ├─ Step 2: Select Specialties & Languages
         │  └─ Validate min selections
         │
         ├─ Step 3: Set Pricing & Experience
         │  └─ Validate pricing range
         │
         ├─ Step 4: Upload Documents
         │  └─ Validate file types
         │
         └─ Step 5: Review & Confirm
            └─ User clicks Submit
                   │
                   ▼
         POST /api/guides/register
                   │
                   ▼
         Backend validates all fields
                   │
         ┌─────────┴─────────┐
         │                   │
         ▼ (Success)         ▼ (Error)
    Save to DB          Return error
         │               message
         ▼               │
   Return success    User corrects
    confirmation         and retries
         │
         ▼
   User notified:
   "Registration submitted,
    awaiting verification"
         │
         ▼
   User redirected to /guides
```

### Flow 2: Search & Book Guide

```
User Visits /guides
         │
         ▼
Display LocalGuidesPortal
         │
    ┌────┴────┐
    │          │
    ▼          ▼
 Search    Filters
(by name) (location,
(by      specialty,
location) rating,
(by       price,
specialty) language,
           verified)
    │          │
    └────┬─────┘
         │
         ▼
  Filter LocalGuide collection
  GET /api/guides?filters
         │
         ▼
  Display filtered guides
  as cards
         │
         ▼
  User clicks guide card
         │
         ▼
  Show detail modal
  (full bio, ratings,
   contact info)
         │
         ▼
  User clicks "Book This Guide"
         │
         ▼
  Navigate to /guide/:guideId
  GuideRequestDetail component
         │
         ▼
  User fills form:
  - Destination
  - Start/End dates
  - Travelers count
  - Request type
  - Message
         │
         ▼
  Cost calculator shows:
  Daily rate × Days × Travelers
         │
         ▼
  User clicks "Send Request"
         │
         ▼
  POST /api/guide-requests
         │
         ▼
  Backend creates GuideRequest
  - userId: logged-in user
  - guideId: selected guide
  - status: 'pending'
  - createdAt: now
         │
         ▼
  Return success response
         │
         ▼
  Show success screen
  "Request sent to guide"
         │
         ▼
  Redirect to /my-trips
```

### Flow 3: Guide Manages Requests

```
Guide Logs In
         │
         ▼
Open Dashboard
         │
         ▼
Click "Requests" Tab
         │
         ▼
GET /api/guides/requests
         │
         ▼
Display list of:
GuideRequest items with:
- Traveler info
- Destination
- Trip dates
- Travelers count
- Message
- Status badge
         │
    ┌────┴────┐
    │          │
    ▼          ▼
 Accept      Reject
    │          │
    ▼          ▼
PUT /request/
 accept
    │
    ▼
Update status
to 'accepted'
    │
    ▼
Notify traveler
    │
    ▼
Request moves
to "Accepted"
status

      OR

PUT /request/
 reject
    │
    ▼
Update status
to 'rejected'
    │
    ▼
Notify traveler
    │
    ▼
Request
disappears
or shows
"Rejected"
```

### Flow 4: Trip Completion & Earnings

```
After trip completed
         │
         ▼
Guide marks trip complete
PUT /guides/requests/:id/complete
         │
         ▼
Update GuideRequest:
- status: 'completed'
- resolvedAt: now
- totalTrips++
         │
         ▼
Calculate earnings:
earnings = pricePerDay × days
         │
         ▼
Update guide stats:
- completedTrips++
- totalEarnings += earnings
- responseRate recalculated
         │
         ▼
Guide views earnings tab:
GET /api/guides/stats
         │
         ▼
Display:
- Total earnings (all-time)
- Monthly earnings (estimate)
- Average per trip
- Recent transactions
         │
         ▼
Payment processing
(external payment gateway)
```

---

## 🗂️ File Structure

```
DarShana-travel/
│
├── src/
│   ├── components/
│   │   ├── Guide/
│   │   │   ├── BecomeGuide.tsx              ✅ NEW
│   │   │   ├── GuideDashboard.tsx           ✅ NEW
│   │   │   ├── LocalGuidesPortal.tsx        ✅ NEW
│   │   │   ├── GuideRequestDetail.tsx       ✅ NEW
│   │   │   └── (other components)
│   │   ├── RightSidebar.tsx                 ✅ USING
│   │   └── (other components)
│   │
│   ├── types/
│   │   └── index.ts                         ✅ UPDATED
│   │
│   └── (other folders)
│
├── backend/
│   ├── routes/
│   │   ├── guideRegistration.js             ✅ NEW
│   │   └── (other routes)
│   │
│   ├── controllers/
│   │   ├── guideRegistrationController.js   ✅ NEW
│   │   └── (other controllers)
│   │
│   ├── models/
│   │   ├── LocalGuide.js
│   │   ├── GuideRequest.js
│   │   └── (other models)
│   │
│   ├── uploads/
│   │   └── guides/                          ✅ CREATE
│   │
│   └── server.js                            ✅ UPDATE ROUTES
│
├── GUIDE_PORTAL_INTEGRATION.md              ✅ NEW
├── GUIDE_PORTAL_QUICK_START.md              ✅ NEW
└── (other files)
```

---

## 🔐 Security Considerations

```
┌─────────────────────────────────────────────┐
│          SECURITY LAYERS                     │
├─────────────────────────────────────────────┤
│                                              │
│ Layer 1: Frontend Validation                │
│ ├─ Email regex validation                   │
│ ├─ Phone number format check                │
│ ├─ Password strength validation             │
│ ├─ File type validation                     │
│ └─ Form field requirements                  │
│                                              │
│ Layer 2: Authentication                     │
│ ├─ JWT token verification                   │
│ ├─ Bearer token in Authorization header     │
│ ├─ Token expiration checks                  │
│ └─ Protected routes middleware              │
│                                              │
│ Layer 3: Backend Validation                 │
│ ├─ Field type checking                      │
│ ├─ Enum value validation                    │
│ ├─ File size limits                         │
│ ├─ Duplicate email checks                   │
│ └─ User ownership verification              │
│                                              │
│ Layer 4: Database                           │
│ ├─ MongoDB indexes on unique fields         │
│ ├─ Schema validation                        │
│ ├─ Referential integrity                    │
│ └─ Access control lists                     │
│                                              │
│ Layer 5: API Rate Limiting                  │
│ ├─ Throttle requests per IP                 │
│ ├─ Limit file uploads                       │
│ └─ Monitor suspicious activity              │
│                                              │
└─────────────────────────────────────────────┘
```

---

## 📊 Entity Relationship Diagram

```
┌──────────────────┐
│      User        │
├──────────────────┤
│ _id              │
│ fullName         │
│ email (unique)   │
│ phone            │
│ isGuide          │◄─────┐
│ guideId          │      │ One-to-One
│ createdAt        │      │
└──────────────────┘      │
                          │
                    ┌─────┴──────────────┐
                    │                    │
                    ▼                    │
            ┌──────────────────┐        │
            │   LocalGuide     │        │
            ├──────────────────┤        │
            │ _id              │◄───────┘
            │ name             │
            │ email            │ One-to-Many
            │ phone            │ (Can have multiple)
            │ location         │
            │ specialties[]    │
            │ languages[]      │
            │ rating           │
            │ reviews          │
            │ verified         │
            │ pricePerDay      │
            │ createdAt        │
            └────────┬─────────┘
                     │
                     │ One-to-Many
                     ▼
            ┌──────────────────────────┐
            │    GuideRequest          │
            ├──────────────────────────┤
            │ _id                      │
            │ userId (FK to User)      │
            │ guideId (FK to Guide)    │
            │ destination              │
            │ startDate                │
            │ endDate                  │
            │ travelers                │
            │ requestType              │
            │ message                  │
            │ status                   │
            │ createdAt                │
            │ resolvedAt               │
            └──────────────────────────┘
```

---

## 🎯 Key Relationships

1. **User → LocalGuide** (One-to-One)
   - A user can be at most one verified guide
   - isGuide boolean flag and guideId reference

2. **LocalGuide → GuideRequest** (One-to-Many)
   - One guide can have many incoming requests
   - Each request references the guideId

3. **User → GuideRequest** (One-to-Many)
   - One user can make many guide requests
   - Each request references the userId

4. **Guide → Earnings** (One-to-Many)
   - Calculated from completed GuideRequests
   - pricePerDay × number_of_days × travelers_count

---

## 📈 Scalability Considerations

```
Current Architecture:
- Fits well for ~1,000 guides and ~10,000 requests

For scaling to 100k+ guides:
1. Add database indexes on frequently queried fields
2. Implement caching layer (Redis) for guide listings
3. Use pagination in list endpoints
4. Add full-text search indexes for name/bio
5. Implement geospatial indexes for location filtering
6. Use message queues for email notifications
7. Separate read and write databases
8. Add CDN for image storage
9. Implement rate limiting and circuit breakers
10. Use load balancing for multiple backend instances
```

---

## ✅ Completed Tasks

- ✅ Frontend components (4 files, ~5,500 lines)
- ✅ Backend controller (~520 lines)
- ✅ Backend routes (~45 lines)
- ✅ TypeScript types (enhanced)
- ✅ Form validation
- ✅ Error handling
- ✅ Mock data
- ✅ Documentation
- ✅ Navigation integration

## 📋 Ready for Next Phase

- [ ] Connect to actual database
- [ ] Set up file upload storage
- [ ] Configure email notifications
- [ ] Implement payment gateway
- [ ] Create admin verification dashboard
- [ ] Add real-time notifications
- [ ] Implement image optimization
- [ ] Set up monitoring & logging
- [ ] Create backup & recovery procedures
- [ ] Deploy to production

---

**Architecture Status:** ✅ **COMPLETE & DOCUMENTED**
