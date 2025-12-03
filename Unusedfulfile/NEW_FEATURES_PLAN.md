# Travel Hub - New Features Implementation Plan

## ✨ Feature 1: Trip Planning with Festival/Sightseeing Suggestions

### Database Models Needed
```typescript
// Festival model - with date, location, description
// Sightseeing model - with location, description, rating
// BudgetOption model - with category, price range
// TripSuggestion model - combine all above
```

### API Endpoints
```
GET /api/suggestions/festivals?month=11&location=Delhi
GET /api/suggestions/sightseeing?location=Delhi&priceRange=budget
GET /api/suggestions/combined?month=11&location=Delhi
POST /api/trips/with-suggestions (save trip with suggestions)
```

### Frontend Components
```
- TripPlannerWithSuggestions.tsx
- FestivalSuggestions.tsx
- SightSeeingCard.tsx
- BudgetOptions.tsx
```

---

## 🌱 Feature 2: Eco-Friendly Rewards System

### Database Models
```typescript
// EcoActivity model - walking, cycling, public transport
// Reward model - points, badges, tier levels
// UserRewards model - track user's reward balance
```

### Reward Types (from ChatGPT research)
- Points for eco-friendly activities
- Badges: "Carbon Warrior", "Green Traveler", "Eco Champion"
- Discounts on future bookings
- Special offers
- Leaderboard rankings

### API Endpoints
```
POST /api/eco-activities/log (log eco activity)
GET /api/rewards/user (get user's rewards)
GET /api/rewards/leaderboard
POST /api/rewards/redeem
```

### Frontend Components
```
- EcoActivitiesTracker.tsx
- RewardsDashboard.tsx
- Leaderboard.tsx
- RewardRedemption.tsx
```

---

## 👥 Feature 3: Local Guide Dashboard

### Database Models
```typescript
// LocalGuide model - name, location, specialization, ratings
// GuideSchedule model - availability, pricing
// UserInteraction model - user-guide chats/bookings
```

### API Endpoints
```
POST /api/guides/register (guide registration)
GET /api/guides/by-location?location=Delhi
PUT /api/guides/:id/profile (update guide profile)
POST /api/guides/:id/interact (user interaction)
GET /api/guides/:id/schedule
```

### Frontend Components
```
- GuideRegistration.tsx
- GuideDashboard.tsx
- GuideListing.tsx
- GuideInteraction.tsx
- GuideChat.tsx
```

---

## 📊 Implementation Priority

1. **Phase 1 (Week 1)**: Festival/Sightseeing Suggestions
2. **Phase 2 (Week 2)**: Eco-Friendly Rewards
3. **Phase 3 (Week 3)**: Local Guide Dashboard

---

## 🗂️ Files to Create

### Backend
```
server/src/models/
├── Festival.ts
├── Sightseeing.ts
├── BudgetOption.ts
├── EcoActivity.ts
├── Reward.ts
├── LocalGuide.ts
└── GuideInteraction.ts

server/src/controllers/
├── suggestionController.ts
├── rewardController.ts
└── guideController.ts

server/src/routes/
├── suggestionRoutes.ts
├── rewardRoutes.ts
└── guideRoutes.ts
```

### Frontend
```
src/pages/
├── TripPlannerWithSuggestions.tsx
├── RewardsDashboard.tsx
├── LocalGuideDashboard.tsx
└── GuideListing.tsx

src/components/
├── FestivalSuggestions.tsx
├── SightSeeingCard.tsx
├── EcoActivitiesTracker.tsx
├── RewardCard.tsx
├── GuideCard.tsx
└── GuideChat.tsx
```

---

Ready to implement? I can start with Feature 1 first.
