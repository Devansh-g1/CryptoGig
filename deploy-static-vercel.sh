#!/bin/bash

echo "🚀 Static Vercel Deployment for CryptoGig"
echo "========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

cd frontend

# Create production environment file
print_status "Creating production environment..."
cat > .env.production << EOF
REACT_APP_BACKEND_URL=https://cryptogig-production.up.railway.app
REACT_APP_WALLETCONNECT_PROJECT_ID=2f05a7cde2bb14b478f07c00594118b1
REACT_APP_CONTRACT_ADDRESS=
REACT_APP_USDC_ADDRESS=0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582
REACT_APP_GOOGLE_CLIENT_ID=
REACT_APP_GITHUB_CLIENT_ID=
EOF

# Build locally
print_status "Building project locally..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed locally"
    exit 1
fi

# Deploy the build folder directly
print_status "Deploying build folder to Vercel..."
vercel --prod --yes ./build

if [ $? -eq 0 ]; then
    print_status "✅ Static deployment successful!"
    echo ""
    print_warning "Your app should now be live on Vercel"
    echo ""
    print_status "Next steps:"
    echo "1. Get your Vercel URL from the output above"
    echo "2. Update Railway CORS settings with your new URL"
    echo "3. Test your application"
else
    print_error "Static deployment failed"
    exit 1
fi