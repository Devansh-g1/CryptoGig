#!/bin/bash

echo "🔧 Making Vercel Deployment Public"
echo "=================================="

cd frontend

echo "1. Checking current Vercel project settings..."
vercel ls

echo ""
echo "2. Making deployment public..."
# Remove the current private deployment
vercel remove build --yes

echo ""
echo "3. Creating new public deployment..."
# Deploy with public settings
vercel --prod --yes --public ./build

echo ""
echo "✅ New public deployment created!"
echo "📝 The new URL should be accessible to everyone without login"