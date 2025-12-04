#!/bin/bash
# TypeScript Error Fix Verification Script

echo "🔍 TypeScript Error Fix Verification"
echo "====================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check frontend errors
echo "📁 Checking Frontend (src/)..."
FRONTEND_ERRORS=$(find "src" -name "*.tsx" -o -name "*.ts" | grep -E "(AuthContext|MyBookings)")

AUTHCONTEXT_OK=true
MYBOOKINGS_OK=true

if grep -q "type ReactNode" "src/context/AuthContext.tsx" 2>/dev/null; then
    echo -e "${GREEN}✅${NC} AuthContext.tsx - ReactNode import fixed"
else
    echo -e "${RED}❌${NC} AuthContext.tsx - ReactNode import NOT fixed"
    AUTHCONTEXT_OK=false
fi

if ! grep -q "MapPin\|DollarSign" "src/pages/MyBookings.tsx" 2>/dev/null; then
    echo -e "${GREEN}✅${NC} MyBookings.tsx - Unused imports removed"
else
    echo -e "${RED}❌${NC} MyBookings.tsx - Unused imports still present"
    MYBOOKINGS_OK=false
fi

echo ""
echo "📁 Checking Backend (server/src/)..."

BACKEND_OK=true

if grep -q "body?: any" "server/src/middleware/auth.ts" 2>/dev/null; then
    echo -e "${GREEN}✅${NC} auth.ts - AuthRequest interface extended"
else
    echo -e "${RED}❌${NC} auth.ts - AuthRequest interface NOT extended"
    BACKEND_OK=false
fi

if grep -q "req: AuthRequest" "server/src/controllers/authController.ts" 2>/dev/null; then
    echo -e "${GREEN}✅${NC} authController.ts - Request types fixed"
else
    echo -e "${RED}❌${NC} authController.ts - Request types NOT fixed"
    BACKEND_OK=false
fi

if grep -q "req: express.Request" "server/src/index.ts" 2>/dev/null; then
    echo -e "${GREEN}✅${NC} index.ts - Parameter types added"
else
    echo -e "${RED}❌${NC} index.ts - Parameter types NOT added"
    BACKEND_OK=false
fi

echo ""
echo "====================================="
echo "📊 Summary:"
echo ""

if [ "$AUTHCONTEXT_OK" = true ] && [ "$MYBOOKINGS_OK" = true ] && [ "$BACKEND_OK" = true ]; then
    echo -e "${GREEN}✅ ALL FIXES VERIFIED!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. cd server && npm install"
    echo "2. cd .. && npm install"
    echo "3. npm run dev (frontend)"
    echo "4. npm run dev (backend in server/)"
else
    echo -e "${RED}❌ Some fixes need attention${NC}"
    exit 1
fi
