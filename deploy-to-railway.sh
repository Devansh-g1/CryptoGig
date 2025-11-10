#!/bin/bash

echo "🚀 Deploying CryptoGig Backend to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Navigate to backend directory
cd backend

# Login to Railway (if not already logged in)
echo "🔐 Logging into Railway..."
railway login

# Create new project or link existing
echo "📦 Setting up Railway project..."
railway project new cryptogig-backend

# Set environment variables
echo "⚙️  Setting up environment variables..."
railway variables set MONGO_URL="mongodb+srv://cryptogig:your_password_here@cluster0.xxxxx.mongodb.net/cryptogig_db?retryWrites=true&w=majority"
railway variables set JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
railway variables set POLYGON_AMOY_RPC="https://rpc-amoy.polygon.technology"
railway variables set ARBITRATOR_WALLET="0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483"
railway variables set CORS_ORIGINS="https://cryptogig-frontend.vercel.app"
railway variables set FRONTEND_URL="https://cryptogig-frontend.vercel.app"
railway variables set FROM_EMAIL="noreply@cryptogig.com"

# Deploy
echo "🚀 Deploying to Railway..."
railway up

echo "✅ Backend deployed to Railway!"
echo "📝 Don't forget to:"
echo "   1. Update MONGO_URL with your actual MongoDB Atlas connection string"
echo "   2. Set your SENDGRID_API_KEY for email functionality"
echo "   3. Set CONTRACT_ADDRESS after deploying smart contracts"
echo "   4. Update REACT_APP_BACKEND_URL in frontend with your Railway URL"