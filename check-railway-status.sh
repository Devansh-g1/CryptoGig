#!/bin/bash

echo "🔍 Checking Railway Deployment Status..."
echo ""

echo "1️⃣ Checking API Health:"
curl -s https://clientarbitrator-production.up.railway.app/api/health | python3 -m json.tool
echo ""

echo "2️⃣ Checking Root Endpoint (CORS info):"
curl -s https://clientarbitrator-production.up.railway.app/api/ | python3 -m json.tool
echo ""

echo "3️⃣ Testing CORS Preflight:"
curl -s -H "Origin: https://cryptogig-platform.netlify.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type,Authorization" \
     -X OPTIONS \
     https://clientarbitrator-production.up.railway.app/api/jobs -I 2>&1 | grep -i "access-control"
echo ""

echo "✅ If you see 'access-control-allow-origin' above, CORS is working!"
echo "❌ If not, Railway hasn't deployed the latest code yet."
echo ""
echo "📋 Next Steps:"
echo "   1. Go to https://railway.app"
echo "   2. Check your project deployments"
echo "   3. Verify CORS_ORIGINS environment variable is set"
echo "   4. Manually trigger a redeploy if needed"
