#!/bin/bash

echo "🚀 CryptoGig Full Deployment Script"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Git Push
echo -e "${BLUE}📦 Step 1: Pushing to GitHub...${NC}"
git add -A
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"
git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Pushed to GitHub successfully${NC}"
else
    echo -e "${RED}❌ Failed to push to GitHub${NC}"
    exit 1
fi

echo ""

# Step 2: Build Frontend
echo -e "${BLUE}🏗️  Step 2: Building Frontend...${NC}"
cd frontend
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend built successfully${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

echo ""

# Step 3: Deploy Frontend to Netlify
echo -e "${BLUE}🌐 Step 3: Deploying Frontend to Netlify...${NC}"
netlify deploy --prod --dir=build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend deployed to Netlify${NC}"
else
    echo -e "${RED}❌ Netlify deployment failed${NC}"
    exit 1
fi

cd ..
echo ""

# Step 4: Railway Backend
echo -e "${YELLOW}⚠️  Step 4: Railway Backend Deployment${NC}"
echo ""
echo -e "${YELLOW}Railway needs to be configured via dashboard:${NC}"
echo ""
echo "1. Open Railway Dashboard:"
echo "   https://railway.app/dashboard"
echo ""
echo "2. Go to: CryptoGig → Client_arbitrator → Settings"
echo ""
echo "3. Configure Source:"
echo "   - Connect to GitHub: Devansh-g1/CryptoGig"
echo "   - Branch: main"
echo "   - Root Directory: backend"
echo ""
echo "4. Set Start Command:"
echo "   uvicorn server:app --host 0.0.0.0 --port \$PORT"
echo ""
echo "5. Click Deploy"
echo ""
echo -e "${BLUE}Opening Railway dashboard...${NC}"
cd backend
railway open

echo ""
echo "===================================="
echo -e "${GREEN}✅ Deployment Process Complete!${NC}"
echo "===================================="
echo ""
echo "📍 URLs:"
echo "   Frontend: https://cryptogig-platform.netlify.app"
echo "   Admin:    https://cryptogig-platform.netlify.app/admin"
echo "   Backend:  https://clientarbitrator-production.up.railway.app"
echo ""
echo "🔍 Verify:"
echo "   Health:   https://clientarbitrator-production.up.railway.app/api/health"
echo ""
echo "⚠️  Don't forget to configure Railway via dashboard!"
echo ""
