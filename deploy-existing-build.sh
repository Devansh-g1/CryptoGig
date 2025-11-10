#!/bin/bash

echo "🚀 Deploying Existing Build to Vercel"
echo "====================================="

cd frontend

# Check if build directory exists
if [ ! -d "build" ]; then
    echo "❌ No build directory found. You need to build first."
    echo "Try using Node 18 and building again."
    exit 1
fi

echo "✅ Found existing build directory"
echo "📦 Contents of build directory:"
ls -la build/

# Create a simple index.html check
if [ ! -f "build/index.html" ]; then
    echo "❌ No index.html found in build directory"
    exit 1
fi

echo "✅ Build directory looks good"

# Deploy the build directory directly
echo "🚀 Deploying build directory to Vercel..."
vercel --prod --yes ./build

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Copy your Vercel URL from above"
    echo "2. Update Railway CORS:"
    echo "   cd ../backend"
    echo "   railway variables --set \"CORS_ORIGINS=https://your-vercel-url.vercel.app,http://localhost:3000\""
else
    echo "❌ Deployment failed"
fi