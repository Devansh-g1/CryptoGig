#!/bin/bash

echo "🔍 Debugging Connection Issues"
echo "============================="

echo "1. Testing backend health endpoint..."
curl -v https://cryptogig-production.up.railway.app/api/health

echo -e "\n\n2. Testing backend root endpoint..."
curl -v https://cryptogig-production.up.railway.app/

echo -e "\n\n3. Testing CORS headers..."
curl -H "Origin: https://build-gwe7m4wpy-devanshs-projects-be524177.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://cryptogig-production.up.railway.app/api/auth/register

echo -e "\n\n4. Checking Railway logs..."
cd backend
railway logs --tail 20