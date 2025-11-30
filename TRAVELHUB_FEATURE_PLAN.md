# TravelHub Feature Roadmap

Date: 2025-11-30

## 1. Requirements Coverage Snapshot

| # | Feature | Current Status | Notes |
|---|---------|----------------|-------|
| 1 | Hero section with media background, search bar (destination, check-in/out, budget), CTA buttons, highlighted offers | ❌ Missing | Needs new `HeroBanner` component + backend offers feed |
| 2 | Destinations showcase (image, desc, weather, map, reviews) | ❌ Missing | Will add `DestinationsSection` + `/api/destinations` endpoint (with weather + reviews data) |
| 3 | Booking system (hotels, flights, tours, calendar, availability, email confirmations) | ⚠️ Partial | Basic forms exist but not booking flow. Need models, routes, email service, and frontend booking widgets |
| 4 | Tour packages (duration, hotel, transport, price, inclusions, itinerary) | ❌ Missing | Add `TourPackages` component + `/api/packages` |
| 5 | Travel categories (honeymoon, family, etc.) | ❌ Missing | Add grid component referencing config |
| 6 | Gallery/photos/video tours | ❌ Missing | Add `MediaGallery` with video embed/360 placeholder |
| 7 | User accounts/profile (save destination, history, recommendations) | ⚠️ Partial | Auth exists; need UI for favorites/history and backend endpoints |
| 8 | Reviews & ratings (testimonials + Google reviews) | ❌ Missing | Add testimonials component + backend route |
| 9 | Blog / travel guide (SEO) | ⚠️ Partial | Docs exist, but no blog UI. Need `/api/blog` + `TravelBlog` section |
|10 | Interactive map w/ hover interactions | ❌ Missing | Add Mapbox/Leaflet section |
|11 | Contact & support (WhatsApp, chatbot, inquiry form, 24x7) | ⚠️ Partial | Contact route exists; need UI w/ chat buttons |
|12 | Special features (AI planner, currency converter, weather API, expense calculator, language selector) | ⚠️ Partial | Mood analyzer exists; add AI planner UI + supporting services |
|13 | Admin panel for managing content | ❌ Missing | Need placeholder admin routes + instructions |

## 2. Implementation Phases

1. **Experience Layer (Frontend)**
   - Build modular sections under `src/components/travelhub/` (HeroBanner, SearchBar, OffersCarousel, DestinationsGrid, TourPackages, TravelCategories, Gallery, Reviews, BlogHighlights, InteractiveMap, ContactSupport, SpecialFeatures).
   - Update `src/pages/TravelHub.tsx` to compose sections, fed by data from API hooks.

2. **Platform Services (Backend)**
   - Models: `Destination`, `Package`, `Booking`, `Review`, `BlogPost`, `Offer`.
   - Controllers + routes for each (`/api/destinations`, `/api/packages`, `/api/bookings`, `/api/reviews`, `/api/blog`, `/api/offers`).
   - Services: weather (OpenWeather), currency (exchangerate.host), email (Nodemailer), expense calculator util.
   - AI Planner endpoint reusing Gemini/GPT integration.
   - Admin routes with JWT protection + CRUD.

3. **Experience Integrations**
   - Hook frontend components to new APIs via `src/services/travelHubApi.ts`.
   - Add context/state for favorites, booking history, language selection, currency preference.

## 3. Immediate Sprint Scope (Sprint A)

- Hero banner + search widget + CTA + seasonal offers slider.
- Destinations grid with placeholder weather + map links.
- Tour packages cards + itinerary modal.
- Travel categories tiles + gallery section.
- Backend scaffolding for destinations/packages/offers/bookings (read + create).
- Service utilities (weather proxy, currency converter stub, email stub).

## 4. Future Sprints

- Booking engine (real availability, payment integration).
- Admin console (React-based) + RBAC.
- AI planner UX + chatbot integration.
- Interactive map with clustering.
- Blog CMS integration (Markdown or headless CMS).

---

This document will be updated as features ship.
