# Backend Setup Guide - Complete Documentation

## 📋 Requirements

- Node.js 16+ (Download: https://nodejs.org/)
- MongoDB (Local or Cloud)
- Git (optional)
- Terminal/Command Prompt

## 🗄️ Database Setup

### Option 1: Local MongoDB (Recommended for Development)

**Windows:**
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will run as a service automatically
4. Verify: Open Command Prompt → `mongod --version`

**macOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongod
```

### Option 2: MongoDB Atlas (Cloud - No Installation)

1. Create free account: https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Create `.env` file in `/backend`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/darshana-travel
PORT=5000
NODE_ENV=development
```

## 🚀 Backend Installation & Setup

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs:
- express: Web server framework
- mongoose: MongoDB ODM
- cors: Cross-Origin Resource Sharing
- dotenv: Environment variables
- axios: HTTP requests (optional)

### Step 3: Create Environment File
Create `.env` file in `/backend`:
```
MONGODB_URI=mongodb://localhost:27017/darshana-travel
PORT=5000
NODE_ENV=development
```

For MongoDB Atlas, use:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/darshana-travel
PORT=5000
NODE_ENV=development
```

### Step 4: Seed the Database

**Important:** MongoDB must be running first!

```bash
node seeds/seedQuestions.js
```

Expected output:
```
✅ Connected to MongoDB
🗑️  Cleared existing questions
✅ Seeded 30 questions
╔════════════════════════════════════════╗
║  ✅ DATABASE SEEDING COMPLETE!         ║
║  Total Questions: 30                   
║  Categories: 6                         
║  Languages: English + Hindi            
╚════════════════════════════════════════╝
```

### Step 5: Start Backend Server
```bash
npm run dev
```

Or:
```bash
npm start
```
Or:
```bash
node server.js
```

Expected output:
```
✅ MongoDB Connected Successfully
╔════════════════════════════════════════╗
║  🚀 DarShana Travel Backend Started    ║
║  Port: 5000                            
║  Environment: development              
╚════════════════════════════════════════╝
```

## ✅ Verify Backend is Running

### Test 1: Health Check
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"status": "Backend is running! ✅"}
```

### Test 2: Get All Questions
```bash
curl http://localhost:5000/api/questions
```

Should return array of 30 questions.

### Test 3: Get Questions by Category
```bash
curl http://localhost:5000/api/questions/category/itinerary
```

Should return 5 itinerary questions.

## 🔌 API Documentation

### Questions Endpoints

**Get All Questions**
```
GET /api/questions
Response: Array of questions
```

**Get Single Question**
```
GET /api/questions/:id
Response: Single question object
```

**Get by Category**
```
GET /api/questions/category/:category
Parameters: itinerary, safety, emergency, culture, experience, practical
Response: Array of questions in category
```

**Search Questions**
```
GET /api/questions/search?q=keyword&category=itinerary
Response: Filtered questions
```

**Create Question** (Admin)
```
POST /api/questions
Body: {
  category: "itinerary",
  categoryLabel: "Yatrika (Itinerary)",
  question: "Your question?",
  questionHi: "Hindi version",
  answer: "Your answer",
  answerHi: "Hindi answer",
  tags: ["tag1", "tag2"]
}
Response: Created question object
```

**Update Question** (Admin)
```
PUT /api/questions/:id
Body: { fields to update }
Response: Updated question object
```

**Delete Question** (Admin)
```
DELETE /api/questions/:id
Response: { message: "Question deleted" }
```

### Chat Endpoints

**Save Chat History**
```
POST /api/chat/save
Body: {
  userId: "user123",
  conversation: [
    { role: "user", text: "Hello", timestamp: Date },
    { role: "model", text: "Hi there!", timestamp: Date }
  ],
  category: "itinerary"
}
Response: Saved chat object
```

**Get Chat History**
```
GET /api/chat/history/:userId
Response: Array of past conversations
```

**Save Feedback**
```
POST /api/chat/feedback
Body: {
  userId: "user123",
  questionId: "60d5ec49c1234567890abcde",
  responseQuality: 4,
  relevance: 5,
  accuracy: 4,
  comment: "Great response!",
  liked: true,
  disliked: false
}
Response: Saved feedback object
```

**Get User Feedback**
```
GET /api/chat/feedback/:userId
Response: Array of user feedbacks
```

**Get Analytics**
```
GET /api/chat/stats/analytics
Response: {
  totalChats: 150,
  totalUserQuestions: 450,
  avgQuality: 4.2
}
```

## 📊 Database Models

### Question Model
```javascript
{
  _id: ObjectId,
  category: String (enum),
  categoryLabel: String,
  question: String,
  questionHi: String,
  answer: String,
  answerHi: String,
  difficulty: String,
  tags: [String],
  createdAt: Date
}
```

### ChatHistory Model
```javascript
{
  _id: ObjectId,
  userId: String,
  conversation: [
    {
      role: String,
      text: String,
      timestamp: Date,
      liked: Boolean,
      disliked: Boolean
    }
  ],
  category: String,
  duration: Number,
  feedback: String,
  createdAt: Date,
  updatedAt: Date
}
```

### UserFeedback Model
```javascript
{
  _id: ObjectId,
  userId: String,
  questionId: ObjectId,
  responseQuality: Number (1-5),
  relevance: Number (1-5),
  accuracy: Number (1-5),
  comment: String,
  liked: Boolean,
  disliked: Boolean,
  createdAt: Date
}
```

## 🔗 Frontend Integration

### Import Database Service
```typescript
import { 
  fetchQuestionsFromDB, 
  saveChatToDB, 
  getChatHistory, 
  saveFeedback,
  searchQuestions,
  getStats 
} from '../services/databaseService';
```

### Fetch Questions
```typescript
const questions = await fetchQuestionsFromDB();
const categoryQuestions = await fetchQuestionsFromDB('itinerary');
```

### Save Chat
```typescript
const userId = auth.currentUser?.uid;
await saveChatToDB(userId, messages, 'itinerary');
```

### Save Feedback
```typescript
await saveFeedback(userId, {
  responseQuality: 4,
  liked: true
});
```

### Search Questions
```typescript
const results = await searchQuestions('budget travel', 'itinerary');
```

### Get Analytics
```typescript
const stats = await getStats();
console.log(stats.totalChats);
```

## 🐛 Troubleshooting

### Error: "Cannot connect to MongoDB"
**Solution:**
- Ensure MongoDB is running: `mongod`
- Check connection string in .env
- For cloud: Verify IP whitelist in Atlas

### Error: "Port 5000 already in use"
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000  (macOS/Linux)
netstat -ano | findstr :5000  (Windows)

# Kill process
kill -9 <PID>  (macOS/Linux)
taskkill /PID <PID> /F  (Windows)
```

### Questions not loading
**Solution:**
```bash
# Re-seed database
node seeds/seedQuestions.js

# Verify questions exist
curl http://localhost:5000/api/questions
```

### CORS errors
**Already configured for:**
- http://localhost:5173
- http://localhost:5174
- http://localhost:5175
- http://localhost:5176

If using different port, update `cors()` in server.js

### Frontend not connecting to backend
**Solution:**
- Ensure backend is running on port 5000
- Check `API_BASE_URL` in `databaseService.ts`
- Verify frontend port (5173-5176)
- Check browser console for CORS errors

## 📈 Performance Tips

1. **Index Database Fields**
```javascript
// In MongoDB Compass
db.questions.createIndex({ category: 1 })
db.questions.createIndex({ tags: 1 })
db.questions.createIndex({ "question": "text" })
```

2. **Cache Frequently Used Queries**
```typescript
const questionsCache = new Map();
const categoryCache = new Map();
```

3. **Pagination for Large Result Sets**
```javascript
GET /api/questions?page=1&limit=10
```

4. **Use Connection Pooling**
```javascript
mongoose.connect(uri, {
  maxPoolSize: 10,
  minPoolSize: 5
});
```

## 🚀 Production Deployment

### Deploy Backend to Heroku
```bash
heroku login
heroku create darshana-travel-api
git push heroku main
heroku config:set MONGODB_URI=<your_atlas_uri>
```

### Deploy Frontend to Vercel
```bash
npm install -g vercel
vercel
```

Update `.env.production` with production backend URL.

## 📚 Additional Resources

- Express Documentation: https://expressjs.com/
- Mongoose Docs: https://mongoosejs.com/
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- REST API Best Practices: https://restfulapi.net/

## 🎯 Summary

You now have:
✅ Complete backend API (22 endpoints)
✅ MongoDB database with 30 questions
✅ Chat history & feedback system
✅ Frontend integration ready
✅ Admin endpoints for management

Next: Run frontend and enjoy the AI travel assistant!
