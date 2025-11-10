#!/bin/bash

echo "🚀 Deploying Fixed Backend with All Features"
echo "============================================"

cd backend

# Backup current server
if [ -f "server.py" ]; then
    cp server.py server_backup_$(date +%Y%m%d_%H%M%S).py
fi

# Use the fixed server
cp server_fixed.py server.py

echo "✅ Updated server.py with fixed version"
echo ""
echo "📋 New Features:"
echo "  ✅ Arbitrator wallet: 0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483"
echo "  ✅ Auto email verification (no email link needed)"
echo "  ✅ Default role: client (no role selection during registration)"
echo "  ✅ Role switching: Switch between client and freelancer"
echo "  ✅ Job creation with escrow through arbitrator"
echo "  ✅ Freelancer hourly rate in profile"
echo "  ✅ Community/marketplace to find freelancers"
echo ""

# Deploy to Railway
echo "🚀 Deploying to Railway..."
railway up --detach

echo ""
echo "✅ Backend deployed!"
echo ""
echo "🧪 Test endpoints:"
echo "  Health: curl https://cryptogig-production.up.railway.app/api/health"
echo "  Jobs: curl https://cryptogig-production.up.railway.app/api/jobs"
echo "  Freelancers: curl https://cryptogig-production.up.railway.app/api/freelancers"
echo ""
echo "📝 API Endpoints Available:"
echo "  POST /api/auth/register - Register (no role selection)"
echo "  POST /api/auth/login - Login"
echo "  POST /api/auth/switch-role - Switch between client/freelancer"
echo "  PUT /api/profile/freelancer - Update freelancer profile (with hourly rate)"
echo "  POST /api/jobs - Create job (money goes to arbitrator escrow)"
echo "  GET /api/jobs - List all jobs"
echo "  POST /api/jobs/{id}/apply - Apply to job"
echo "  GET /api/freelancers - Browse freelancers (community)"
echo ""
echo "⏳ Wait 30-60 seconds for Railway to deploy, then test your app!"