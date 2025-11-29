# Trip Planner Quick Start Guide

## 🚀 Getting Started (5 minutes)

### 1. Start the Frontend
```powershell
cd c:\Users\Dell\OneDrive\Desktop\DarShana-travel
npm run dev
```
Opens at: `http://localhost:5173`

### 2. Start the Backend
```powershell
cd c:\Users\Dell\OneDrive\Desktop\DarShana-travel\backend
npm run dev
```
Runs on: `http://localhost:5000`

### 3. Access Trip Planner
- Click **"Trip Planner"** in the navbar
- Or go to: `http://localhost:5173/#/trip-planner-new`

---

## 🎯 How to Use

### Step 1: Enter Trip Details
1. **From**: Type your departure city (e.g., "Mumbai")
   - Autocomplete suggestions will appear
   - Click to select

2. **To**: Type your destination (e.g., "Goa")
   - Autocomplete suggestions will appear
   - Click to select

3. **Check-in**: Pick your travel date

4. **Check-out**: Pick your return date

5. **Travelers**: Select number of people (1-6)

### Step 2: Search
- Click the **"Search"** button
- Wait for results to load

### Step 3: View Routes
- See all transport options
- Compare: Duration, Cost, CO₂ Emissions
- Look for green leaf 🍃 for eco-friendly options
- Click **"Select"** to choose an option

### Step 4: Manage Itinerary
- Switch to **"Itinerary"** tab
- Click **"+ Add Activity"** for each day
- Add attractions, meals, activities
- Track time and cost

### Step 5: Check Budget
- Switch to **"Budget"** tab
- See spending across 5 categories
- Compare with total budget
- Track remaining balance

### Step 6: Discover Attractions
- Switch to **"Attractions"** tab
- Browse nearby places (distance + rating)
- Click **"Add to Itinerary"** to include

### Step 7: Share or Export
- Click **"Share"** button to get shareable link
- Click **"Export"** button to download trip

---

## 📍 Features Explained

### Routes Tab
Shows different ways to travel with:
- **⏱️ Duration**: How long the journey takes
- **₹ Cost**: Price in Indian Rupees
- **☁️ CO₂**: Carbon emissions (kg)
- **🌟 Green Score**: 0-10 (higher = more eco-friendly)
- **🎁 Rewards**: Loyalty points earned

### Itinerary Tab
Plan day-by-day activities:
- Each day shows weather
- Add activities with time and cost
- Delete activities with trash icon
- See total per-day cost

### Budget Tab
Track expenses across:
- 🏨 **Accommodation**: Hotels, hostels
- 🍽️ **Food**: Restaurants, meals
- 🎫 **Activities**: Tours, attractions
- 🚗 **Transport**: Flights, trains, taxis
- 📦 **Misc**: Shopping, tips, etc.

Visual progress bar shows spent vs. remaining

### Attractions Tab
Discover what to do:
- Distance from hotel (in km)
- Star ratings (out of 5)
- Click card to add to itinerary
- Emoji helps identify type

---

## 🐛 Troubleshooting

### Issue: Autocomplete not showing suggestions
**Solution**: 
- Make sure backend is running (`npm run dev` in backend folder)
- Check browser console for errors
- Try typing a common city name

### Issue: Search button not responding
**Solution**:
- All fields must be filled (From, To, dates, travelers)
- Ensure origin and destination are different
- Wait for loading spinner to finish

### Issue: Budget calculations showing 0
**Solution**:
- This is mock data - refresh page
- Add activities manually to see costs
- Real data will come from database integration

### Issue: Build errors
**Solution**:
- Run: `npm run build` to verify
- Check output for specific errors
- Clear node_modules and reinstall if needed

---

## 💻 Key Files

### Frontend
- **Main Component**: `src/pages/TripPlanner.tsx`
- **Route**: `/trip-planner-new`
- **Navigation**: Added to `src/components/Navbar.tsx`

### Backend  
- **Controller**: `backend/src/controllers/tripPlannerController.ts`
- **Routes**: `backend/src/routes/tripPlanner.ts`
- **API Base**: `http://localhost:5000/api/trip-planner`

### Documentation
- **Full Docs**: `TRIP_PLANNER_REDESIGN.md`
- **Summary**: `TRIP_PLANNER_SUMMARY.md`
- **This Guide**: `TRIP_PLANNER_QUICK_START.md`

---

## 🎨 UI Walkthrough

