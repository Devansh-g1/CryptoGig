#!/bin/bash

echo "🚀 Deploying CryptoGig to Netlify Properly"
echo "=========================================="

cd frontend

# Check if build exists
if [ ! -d "build" ]; then
    echo "Building project..."
    npm run build
fi

echo "✅ Build directory found"

# Deploy to Netlify with a specific site name
echo "🚀 Deploying to Netlify..."
netlify deploy --prod --dir=build --site-name=cryptogig-platform

echo ""
echo "📋 After deployment:"
echo "1. Copy the URL shown above"
echo "2. Test that anyone can access it without login"
echo "3. Update Railway CORS settings"