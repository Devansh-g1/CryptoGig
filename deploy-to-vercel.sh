#!/bin/bash

echo "🚀 Deploying CryptoGig Frontend to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Navigate to frontend directory
cd frontend

# Login to Vercel (if not already logged in)
echo "🔐 Logging into Vercel..."
vercel login

# Build the project
echo "🔨 Building frontend..."
npm run build

# Set environment variables
echo "⚙️  Setting up environment variables..."
echo "Please set these environment variables in your Vercel dashboard:"
echo "REACT_APP_BACKEND_URL - Your Railway backend URL"
echo "REACT_APP_WALLETCONNECT_PROJECT_ID - 2f05a7cde2bb14b478f07c00594118b1"
echo "REACT_APP_CONTRACT_ADDRESS - Your deployed contract address"
echo "REACT_APP_USDC_ADDRESS - 0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582"

# Deploy
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Frontend deployed to Vercel!"
echo "📝 Don't forget to:"
echo "   1. Set environment variables in Vercel dashboard"
echo "   2. Update REACT_APP_BACKEND_URL with your Railway backend URL"
echo "   3. Set your WalletConnect Project ID"
echo "   4. Set CONTRACT_ADDRESS after deploying smart contracts"