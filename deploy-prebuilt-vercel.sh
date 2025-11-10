#!/bin/bash

echo "🚀 Pre-built Vercel Deployment"
echo "=============================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

cd frontend

# Step 1: Use simplified package.json
print_status "Using simplified package.json for Vercel..."
cp package-vercel.json package.json

# Step 2: Clean install
print_status "Cleaning node_modules and package-lock..."
rm -rf node_modules package-lock.json

# Step 3: Install with legacy peer deps
print_status "Installing dependencies..."
npm install --legacy-peer-deps --no-audit --no-fund

if [ $? -ne 0 ]; then
    print_error "npm install failed locally"
    exit 1
fi

# Step 4: Build locally first to verify
print_status "Building locally to verify..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Local build failed"
    exit 1
fi

# Step 5: Deploy to Vercel
print_status "Deploying to Vercel..."
vercel --prod --yes

if [ $? -eq 0 ]; then
    print_status "✅ Deployment successful!"
    echo ""
    print_warning "Next steps:"
    echo "1. Copy your Vercel URL from the output above"
    echo "2. Update Railway CORS settings"
    echo "3. Test your application"
else
    print_error "Vercel deployment failed"
    
    print_warning "Alternative: Deploy build folder directly"
    echo "Try: vercel --prod --yes ./build"
fi