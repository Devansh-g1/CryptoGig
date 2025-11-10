#!/bin/bash

echo "🚀 Deploying Frontend Only to Vercel"
echo "===================================="

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

print_status "Current directory: $(pwd)"
print_status "Files in directory:"
ls -la

# Check if we're in the right place
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Make sure you're in the right directory."
    exit 1
fi

# Create production environment file
print_status "Setting up environment variables..."
cat > .env.production << EOF
REACT_APP_BACKEND_URL=https://cryptogig-production.up.railway.app
REACT_APP_WALLETCONNECT_PROJECT_ID=2f05a7cde2bb14b478f07c00594118b1
REACT_APP_CONTRACT_ADDRESS=
REACT_APP_USDC_ADDRESS=0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582
REACT_APP_GOOGLE_CLIENT_ID=
REACT_APP_GITHUB_CLIENT_ID=
EOF

# Login to Vercel
print_status "Logging into Vercel..."
vercel login

# Deploy with specific settings
print_status "Deploying to Vercel..."
vercel --prod --yes \
  --env REACT_APP_BACKEND_URL=https://cryptogig-production.up.railway.app \
  --env REACT_APP_WALLETCONNECT_PROJECT_ID=2f05a7cde2bb14b478f07c00594118b1 \
  --env REACT_APP_USDC_ADDRESS=0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582

if [ $? -eq 0 ]; then
    print_status "✅ Deployment successful!"
    echo ""
    print_warning "Next steps:"
    echo "1. Copy your Vercel URL from the output above"
    echo "2. Update Railway CORS settings:"
    echo "   cd ../backend"
    echo "   railway variables --set \"CORS_ORIGINS=https://your-vercel-url.vercel.app,http://localhost:3000\""
    echo "3. Test your application"
else
    print_error "Deployment failed"
    
    print_warning "Alternative: Try manual dashboard deployment"
    echo "1. Go to https://vercel.com/new"
    echo "2. Upload ONLY the frontend folder contents"
    echo "3. Don't set a root directory"
    echo "4. Add environment variables manually"
fi