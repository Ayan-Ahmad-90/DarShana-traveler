# 🚀 DarShana Travel - TravelHub.tsx & Sustainable.tsx Complete Documentation

---

## 📁 File Overview

| File | Location | Lines | Purpose |
|------|----------|-------|---------|
| `TravelHub.tsx` | `src/pages/` | ~105 | Main Travel Hub landing page |
| `Sustainable.tsx` | `src/pages/` | ~537 | Green Route Planner page |

---

# 🏠 TravelHub.tsx - Complete Feature Guide

## 📋 Overview
TravelHub.tsx main landing page hai jo travel booking platform ka heart hai. Ye page 11 major sections ko combine karta hai.

## 🎨 Background Design Features
```
✅ World Map SVG Pattern - opacity 4%
✅ Gradient Overlays - cyan + orange tones
✅ Floating Animated Dots - 6 pulse animations
✅ Dotted Route Lines - SVG path decorations
```

## 🧩 All 11 Components (Sections)

### 1️⃣ HeroBanner (`HeroBanner.tsx`)
**Location:** Top of page
**Features:**
- 🎯 Main headline with gradient text
- 🔍 Search form (Destination, Check-In, Check-Out, Budget)
- 🏷️ Seasonal Offers Cards (3 offers with discounts)
  - Himalayan Snow Trails - 25% OFF
  - Festive South Circuit - 15% OFF
  - Desert Glow Retreat - 20% OFF
- 📞 Action Buttons: Book Now, Explore Destinations, Contact
- 🌈 Glassmorphism design with backdrop blur

**Props:**
```typescript
interface HeroBannerProps {
  onSearch?: (payload: HeroSearchPayload) => void;
  onExploreDestinations?: () => void;
  onContact?: () => void;
}
```

---

### 2️⃣ TravelCategoriesSection (`TravelCategoriesSection.tsx`)
**Purpose:** Travel categories browse karne ke liye
**6 Categories:**

| Icon | Category | Description |
|------|----------|-------------|
| ❤️ Heart | Wellness & Ayurveda | Kerala retreats, Himalayan yoga domes |
| 👨‍👩‍👧‍👦 Users | Family Holidays | Tiger safaris, theme resorts |
| ⛰️ Mountain | Adventure India | Himalayan treks, scuba circuits |
| 🧭 Compass | Workcation & Solo | Co-living stays (Goa, Rishikesh) |
| ☔ Umbrella | Weekend Drives | Two-night micro itineraries |
| 🌐 Globe | Pilgrimage Trails | Char Dham, Jyotirlinga circuits |

---

### 3️⃣ RouteMapSection (`RouteMapSection.tsx`)
**Purpose:** Interactive route planner with Google Maps
**Features:**
- 📍 Origin & Destination Input Fields
- 🔄 Popular Routes Quick Selection:
  - Delhi → Lucknow
  - Mumbai → Pune
  - Bangalore → Mysore
  - Chennai → Pondicherry
  - Jaipur → Udaipur
  - Kolkata → Darjeeling
- 🗺️ Google Maps Embed with Directions
- ⏱️ Distance & Duration Display
- 🔄 Clear Route Button

**Working:**
```
User enters origin/destination → Click Search → 
Simulated API call (800ms) → Google Maps Embed shows route → 
Distance/Duration calculated
```

---

### 4️⃣ DestinationsSection (`DestinationsSection.tsx`)
**Purpose:** Popular destinations showcase
**3 Featured Destinations:**

| Destination | Region | Temperature | Weather |
|-------------|--------|-------------|---------|
| Leh-Ladakh | Trans-Himalaya | 12°C | Clear Skies |
| Coorg, Karnataka | Western Ghats | 22°C | Misty |
| Sohra & Mawlynnong | Northeast India | 18°C | Partly Cloudy |

**Features per card:**
- 🖼️ High-quality destination image
- 🌡️ Live weather overlay
- ⭐ Rating & Reviews count
- 📍 Region badge
- 🔗 Google Maps link

---

### 5️⃣ TourPackagesSection (`TourPackagesSection.tsx`)
**Purpose:** Pre-designed tour packages with full details
**2 Sample Packages:**

