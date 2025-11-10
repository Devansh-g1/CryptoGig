#!/bin/bash

echo "🔄 Update MongoDB Connection String"
echo "=================================="

# Get new MongoDB URL
read -p "📝 Enter your new MongoDB connection string: " NEW_MONGO_URL

if [ -z "$NEW_MONGO_URL" ]; then
    echo "❌ MongoDB URL cannot be empty"
    exit 1
fi

echo ""
echo "🎯 Updating MongoDB connection in all environments..."

# Update local environment
echo "📝 Updating local .env file..."
if [ -f "backend/.env" ]; then
    # Escape special characters for sed
    ESCAPED_URL=$(echo "$NEW_MONGO_URL" | sed 's/[[\.*^$()+?{|]/\\&/g')
    sed -i.bak "s|MONGO_URL=.*|MONGO_URL=$ESCAPED_URL|g" backend/.env
    echo "✅ Local .env updated"
else
    echo "⚠️  backend/.env not found"
fi

# Update Railway (if Railway CLI is available)
if command -v railway &> /dev/null; then
    echo "🚂 Updating Railway environment..."
    cd backend
    
    if railway status &> /dev/null; then
        railway variables set MONGO_URL="$NEW_MONGO_URL"
        echo "✅ Railway environment updated"
        echo "🔄 Railway will auto-redeploy in ~30 seconds"
    else
        echo "⚠️  Not linked to Railway project. Run 'railway link' first"
    fi
    
    cd ..
else
    echo "⚠️  Railway CLI not installed. Update manually in Railway dashboard"
fi

# Instructions for manual updates
echo ""
echo "📋 Manual Update Instructions:"
echo "=============================="
echo ""
echo "🚂 Railway (Backend):"
echo "1. Go to https://railway.app/dashboard"
echo "2. Select your CryptoGig project"
echo "3. Click 'Variables' tab"
echo "4. Update MONGO_URL variable"
echo "5. Save (auto-redeploys)"
echo ""
echo "▲ Vercel (Frontend - if needed):"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Select your project"
echo "3. Settings → Environment Variables"
echo "4. Update any backend-related variables"
echo ""
echo "🧪 Testing:"
echo "1. Wait 1-2 minutes for deployment"
echo "2. Test user registration"
echo "3. Check if data persists"
echo ""
echo "✅ MongoDB connection string updated!"