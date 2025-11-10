#!/bin/bash

echo "🚀 Deploying Updates to Production"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Frontend URL
FRONTEND_URL="https://cryptogig-platform.netlify.app"
BACKEND_URL="https://cryptogig-production.up.railway.app"

echo -e "${BLUE}Frontend:${NC} $FRONTEND_URL"
echo -e "${BLUE}Backend:${NC} $BACKEND_URL"
echo ""

# Step 1: Build Frontend
echo -e "${YELLOW}Step 1: Building Frontend...${NC}"
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build
echo "Building production bundle..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend built successfully${NC}"
echo ""

# Step 2: Deploy to Netlify
echo -e "${YELLOW}Step 2: Deploying to Netlify...${NC}"

# Check if netlify-cli is installed
if ! command -v netlify &> /dev/null; then
    echo "Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Deploy
echo "Deploying to Netlify..."
netlify deploy --prod --dir=dist

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Netlify deployment failed${NC}"
    echo ""
    echo "Manual deployment option:"
    echo "1. Go to: https://app.netlify.com"
    echo "2. Find your site: cryptogig-platform"
    echo "3. Drag and drop the 'frontend/dist' folder"
    exit 1
fi

echo -e "${GREEN}✅ Frontend deployed to Netlify${NC}"
echo ""

cd ..

# Step 3: Update Backend (Railway auto-deploys from Git)
echo -e "${YELLOW}Step 3: Backend Deployment${NC}"
echo ""
echo "Railway auto-deploys from Git commits."
echo ""
echo "To deploy backend updates:"
echo "1. Commit your changes:"
echo "   git add ."
echo "   git commit -m 'Update backend with fixes'"
echo "   git push"
echo ""
echo "2. Railway will automatically deploy"
echo "3. Check deployment at: https://railway.app"
echo ""

# Step 4: Test Deployment
echo -e "${YELLOW}Step 4: Testing Deployment...${NC}"
echo ""

# Test backend health
echo "Testing backend health..."
HEALTH_CHECK=$(curl -s "$BACKEND_URL/api/health" | grep -o '"status":"healthy"')

if [ -n "$HEALTH_CHECK" ]; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
else
    echo -e "${YELLOW}⚠️  Backend health check failed or not responding${NC}"
    echo "Check Railway logs at: https://railway.app"
fi

echo ""
echo "Testing frontend..."
FRONTEND_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")

if [ "$FRONTEND_CHECK" = "200" ]; then
    echo -e "${GREEN}✅ Frontend is accessible${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend returned status: $FRONTEND_CHECK${NC}"
fi

echo ""
echo "=================================="
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "=================================="
echo ""
echo "Your app is live at:"
echo -e "${BLUE}Frontend:${NC} $FRONTEND_URL"
echo -e "${BLUE}Backend:${NC} $BACKEND_URL"
echo -e "${BLUE}API Docs:${NC} $BACKEND_URL/docs"
echo ""
echo "Next steps:"
echo "1. Open $FRONTEND_URL in your browser"
echo "2. Register a new user"
echo "3. Test all features"
echo ""
echo "If backend needs updates:"
echo "1. git add ."
echo "2. git commit -m 'Update backend'"
echo "3. git push"
echo "4. Railway will auto-deploy"
echo ""