#### Package 1: Kashmir Silk Route (6 days)
- 💰 Price: ₹82,500 per person
- 🏨 Hotel: Boutique houseboats & Srinagar villas
- ✈️ Transport: Flight + dedicated SUV
- ✅ Includes: Breakfast & dinner, Shikara cruise, Inner line permits
- ❌ Excludes: Personal shopping, Travel insurance
- 📅 Day-wise itinerary (6 days)

#### Package 2: Kerala Backwater & Wellness (7 days)
- 💰 Price: ₹74,000 per person
- 🏨 Hotel: Lakefront eco resorts + Ayurveda retreat
- ✈️ Transport: Flight + private cab + houseboat
- 📅 Day-wise itinerary (7 days)

---

### 6️⃣ GallerySection (`GallerySection.tsx`)
**Purpose:** Visual gallery with stunning travel photos
**4 Gallery Items:**
1. Starlit Pangong Lake – Ladakh
2. Dev Deepawali Aarti – Varanasi
3. Backwater sunrise – Alleppey
4. Tiger trail golden hour – Bandhavgarh

**Features:**
- 🖼️ Image grid (4 columns on desktop)
- 📝 Caption overlay with gradient
- 🎥 "Watch 360° tours" button

---

### 7️⃣ SpecialFeaturesSection (`SpecialFeaturesSection.tsx`)
**Purpose:** DarShana platform ke unique features
**5 Special Features:**

| Icon | Feature | Description |
|------|---------|-------------|
| 🤖 Bot | AI Travel Planner | Chat-based planner for Indian states |
| 💰 DollarSign | Rupee Price Lock | Hold INR fares for 30 minutes |
| ☁️ Cloud | Weather & Advisory | Real-time IMD feeds + 5-day predictions |
| 🧮 Calculator | Expense Calculator | Total INR cost before checkout |
| 🌐 Languages | Language Selector | Hindi, English, and more |

---

### 8️⃣ InteractiveMapSection (`InteractiveMapSection.tsx`)
**Purpose:** Explore India map with hotspots
**3 Hotspots:**
1. Great Rann of Kutch - Salt desert sunsets
2. Hampi - UNESCO ruins, boulder hikes
3. Kaziranga - One-horned rhino safaris

**Features:**
- 🗺️ Google My Maps embed
- 📍 Coordinate display for each hotspot
- 🔗 "Open details" button

---

### 9️⃣ ReviewsSection (`ReviewsSection.tsx`)
**Purpose:** Customer testimonials & ratings
**3 Testimonials:**
1. **Priya Malhotra** (Mumbai) - Kashmir trip - ⭐ 5.0
2. **Arjun Narayanan** (Bengaluru) - Coorg workcation - ⭐ 4.9
3. **Meera Kapoor** (New Delhi) - Meghalaya trip - ⭐ 5.0

**Features:**
- 💬 Quote icon design
- ⭐ Star rating display
- 👤 Author name & location

---

### 🔟 BlogHighlightsSection (`BlogHighlightsSection.tsx`)
**Purpose:** Travel guides & blog posts
**3 Blog Posts:**
1. Konkan monsoon drive itinerary (Nov 25, 2025)
2. Permit guide for Northeast expeditions (Nov 12, 2025)
3. Ayurveda retreat packing checklist (Oct 30, 2025)

**Features:**
- 📅 Date display
- 🏷️ Tags (Roadtrip, Monsoon, Wellness, etc.)
- 📖 "Read guide →" button

---

### 1️⃣1️⃣ ContactSupportSection (`ContactSupportSection.tsx`)
**Purpose:** Contact form & support channels
**Support Channels:**
1. 💬 WhatsApp Concierge: +91 98 765 43210
2. 📞 24×7 India Desk: +91 80 4893 2211
3. 📧 Priority Email: support@darshana.travel

**Contact Form Fields:**
- Full name
- Email
- Phone / WhatsApp
- Inquiry details
- Submit button

---

# 🌿 Sustainable.tsx - Complete Feature Guide

## 📋 Overview
Sustainable.tsx "Green Route Planner" page hai jo eco-friendly travel options dikhata hai.

