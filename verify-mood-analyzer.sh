#!/bin/bash
# AI Mood Analyzer - Verification Script
# Run this to verify all files are created correctly

echo "🔍 Verifying AI Mood Analyzer Implementation..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
files_found=0
files_expected=8

echo "📂 Frontend Files:"
echo "=================="

# Frontend files
declare -a frontend_files=(
  "src/pages/MoodAnalyzer.tsx"
  "src/hooks/useFaceDetection.ts"
  "src/services/moodApi.ts"
  "src/data/destinations.ts"
  "src/types/moodAnalyzer.ts"
)

for file in "${frontend_files[@]}"; do
  if [ -f "$file" ]; then
    size=$(wc -l < "$file" 2>/dev/null || echo "0")
    echo -e "${GREEN}✓${NC} $file ($size lines)"
    ((files_found++))
  else
    echo -e "${RED}✗${NC} $file (NOT FOUND)"
  fi
done

echo ""
echo "📂 Backend Files:"
echo "================="

# Backend files
declare -a backend_files=(
  "backend/src/routes/moodAnalyzer.ts"
  "backend/src/controllers/moodAnalyzerController.ts"
  "backend/src/services/emotionService.ts"
)

for file in "${backend_files[@]}"; do
  if [ -f "$file" ]; then
    size=$(wc -l < "$file" 2>/dev/null || echo "0")
    echo -e "${GREEN}✓${NC} $file ($size lines)"
    ((files_found++))
  else
    echo -e "${RED}✗${NC} $file (NOT FOUND)"
  fi
done

echo ""
echo "📚 Documentation Files:"
echo "======================"

# Documentation files
declare -a doc_files=(
  "AI_MOOD_ANALYZER_SETUP.md"
  "INTEGRATION_CHECKLIST.md"
  "BACKEND_INTEGRATION.md"
  "QUICK_START_AI_MOOD_ANALYZER.md"
)

for file in "${doc_files[@]}"; do
  if [ -f "$file" ]; then
    lines=$(wc -l < "$file" 2>/dev/null || echo "0")
    size=$(du -h "$file" | cut -f1)
    echo -e "${GREEN}✓${NC} $file ($size)"
  else
    echo -e "${RED}✗${NC} $file (NOT FOUND)"
  fi
done

echo ""
echo "📦 Dependency Check:"
echo "==================="

# Check package.json for required dependencies
echo "Frontend dependencies:"
if grep -q "face-api.js" package.json; then
  echo -e "${GREEN}✓${NC} face-api.js installed"
else
  echo -e "${RED}✗${NC} face-api.js NOT in package.json"
fi

if grep -q "@tensorflow/tfjs" package.json; then
  echo -e "${GREEN}✓${NC} @tensorflow/tfjs installed"
else
  echo -e "${RED}✗${NC} @tensorflow/tfjs NOT in package.json"
fi

echo ""
echo "Backend dependencies:"
cd backend 2>/dev/null && {
  if grep -q "express" package.json; then
    echo -e "${GREEN}✓${NC} Express installed"
  else
    echo -e "${RED}✗${NC} Express NOT in package.json"
  fi
  cd ..
}

echo ""
echo "📂 Model Files Check:"
echo "===================="

if [ -d "public/models" ]; then
  count=$(find public/models -type f | wc -l)
  echo -e "${GREEN}✓${NC} public/models/ directory exists ($count files)"
  if [ $count -eq 0 ]; then
    echo -e "${YELLOW}⚠${NC}  Directory is empty - run 'mkdir -p public/models' and download models"
  fi
else
  echo -e "${YELLOW}⚠${NC}  public/models/ directory does NOT exist"
  echo "   Run: mkdir -p public/models"
fi

echo ""
echo "🧪 Backend Route Check:"
echo "======================"

if [ -f "backend/src/index.ts" ] || [ -f "backend/server.js" ]; then
  if grep -q "moodAnalyzer" backend/src/index.ts 2>/dev/null || grep -q "moodAnalyzer" backend/server.js 2>/dev/null; then
    echo -e "${GREEN}✓${NC} moodAnalyzer routes already mounted"
  else
    echo -e "${YELLOW}⚠${NC}  moodAnalyzer routes NOT yet mounted"
    echo "   Add to backend/src/index.ts:"
    echo "   import moodAnalyzerRoutes from './routes/moodAnalyzer.js';"
    echo "   app.use('/api/mood-analyze', moodAnalyzerRoutes);"
  fi
else
  echo -e "${RED}✗${NC} backend/src/index.ts or backend/server.js not found"
fi

echo ""
echo "🌐 Environment Variables:"
echo "========================"

if [ -f ".env.local" ] || [ -f ".env" ]; then
  if grep -q "VITE_API_URL" .env.local 2>/dev/null || grep -q "VITE_API_URL" .env 2>/dev/null; then
    echo -e "${GREEN}✓${NC} VITE_API_URL configured"
  else
    echo -e "${YELLOW}⚠${NC}  VITE_API_URL NOT in .env"
    echo "   Create .env.local with:"
    echo "   VITE_API_URL=http://localhost:3001"
  fi
else
  echo -e "${YELLOW}⚠${NC}  No .env.local or .env file found"
  echo "   Create .env.local with:"
  echo "   VITE_API_URL=http://localhost:3001"
fi

echo ""
echo "📊 Summary:"
echo "==========="
echo "Core Files Found: $files_found / $files_expected"

if [ $files_found -eq $files_expected ]; then
  echo -e "${GREEN}✓ All core files present!${NC}"
else
  echo -e "${RED}✗ Missing $(($files_expected - $files_found)) files${NC}"
fi

echo ""
echo "🚀 Next Steps:"
echo "=============="
echo "1. Mount backend routes (see BACKEND_INTEGRATION.md)"
echo "2. Download face-api.js models to public/models/"
echo "3. Create .env.local with VITE_API_URL"
echo "4. Start backend: cd backend && npm run dev"
echo "5. Start frontend: npm run dev"
echo "6. Visit /mood-analyzer route"
echo ""
echo "📚 Documentation:"
echo "================"
echo "• AI_MOOD_ANALYZER_SETUP.md - Complete setup guide"
echo "• INTEGRATION_CHECKLIST.md - Integration steps"
echo "• BACKEND_INTEGRATION.md - Code snippets"
echo "• QUICK_START_AI_MOOD_ANALYZER.md - Quick reference"
echo ""
echo "✅ Verification complete!"
