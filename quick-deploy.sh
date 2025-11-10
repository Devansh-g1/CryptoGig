#!/bin/bash

echo "🚀 CryptoGig Quick Deployment Script"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required CLIs are installed
echo "🔍 Checking prerequisites..."

if ! command -v railway &> /dev/null; then
    print_warning "Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

print_status "Prerequisites checked"

# Deploy backend to Railway
echo ""
echo "🚂 Deploying backend to Railway..."
cd backend

# Check if .env exists
if [ ! -f ".env" ]; then
    print_error ".env file not found in backend directory"
    echo "Please create backend/.env with your MongoDB connection string"
    exit 1
fi

# Login and deploy
railway login
if [ $? -eq 0 ]; then
    print_status "Logged into Railway"
    
    # Check if project exists, if not create it
    if ! railway status &> /dev/null; then
        print_warning "No Railway project found. Creating new project..."
        railway project new cryptogig-backend
    fi
    
    # Deploy
    railway up --detach
    if [ $? -eq 0 ]; then
        print_status "Backend deployed to Railway"
        
        # Get the Railway URL
        RAILWAY_URL=$(railway status --json | grep -o '"url":"[^"]*' | cut -d'"' -f4)
        if [ ! -z "$RAILWAY_URL" ]; then
            print_status "Backend URL: $RAILWAY_URL"
            echo "REACT_APP_BACKEND_URL=$RAILWAY_URL" > ../frontend/.env.production
        fi
    else
        print_error "Failed to deploy backend to Railway"
        exit 1
    fi
else
    print_error "Failed to login to Railway"
    exit 1
fi

# Deploy frontend to Vercel
echo ""
echo "🔺 Deploying frontend to Vercel..."
cd ../frontend

# Build the project first
print_status "Building frontend..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Frontend build failed"
    exit 1
fi

# Login and deploy
vercel login
if [ $? -eq 0 ]; then
    print_status "Logged into Vercel"
    
    # Create .env.local for build
    if [ ! -z "$RAILWAY_URL" ]; then
        echo "REACT_APP_BACKEND_URL=$RAILWAY_URL" > .env.local
        echo "REACT_APP_WALLETCONNECT_PROJECT_ID=2f05a7cde2bb14b478f07c00594118b1" >> .env.local
        echo "REACT_APP_USDC_ADDRESS=0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582" >> .env.local
        print_status "Created .env.local with Railway backend URL"
    fi
    
    # Deploy
    vercel --prod --yes
    if [ $? -eq 0 ]; then
        print_status "Frontend deployed to Vercel"
        
        # Get the Vercel URL
        VERCEL_URL=$(vercel ls | grep -o 'https://[^ ]*' | head -1)
        if [ ! -z "$VERCEL_URL" ]; then
            print_status "Frontend URL: $VERCEL_URL"
            
            # Update Railway CORS settings
            cd ../backend
            print_status "Updating CORS settings in Railway..."
            railway variables set CORS_ORIGINS="$VERCEL_URL"
            railway variables set FRONTEND_URL="$VERCEL_URL"
        fi
    else
        print_error "Failed to deploy frontend to Vercel"
        exit 1
    fi
else
    print_error "Failed to login to Vercel"
    exit 1
fi

echo ""
echo "🎉 Deployment completed!"
echo "========================"
print_status "Backend deployed to Railway"
print_status "Frontend deployed to Vercel"
echo ""
print_warning "Next steps:"
echo "1. Set up MongoDB Atlas connection string in Railway"
echo "2. Configure SendGrid API key for email functionality"
echo "3. Deploy smart contracts and update CONTRACT_ADDRESS"
echo "4. Set up OAuth credentials (Google, GitHub)"
echo "5. Test the application end-to-end"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"