## 🎯 Main Purpose
Carbon footprint calculate karna, reward points earn karna, aur sustainably travel karna.

---

## 🧩 All Features

### 1️⃣ Header Section
```
🌿 Green Route Planner
"Calculate your footprint, earn rewards, and travel sustainably."
```
- Leaf icon with teal background
- Gradient text styling

---

### 2️⃣ Premium Banner (Link to GreenRoutePlanner)
**Purpose:** New premium feature ka promotion
**Design:**
- Gradient background (emerald → teal → cyan)
- "NEW PREMIUM FEATURE" badge with sparkles
- Features highlight: Live map • Real-time CO₂ tracking • Compare modes
- "Try Now" button with arrow animation

**Links to:** `/green-route-planner`

---

### 3️⃣ Search Form (Route Planner)
**Input Fields:**

| Field | Type | Placeholder | Features |
|-------|------|-------------|----------|
| Origin | Text + Autocomplete | "e.g., New Delhi" | Location suggestions dropdown |
| Destination | Text + Autocomplete | "e.g., Jaipur" | Location suggestions dropdown |

**Swap Button:** 🚗 Origin aur Destination ko swap karta hai

**Submit Button:** "Calculate Impact" (teal color)

**Autocomplete Working:**
```
User types → 250ms debounce → searchLocations() API call → 
Suggestions dropdown shows → User clicks suggestion → 
Field filled + dropdown closes
```

---

### 4️⃣ Location Autocomplete Dropdown
**Features:**
- 📍 MapPin icon per suggestion
- 🔤 Location name (bold)
- 🏷️ Location type (uppercase, small text)
- ⏳ Loading spinner while searching
- ❌ "No matches found" message

---

### 5️⃣ Error Handling
**Error Messages Display:**
- Red background with AlertCircle icon
- Detailed error messages:
  - "Please enter both origin and destination"
  - "Origin and destination cannot be the same"
  - Backend connection errors with setup instructions

---

### 6️⃣ Results Header
**Shows after route calculation:**
- 📍 "Routes from {origin} to {destination}"
- 📏 Distance in km
- ⏱️ Duration formatted (e.g., "5h 30m")

---

### 7️⃣ Summary Cards (3 Cards)
**When route data has summary:**

| Card | Color | Info |
|------|-------|------|
| Distance & Duration | Teal | km + time + source |
| Emission Savings | Emerald | CO₂ saved + percentage |
| Best Mode | Amber | Best transport mode + cost |

---

### 8️⃣ Route Options Grid
**Transport Modes Available:**
- ✈️ Flight (Plane icon)
- 🚂 Train (Train icon)
- 🚌 Bus (Bus icon)
- 🚗 Car (Car icon)
- 🚴 Bike (Bike icon)

**Each Route Card Shows:**

| Info | Description |
|------|-------------|
| Mode | Transport type name |
| Time | Departure/arrival info |
| Duration | Travel time |
| Cost | ₹ (Indian Rupees) |
| CO₂ Emissions | kg of carbon |
| Reward Points | Green points earned |
| Sustainability Score | 0-10 with progress bar |

**Badges:**
- 🏆 "Best Mode" (amber badge) - Most optimal choice
- 🌿 "Eco Choice" (teal badge) - greenScore >= 8

**Green Score Color Coding:**
- 🟢 >= 7: Teal (eco-friendly)
- 🟡 >= 4: Yellow (moderate)
- 🔴 < 4: Red (high emissions)

---

### 9️⃣ Loading State
**Shows while calculating:**
- ⏳ Spinning loader animation
- "Calculating sustainable routes..." text

---

### 🔟 API Integration

**Backend Endpoint:** `POST /api/routes`

**Request Body:**
```json
{
  "from": "New Delhi",
  "to": "Jaipur"
}
```

**Response Structure:**
```typescript
interface RouteResponse {
  from: string;
  to: string;
  distance: number;
  durationMinutes: number;
  options: RouteOption[];  // All transport options
  summary?: RouteSummary;  // Best mode info
}

interface RouteOption {
  mode: string;           // "Train", "Bus", etc.
  time: string;           // "06:00 - 12:30"
  durationMinutes: number;
  distance: number;
  cost: number;           // in INR
  co2: number;            // kg CO₂
  greenScore: number;     // 0-10
  rewards: number;        // green points
  description: string;
}
```

