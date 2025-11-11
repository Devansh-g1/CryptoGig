#!/bin/bash

echo "🔍 Checking if members sidebar code is deployed..."
echo ""

# Check if the site is accessible
echo "1️⃣ Checking site accessibility..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://cryptogig-platform.netlify.app)
if [ "$STATUS" = "200" ]; then
    echo "✅ Site is accessible (HTTP $STATUS)"
else
    echo "❌ Site returned HTTP $STATUS"
fi

echo ""
echo "2️⃣ Waiting for Netlify build to complete..."
echo "   This usually takes 2-3 minutes"
echo ""
echo "📋 To check build status:"
echo "   1. Go to https://app.netlify.com"
echo "   2. Select your site"
echo "   3. Check the 'Deploys' tab"
echo ""
echo "🎯 After deployment completes:"
echo "   1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)"
echo "   2. Go to Community page"
echo "   3. Click on a channel"
echo "   4. You should see 3 columns with a BLUE BORDER on the right"
echo "   5. Open browser console (F12) to see debug logs"
