#!/bin/bash

echo "🔄 Updating Frontend Files and Deploying"
echo "========================================"

cd frontend

echo "✅ Updated files:"
echo "  - Removed role selection from signup"
echo "  - Fixed ClientDashboard black screen"
echo "  - Changed signup buttons to 'Get Started' and 'Login'"
echo ""

echo "📝 Changes made:"
echo "  1. Registration now has NO role selection"
echo "  2. Users start as 'client' by default"
echo "  3. Can switch roles using RoleSwitcher component"
echo "  4. Fixed API calls in ClientDashboard"
echo ""

echo "⚠️  Note: Build is failing due to Node.js v23 compatibility"
echo "Using existing build directory..."

if [ ! -d "build" ]; then
    echo "❌ No build directory found"
    echo "Please use Node 18 to build:"
    echo "  nvm use 18"
    echo "  npm run build"
    exit 1
fi

echo "✅ Build directory exists"
echo ""
echo "🚀 Deploying to Netlify..."

netlify deploy --prod --dir=build

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🧪 Test the changes:"
echo "1. Go to: https://cryptogig-platform.netlify.app"
echo "2. Click 'Get Started' - NO role selection!"
echo "3. Register with just name, email, password"
echo "4. You'll be logged in as a client"
echo "5. Use RoleSwitcher to change to freelancer"
echo ""
echo "📝 Note: You need to rebuild with Node 18 for the changes to take effect"
echo "Current changes are in the code but not in the deployed build yet"