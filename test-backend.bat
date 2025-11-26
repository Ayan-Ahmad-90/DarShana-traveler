@echo off
REM Test MongoDB connection with Atlas
echo Testing MongoDB Atlas connection...
echo Make sure you've added your IP to MongoDB Atlas Network Access!
echo.

REM Set environment variables
set MONGODB_URI=mongodb+srv://chaudharyayan100_db_user:aRKyLPdwBcjsktoU@cluster0.ufhvfhe.mongodb.net/darshana-travel?appName=Cluster0
set NODE_ENV=development
set PORT=3000

REM Run backend
cd backend
node dist/index.js
