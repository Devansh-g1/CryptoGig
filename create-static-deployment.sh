#!/bin/bash

echo "📦 Creating Static Deployment Package"
echo "===================================="

cd frontend

# Build the project locally (we know this works)
echo "Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Create a deployment package
echo "Creating deployment package..."
cd build
zip -r ../cryptogig-frontend-static.zip .
cd ..

echo "✅ Static deployment package created: cryptogig-frontend-static.zip"
echo ""
echo "📋 Manual deployment steps:"
echo "1. Go to https://vercel.com/new"
echo "2. Choose 'Browse' and upload cryptogig-frontend-static.zip"
echo "3. Set Framework Preset to 'Other'"
echo "4. Set Output Directory to '.'"
echo "5. Add environment variables:"
echo "   REACT_APP_BACKEND_URL=https://cryptogig-production.up.railway.app"
echo "   REACT_APP_WALLETCONNECT_PROJECT_ID=2f05a7cde2bb14b478f07c00594118b1"
echo "   REACT_APP_USDC_ADDRESS=0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582"
echo "6. Deploy"