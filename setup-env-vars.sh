#!/bin/bash

echo "⚙️  Environment Variables Setup Helper"
echo "====================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }

echo ""
print_info "This script will help you set up environment variables for Railway and Vercel"
echo ""

# Generate JWT Secret
print_info "Generating secure JWT secret..."
JWT_SECRET=$(openssl rand -base64 32)
print_success "Generated JWT_SECRET: $JWT_SECRET"

# Update backend .env
if [ -f "backend/.env" ]; then
    sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" backend/.env
    print_success "Updated JWT_SECRET in backend/.env"
fi

echo ""
print_info "Railway Environment Variables (Backend)"
print_info "Copy these to your Railway dashboard:"
echo "========================================"
echo "MONGO_URL=mongodb+srv://cryptogig:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/cryptogig_db?retryWrites=true&w=majority"
echo "JWT_SECRET=$JWT_SECRET"
echo "POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology"
echo "ARBITRATOR_WALLET=0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483"
echo "CORS_ORIGINS=https://your-vercel-app.vercel.app"
echo "FRONTEND_URL=https://your-vercel-app.vercel.app"
echo "FROM_EMAIL=noreply@cryptogig.com"
echo "SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY"
echo "CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS"
echo ""

print_info "Vercel Environment Variables (Frontend)"
print_info "Copy these to your Vercel dashboard:"
echo "======================================="
echo "REACT_APP_BACKEND_URL=https://your-railway-app.railway.app"
echo "REACT_APP_WALLETCONNECT_PROJECT_ID=2f05a7cde2bb14b478f07c00594118b1"
echo "REACT_APP_CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS"
echo "REACT_APP_USDC_ADDRESS=0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582"
echo "REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID"
echo "REACT_APP_GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID"
echo ""

print_warning "Remember to replace the following placeholders:"
echo "- YOUR_PASSWORD: Your MongoDB Atlas database user password"
echo "- your-vercel-app.vercel.app: Your actual Vercel deployment URL"
echo "- your-railway-app.railway.app: Your actual Railway deployment URL"
echo "- YOUR_SENDGRID_API_KEY: Your SendGrid API key for email functionality"
echo "- YOUR_CONTRACT_ADDRESS: Smart contract address after deployment"
echo "- YOUR_GOOGLE_CLIENT_ID: Google OAuth client ID (optional)"
echo "- YOUR_GITHUB_CLIENT_ID: GitHub OAuth client ID (optional)"
echo ""

print_info "Quick setup commands:"
echo "====================="
echo "# Set Railway variables (run in backend directory):"
echo "railway variables set MONGO_URL=\"mongodb+srv://cryptogig:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/cryptogig_db?retryWrites=true&w=majority\""
echo "railway variables set JWT_SECRET=\"$JWT_SECRET\""
echo "railway variables set CORS_ORIGINS=\"https://your-vercel-app.vercel.app\""
echo "railway variables set FRONTEND_URL=\"https://your-vercel-app.vercel.app\""
echo ""
echo "# Set Vercel variables (run in frontend directory):"
echo "vercel env add REACT_APP_BACKEND_URL production"
echo "vercel env add REACT_APP_WALLETCONNECT_PROJECT_ID production"
echo "vercel env add REACT_APP_CONTRACT_ADDRESS production"
echo ""

print_success "Environment variables setup complete!"
print_info "Next: Run ./quick-deploy.sh to deploy your application"