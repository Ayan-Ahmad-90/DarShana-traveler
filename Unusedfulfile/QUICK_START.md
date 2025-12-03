# 5-Minute Quick Start

## Prerequisites
- Node.js installed
- MongoDB running (or MongoDB Atlas account)

## Installation

### Terminal 1: Start Backend
```bash
cd backend
npm install
node seeds/seedQuestions.js
npm run dev
```

Expected: Backend running on http://localhost:5000

### Terminal 2: Start Frontend
```bash
npm install  (if not done)
npm run dev
```

Expected: Frontend running on http://localhost:5176

## Test It

1. Open: http://localhost:5176/#/assistant
2. Select a category or ask a question
3. Chat with AI (uses Gemini API)
4. Data saved to MongoDB automatically

## What's Working

✅ 30 pre-loaded questions (6 categories)
✅ Category filtering
✅ Chat history storage
✅ User feedback tracking
✅ Full-text search
✅ English + Hindi support
✅ Statistics & analytics

## Endpoints

```
GET  /api/questions
GET  /api/questions/category/:cat
GET  /api/questions/search?q=...
POST /api/chat/save
GET  /api/chat/history/:userId
POST /api/chat/feedback
GET  /api/chat/stats/analytics
GET  /api/health
```

## Common Issues

**No questions showing?**
→ Run: `node seeds/seedQuestions.js`

**Backend not responding?**
→ Check MongoDB is running

**CORS error?**
→ Ensure port 5000 backend + 5176 frontend

**Gemini API error?**
→ Set VITE_GEMINI_API_KEY in frontend .env

## Next Steps

1. Add more questions: Edit `backend/seeds/seedQuestions.js`
2. Customize categories: Update models
3. Add authentication: Integrate Firebase
4. Deploy: Heroku (backend) + Vercel (frontend)

Done! 🎉