```
┌─────────────────────────────────────┐
│  🧭 Trip Planner                    │  ← Header
│  [From] [To] [Dates] [Travelers]    │  ← Search Bar
│  [SEARCH BUTTON]                    │  ← Action
└─────────────────────────────────────┘

┌─ Trip to Goa ────────────────────────┐
│ 📅 2024-01-15 to 2024-01-20          │  ← Trip Details
│ 👥 2 travelers  💰 ₹50,000          │
│ [SHARE] [EXPORT]                    │
└─────────────────────────────────────┘

[Routes] [Itinerary] [Budget] [Attractions]  ← Tabs

├─ Routes Tab (showing transport options)
│  ✈️  Flight      | 1h | ₹5,000 | 120kg CO₂ | 5.5/10 🌟
│  🚄 Train       | 12h | ₹2,500 | 45kg CO₂  | 8.2/10 🌟
│  🚌 Bus         | 14h | ₹1,500 | 60kg CO₂  | 7.5/10 🌟
│  🚗 Car         | 8h  | ₹4,000 | 200kg CO₂ | 4.0/10
│
├─ Itinerary Tab (day-wise activities)
│  Day 1 | 🌤️  28°C
│    09:00 - Beach Visit (Free)
│    13:00 - Lunch at Market (₹500)
│    
├─ Budget Tab (category breakdown)
│  🏨 Accommodation   ₹15,000 |████████░░░░░░░ 30%
│  🍽️ Food          ₹8,000  |██████░░░░░░░░░░ 16%
│  🎫 Activities      ₹10,000 |████████░░░░░░░░ 20%
│  🚗 Transport       ₹12,000 |█████████░░░░░░░ 24%
│  📦 Misc           ₹5,000  |████░░░░░░░░░░░░ 10%
│  ──────────────────────────────────
│  Total: ₹50,000
│
└─ Attractions Tab (grid of places)
   🏖️ Beach Park        🏛️ Museum      🍜 Food Market
   2km away, 4.5⭐     3km away, 4.8⭐  1.5km away, 4.6⭐
```

---

## 🔄 API Integration (For Developers)

### Making API Calls

**Example: Create Trip Plan**
```typescript
const response = await fetch(
  'http://localhost:5000/api/trip-planner',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Mumbai',
      to: 'Goa',
      startDate: '2024-01-15',
      endDate: '2024-01-20',
      travelers: 2,
      budget: 50000
    })
  }
);
const data = await response.json();
```

### Response Format
```json
{
  "success": true,
  "message": "Trip plan created successfully",
  "data": {
    "id": "trip_1234567890",
    "title": "Trip to Goa",
    "from": "Mumbai",
    "to": "Goa",
    "costEstimate": 50000
  }
}
```

---

## 📊 Mock Data Structure

### Routes Response
- 8 transport modes (Flight, Train, Bus, Car, Bike, Mixed, etc.)
- Each with: duration, cost, CO₂, green score, rewards
- Mock destinations: Goa, Kerala, Rajasthan, etc.

### Budget Response
- 5 categories pre-filled with realistic amounts
- Total: Sum of all categories
- Currency: Indian Rupees (₹)

### Attractions Response
- 6 sample attractions per location
- Each with: name, distance, rating, emoji icon
- Sortable by distance or rating

### Weather Response
- Current: Temperature, condition, humidity
- 3-day forecast
- Conditions: Sunny, Rainy, Cloudy, etc.

---

## 🚀 Next Steps

### For Testing
1. ✅ Fill search form completely
2. ✅ Click Search and view results
3. ✅ Try each tab (Routes, Itinerary, Budget, Attractions)
4. ✅ Test autocomplete with different cities
5. ✅ Check responsive design on mobile (F12 > Device Toolbar)

### For Production
1. 📦 Replace mock data with real APIs
2. 💾 Connect MongoDB for data persistence
3. 🔐 Add authentication/authorization
4. 🎯 Implement real payment processing
5. 📱 Deploy to production servers

### For Enhancement
1. 🗺️ Add interactive map
2. 🌐 Multi-language support
3. 🔔 Push notifications
4. 💬 Chat integration
5. ⭐ Reviews and ratings

---

## 📞 Support

### Documentation Links
- Full technical docs: `TRIP_PLANNER_REDESIGN.md`
- Project overview: `PROJECT_EXPLANATION_GUIDE.md`
- Setup guide: `LOCAL_DEVELOPMENT_SETUP.md`

### Common Questions

**Q: Why is backend needed?**
A: Backend provides the API endpoints and mock data. Frontend calls backend for trip information.

**Q: Can I use it without backend?**
A: Yes, but you'll only see mock data. Backend enables real functionality.

**Q: How do I add real flight data?**
A: Replace API calls in controller with real flight APIs (Skyscanner, Amadeus).

**Q: Is data saved?**
A: Currently uses mock data. Real data saved to MongoDB after DB integration.

---

## ✅ Checklist for First Run

- [ ] Started frontend (`npm run dev`)
- [ ] Started backend (`cd backend && npm run dev`)
- [ ] Opened `http://localhost:5173`
- [ ] Clicked "Trip Planner" in navbar
- [ ] Filled search form
- [ ] Clicked Search button
- [ ] Viewed Routes tab
- [ ] Checked Budget tab
- [ ] Explored Attractions
- [ ] Tested on mobile view (F12)

**All checked?** 🎉 You're ready to use the Trip Planner!

---

## 🎯 Quick Command Reference

```powershell
# Start development
npm run dev                          # Frontend (root folder)
cd backend && npm run dev            # Backend (from backend folder)

# Build for production
npm run build                        # Frontend
cd backend && npm run build          # Backend (if TypeScript)

# Check for errors
npm run build                        # Will show any errors

# Preview production build
npm run preview                      # Frontend only

# View in browser
# http://localhost:5173             # Frontend
# http://localhost:5000             # Backend API
# http://localhost:5173/#/trip-planner-new  # Trip Planner page
```

---

**Ready to explore?** Let's go! 🚀

For detailed information, see: `TRIP_PLANNER_REDESIGN.md`
