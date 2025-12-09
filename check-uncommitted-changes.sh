#!/bin/bash
# Check for uncommitted changes before build/deploy
# This script warns about uncommitted changes but allows the process to continue

echo "🔍 Checking for uncommitted changes..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo -e "${YELLOW}Not a git repository. Skipping check.${NC}"
    exit 0
fi

# Check for changes
UNSTAGED=$(git diff --name-only)
STAGED=$(git diff --cached --name-only)
UNTRACKED=$(git ls-files --others --exclude-standard)

if [ -n "$UNSTAGED" ] || [ -n "$STAGED" ] || [ -n "$UNTRACKED" ]; then
    echo -e "${YELLOW}⚠️  Uncommitted changes detected${NC}"
    echo ""
    
    if [ -n "$UNSTAGED" ]; then
        echo -e "${YELLOW}Unstaged changes:${NC}"
        echo "$UNSTAGED" | while IFS= read -r file; do
            echo "  - $file"
        done
        echo ""
    fi
    
    if [ -n "$STAGED" ]; then
        echo -e "${YELLOW}Staged changes:${NC}"
        echo "$STAGED" | while IFS= read -r file; do
            echo "  - $file"
        done
        echo ""
    fi
    
    if [ -n "$UNTRACKED" ]; then
        echo -e "${YELLOW}Untracked files:${NC}"
        echo "$UNTRACKED" | while IFS= read -r file; do
            echo "  - $file"
        done
        echo ""
    fi
    
    echo -e "${YELLOW}Proceeding with build, but consider committing your changes.${NC}"
    echo ""
    exit 0
else
    echo -e "${GREEN}✓ No uncommitted changes detected${NC}"
    echo ""
    exit 0
fi
