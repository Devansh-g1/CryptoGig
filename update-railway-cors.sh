#!/bin/bash

echo "🚂 Updating Railway CORS Configuration"
echo "========================================"
echo ""

# Set the CORS origins
CORS_VALUE="http://localhost:3000,https://cryptogig-platform.netlify.app,https://cryptogig-frontend.vercel.app,https://gig-blockchain.preview.emergentagent.com"

echo "Setting CORS_ORIGINS to:"
echo "$CORS_VALUE"
echo ""

cd backend

# Update CORS_ORIGINS
railway variables --set CORS_ORIGINS="$CORS_VALUE"

echo ""
echo "Setting FRONTEND_URL to:"
echo "https://cryptogig-platform.netlify.app"
echo ""

# Update FRONTEND_URL
railway variables --set FRONTEND_URL="https://cryptogig-platform.netlify.app"

echo ""
echo "✅ Railway variables updated!"
echo ""
echo "⚠️  Important: Railway will auto-redeploy with new settings"
echo "   Wait 2-3 minutes for deployment to complete"
echo ""
echo "🔍 Check deployment status:"
echo "   railway logs --tail 50"
echo ""
echo "🌐 Test after deployment:"
echo "   curl https://clientarbitrator-production.up.railway.app/api/health"
echo ""
