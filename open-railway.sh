#!/bin/bash

echo "🚂 Opening Railway Dashboard..."
echo ""
echo "Configure these settings:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Source:"
echo "   ✓ Connect to GitHub"
echo "   ✓ Repository: Devansh-g1/CryptoGig"
echo "   ✓ Branch: main"
echo ""
echo "2. Root Directory:"
echo "   ✓ Set to: backend"
echo ""
echo "3. Start Command:"
echo "   ✓ uvicorn server:app --host 0.0.0.0 --port \$PORT"
echo ""
echo "4. Deploy:"
echo "   ✓ Click Deploy button"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd backend
railway open

echo ""
echo "✅ Railway dashboard opened in browser"
echo ""
echo "After configuration, verify deployment:"
echo "  curl https://clientarbitrator-production.up.railway.app/api/health"
echo ""
