#!/bin/bash

echo "🔧 Updating Railway CORS Settings"
echo "================================="

# Replace YOUR_VERCEL_URL with your actual Vercel deployment URL
VERCEL_URL="YOUR_VERCEL_URL_HERE"

if [ "$VERCEL_URL" = "YOUR_VERCEL_URL_HERE" ]; then
    echo "❌ Please update VERCEL_URL in this script with your actual Vercel URL"
    echo "Example: VERCEL_URL=\"https://cryptogig-frontend-abc123.vercel.app\""
    exit 1
fi

cd backend

echo "Setting CORS_ORIGINS..."
railway variables --set "CORS_ORIGINS=${VERCEL_URL},http://localhost:3000"

echo "Setting FRONTEND_URL..."
railway variables --set "FRONTEND_URL=${VERCEL_URL}"

echo "✅ CORS settings updated!"
echo "Backend will now accept requests from: ${VERCEL_URL}"