#!/bin/bash
# Test MongoDB connection with Atlas
echo "Testing MongoDB Atlas connection..."
echo "Make sure you've added your IP to MongoDB Atlas Network Access!"
echo ""

# Set environment variables
export MONGODB_URI="mongodb+srv://chaudharyayan100_db_user:aRKyLPdwBcjsktoU@cluster0.ufhvfhe.mongodb.net/darshana-travel?appName=Cluster0"
export NODE_ENV="development"
export PORT="3000"

# Run backend
cd ./backend
node dist/index.js
