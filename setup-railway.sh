#!/bin/bash

echo "🚂 Setting up Railway for CryptoGig Backend"
echo "==========================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli --force
fi

# Check if user is logged in
echo "🔐 Checking Railway authentication..."
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway"
    echo "🔑 Please login to Railway:"
    echo ""
    echo "   railway login"
    echo ""
    echo "This will open your browser. Login with GitHub or email."
    echo "After login, run this script again."
    exit 1
fi

echo "✅ Logged in to Railway as: $(railway whoami)"

# Go to backend directory
cd backend

# Check if project is linked
echo "🔍 Checking project status..."
if ! railway status &> /dev/null; then
    echo "❌ No Railway project linked"
    echo ""
    echo "🚀 Creating new Railway project..."
    echo "Choose option 2: 'Create new project'"
    echo "Name it: cryptogig-backend"
    echo ""
    railway init
else
    echo "✅ Railway project already linked"
fi

# Show project status
echo ""
echo "📊 Project Status:"
railway status

# Set environment variables
echo ""
echo "⚙️  Setting up environment variables..."

# Check if MongoDB URL is set
if [ -z "$MONGO_URL" ]; then
    echo "❌ MONGO_URL not set"
    echo "Please set your MongoDB Atlas connection string:"
    read -p "MongoDB URL: " MONGO_URL
    railway variables set MONGO_URL="$MONGO_URL"
fi

# Set other variables
railway variables set JWT_SECRET="$(openssl rand -base64 32)"
railway variables set ARBITRATOR_WALLET="0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483"
railway variables set CORS_ORIGINS="*"

echo "✅ Environment variables set"

# Deploy
echo ""
echo "🚀 Deploying to Railway..."
railway up --detach

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📍 Your backend will be available at:"
echo "   Check 'railway status' for the URL"
echo ""
echo "🔧 To view your project:"
echo "   Dashboard: https://railway.app/dashboard"
echo "   Logs: railway logs"
echo "   Status: railway status"