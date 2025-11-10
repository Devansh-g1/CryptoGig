#!/bin/bash

echo "🔺 Simple Vercel Deployment for CryptoGig Frontend"
echo "================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

# Navigate to frontend directory
cd frontend

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Create environment file for build
print_status "Setting up environment variables for build..."
cat > .env.local << EOF
REACT_APP_BACKEND_URL=https://your-railway-app.railway.app
REACT_APP_WALLETCONNECT_PROJECT_ID=2f05a7cde2bb14b478f07c00594118b1
REACT_APP_CONTRACT_ADDRESS=
REACT_APP_USDC_ADDRESS=0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582
REACT_APP_GOOGLE_CLIENT_ID=
REACT_APP_GITHUB_CLIENT_ID=
EOF

# Build the project
print_status "Building frontend..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Frontend build failed"
    exit 1
fi

# Login to Vercel
print_status "Logging into Vercel..."
vercel login

# Deploy
print_status "Deploying to Vercel..."
vercel --prod --yes

if [ $? -eq 0 ]; then
    print_status "✅ Frontend deployed successfully to Vercel!"
    echo ""
    print_warning "Important: Update environment variables in Vercel dashboard:"
    echo "1. Go to your Vercel project dashboard"
    echo "2. Navigate to Settings → Environment Variables"
    echo "3. Add these variables for Production:"
    echo "   - REACT_APP_BACKEND_URL: Your Railway backend URL"
    echo "   - REACT_APP_WALLETCONNECT_PROJECT_ID: 2f05a7cde2bb14b478f07c00594118b1"
    echo "   - REACT_APP_CONTRACT_ADDRESS: Your deployed contract address"
    echo "   - REACT_APP_USDC_ADDRESS: 0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582"
    echo "4. Redeploy after setting environment variables"
    echo ""
    print_status "Run 'vercel --prod' again after setting environment variables"
else
    print_error "Deployment failed"
    exit 1
fi