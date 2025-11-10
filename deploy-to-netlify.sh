#!/bin/bash

echo "🚀 Deploying to Netlify (Public by Default)"
echo "==========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    print_warning "Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

cd frontend

# Check if build exists
if [ ! -d "build" ]; then
    print_error "No build directory found. Building first..."
    npm run build
    if [ $? -ne 0 ]; then
        print_error "Build failed"
        exit 1
    fi
fi

print_status "Build directory found"

# Login to Netlify
print_status "Logging into Netlify..."
netlify login

# Deploy to Netlify
print_status "Deploying to Netlify..."
netlify deploy --prod --dir=build --open

if [ $? -eq 0 ]; then
    print_status "✅ Successfully deployed to Netlify!"
    echo ""
    print_status "🌐 Your site is now publicly accessible"
    echo ""
    print_warning "Next steps:"
    echo "1. Copy your Netlify URL from above"
    echo "2. Update Railway CORS settings:"
    echo "   cd ../backend"
    echo "   railway variables --set \"CORS_ORIGINS=https://your-netlify-url.netlify.app,http://localhost:3000\""
    echo "3. Test your application"
else
    print_error "Netlify deployment failed"
    exit 1
fi