---

## 🔧 Technical Implementation

### State Variables:
```typescript
const [from, setFrom] = useState('');                    // Origin input
const [to, setTo] = useState('');                        // Destination input
const [loading, setLoading] = useState(false);           // Loading state
const [routeData, setRouteData] = useState(null);        // API response
const [error, setError] = useState(null);                // Error messages
const [fromSuggestions, setFromSuggestions] = useState([]);  // Origin autocomplete
const [toSuggestions, setToSuggestions] = useState([]);      // Destination autocomplete
const [activeField, setActiveField] = useState(null);        // Which field is focused
const [searchingField, setSearchingField] = useState(null);  // Which field is searching
```

### Helper Functions:
```typescript
formatDuration(minutes)  // "5h 30m" format
formatNumber(value)      // Round numbers properly
formatCurrency(value)    // Indian number format (₹)
getIcon(mode)            // Return correct icon for transport mode
```

---

## 📊 Feature Comparison Table

| Feature | TravelHub.tsx | Sustainable.tsx |
|---------|--------------|-----------------|
| Route Planning | ✅ Basic (RouteMapSection) | ✅ Advanced with CO₂ |
| Map Integration | ✅ Google Maps Embed | ✅ Premium with Leaflet |
| Autocomplete | ❌ No | ✅ Location search |
| CO₂ Tracking | ❌ No | ✅ Full emissions data |
| Transport Comparison | ❌ No | ✅ Multiple modes |
| Reward Points | ❌ No | ✅ Green rewards |
| Booking Forms | ✅ Hero search form | ❌ No |
| Destinations | ✅ 3 featured | ❌ No |
| Tour Packages | ✅ 2 detailed | ❌ No |
| Gallery | ✅ 4 images | ❌ No |
| Reviews | ✅ 3 testimonials | ❌ No |
| Blog | ✅ 3 posts | ❌ No |
| Contact Form | ✅ Full form | ❌ No |

---

## 🚀 How to Use

### TravelHub Page
1. Open `/travelhub` route
2. Use Hero search to find destinations
3. Browse categories
4. Use Route Planner for quick routes
5. Check destinations, packages, gallery
6. Read reviews and blogs
7. Contact via form or support channels

### Sustainable Page
1. Open `/sustainable` route
2. Enter Origin city (autocomplete)
3. Enter Destination city (autocomplete)
4. Click "Calculate Impact"
5. View all transport options with CO₂ data
6. Choose eco-friendly option
7. Click Premium banner for advanced map view

---

## 📱 Responsive Design

| Breakpoint | TravelHub | Sustainable |
|------------|-----------|-------------|
| Mobile | Single column | Stacked form |
| Tablet (md) | 2-3 columns | Side-by-side inputs |
| Desktop (lg) | Full grid layouts | 2-column results |

---

## 🎨 Color Palette Used

| Color | Hex | Usage |
|-------|-----|-------|
| Teal | `#06b6d4` | Primary accent |
| Emerald | `#10b981` | Eco/Green elements |
| Cyan | `#0ea5e9` | Secondary accent |
| Amber | `#f59e0b` | Highlights, rewards |
| Slate | `#64748b` | Text, borders |
| Stone | `#78716c` | Neutral backgrounds |

---

## 📦 Dependencies Used

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "lucide-react": "Icons library",
  "framer-motion": "Animations (HeroBanner)",
  "tailwindcss": "Styling"
}
```

---

## ✅ Summary

### TravelHub.tsx = Complete Travel Booking Hub
- 11 sections covering all travel needs
- Destinations, packages, gallery, reviews, blog
- Contact & support integration
- Basic route planning

### Sustainable.tsx = Eco-Friendly Route Planner
- Carbon footprint calculation
- Multiple transport mode comparison
- Green score & reward points
- Location autocomplete
- API integration with backend

---

**Created:** December 1, 2025  
**Project:** DarShana Travel Platform  
**Author:** GitHub Copilot
