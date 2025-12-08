# DarShana Travelers — Judge Script (Slides in Markdown)

**Purpose / Motive**
- A single, India-focused travel studio to plan and book quickly: transport, stays, packages, food, culture, and festivals in one place.
- Data-driven discovery with maps, filters, and curated CTAs that jump users to booking or maps fast.

**How the main features work**
- Travel Essentials page: cards for flights/trains/bus/cabs (external trusted links), curated packages and stays with CTAs to 

`/booking?destination=…&category=…`, and a food section with search, history chips, top-city filters, and map links.
- TravelHub page: immersive hero with quick scroll buttons (destinations, packages, contact), sections for travel categories, route map, destinations, packages, gallery, features, map embed, reviews, blogs, and contact support.
- Festivals page: Leaflet map + grid powered by 

`festivalsData`; popups show month/type/location. Cultural highlights and historical places are data-driven; South India festivals and heritage sites are included.
- Destinations catalog (destinations.ts): typed entries with mood/energy/social/adventure ranges, tags, season, state, and price/day—reused across UI sections.
- Booking flow: CTAs build query params so 

`/booking` can pick up destination/category; external partner links open in new tabs where appropriate.
- UX details: framer-motion animations, Tailwind-style utility classes, Lucide icons; Google Maps links for “View map”/“Open in maps”; default Leaflet markers for reliability.

**Why it’s coherent**
- Everything is backed by structured arrays (destinations, festivals, culture, food spots), so extending content doesn’t require code changes.
- Filters/search are memoized and local; no hidden state. External links are safe (`rel="noreferrer"`); internal navigation uses `Link`.
- Visuals: gradients, hero offers, and map sections make discovery easy; CTAs keep users moving toward booking.

If you want this framed for a pitch deck or demo script, I can tailor it to a 60–90 second flow.

## 1) Why it matters
- Single hub for trip essentials: book transport, pick packages/stays, explore food & culture fast.
- Data-driven UI: destinations, festivals, cultural highlights, food spots all come from typed arrays.
- Map + filters: users discover by place/time/type and jump out to booking or maps.

## 2) Frontend stack
- React + TypeScript + react-router; UI cards and grids fed by data constants.
- Framer Motion for micro-animations; Leaflet for festival map pins.
- Lucide icons; Tailwind-style utility classes for layout/spacing.

## 3) Travel Essentials page (user launchpad)
- Hero CTA: “Book travel fast, stay covered.”
- Transport cards: trusted outbound links (flights/trains/bus/cabs).
- Packages + stays: CTA to `/booking?destination=…&category=…` to keep users in our flow.
- Food section: search (city/dish/shop), recent-search chips, top-city filters, result count, map CTA per spot.

## 4) Festivals page (culture explorer)
- `festivalsData`: national + South India adds (Ugadi, Vishu, Thaipusam, Makara Sankranti, Navratri South, Karaga, Thrissur/Kollam Pooram, Makaravilakku).
- Map view (Leaflet) + grid; popups show month/type/location, image, coords.
- `culturalHighlights`: expanded with Bharatanatyam, Kathakali, Carnatic, Kuchipudi, Mohiniyattam, Yoga/Ayurveda, Tanjore/Mysore painting, textiles.
- `historicalPlaces`: South India heritage adds (Hampi, Meenakshi, Shore Temple, Golconda, Charminar, Brihadeeswarar, Mysore Palace, Belur/Halebidu, Srirangam, Sravanabelagola, Lepakshi, Warangal, Nandi Hills, Badami, Thanjavur Palace, Udayagiri AP).

## 5) Destinations data (shared catalog)
- `src/data/destinations.ts`: mood/energy/social/adventure ranges, state, season, price/day.
- New heritage entries mirror the historical list for reuse across components.

## 6) Backend / seeds (lightweight)
- `backend/seeds/seedQuestions.js`: FAQs on culture/language/itinerary/safety.
- `backend/festival-server.cjs`: sample events (e.g., Konark Dance, Pongal) for a simple festival feed.
- Mostly acts as a data source; no heavy business logic.

## 6.1) AI Mood Analyzer (how it works)
- Purpose: detect user mood from a quick face scan to recommend destinations and experiences that match energy/social/adventure levels.
- Frontend: opens a consented camera capture; runs face detection locally and sends a small encoded frame to the mood API only after user allows.
- Backend: mood endpoint scores expressions (happy/calm/stressed/neutral) and maps them to ranges used by `DESTINATIONS` (mood/energy/social/adventure). Returns top picks plus tags (calming/nature/nightlife/adventure).
- Privacy: no video is stored; a single frame is processed server-side and discarded. If camera is blocked, we fall back to a self-report slider flow.
- Usage in app: the analyzer feeds personalized tiles and can bias the Travel Essentials suggestions and destination cards; users can always bypass or redo the scan.

## 7) Demo flow (talk track)
1) Land on Travel Essentials → show transport links and booking CTAs.
2) Open a package/stay → note `/booking` query params.
3) Scroll to food → type city/dish, click a history chip, toggle a top-city filter, open map link.
4) Switch to Festivals → show map pins, filter by type/month, open a popup.
5) Highlight cultural/historical cards powered by the arrays.

## 8) What to say about quality
- Typed data + memoized filters; no hidden state.
- External links use `rel="noreferrer"`; internal uses `Link` for SPA navigation.
- Animations are lightweight; map uses default Leaflet markers for reliability.

## 9) How to extend (Q&A prompts)
- Add destinations/festivals by appending to the arrays (no code changes).
- Wire `/booking` to backend availability service; add auth for saved trips.
- Add sorting (price/season) or persona-based filters using existing mood/energy scores.

## 10) URLs to mention
- Internal booking: `/booking?destination=<name>&category=<package|stay>`
- Map CTAs: Google Maps links per food/stay card.

*(Use these bullets as slide text; each numbered section can be one slide. Keep it under 3 minutes.)*
