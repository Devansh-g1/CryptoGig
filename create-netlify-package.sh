#!/bin/bash

echo "📦 Creating Netlify Deployment Package"
echo "======================================"

cd frontend

# Ensure we have a build
if [ ! -d "build" ]; then
    echo "Building project..."
    npm run build
fi

# Create deployment package
echo "Creating deployment package..."
cd build
zip -r ../cryptogig-netlify-deploy.zip .
cd ..

echo "✅ Package created: cryptogig-netlify-deploy.zip"
echo ""
echo "🚀 Manual Netlify Deployment:"
echo "1. Go to https://app.netlify.com/drop"
echo "2. Drag and drop: cryptogig-netlify-deploy.zip"
echo "3. Your site will be live immediately and publicly accessible!"
echo "4. No login required for visitors"
echo ""
echo "📝 After deployment:"
echo "1. Copy your Netlify URL (e.g., https://amazing-name-123456.netlify.app)"
echo "2. Update Railway CORS:"
echo "   cd backend"
echo "   railway variables --set \"CORS_ORIGINS=https://your-netlify-url.netlify.app,http://localhost:3000\""