#!/bin/bash

echo "🧪 Testing API Endpoints Directly..."
echo ""

# First, let's register a test user
echo "1️⃣ Testing Registration:"
REGISTER_RESPONSE=$(curl -s -X POST https://clientarbitrator-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "role": "client",
    "wallet_address": "0x1234567890123456789012345678901234567890"
  }')
echo "$REGISTER_RESPONSE" | python3 -m json.tool
echo ""

# Extract token
TOKEN=$(echo "$REGISTER_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('access_token', ''))" 2>/dev/null)

if [ -z "$TOKEN" ]; then
    echo "❌ Registration failed or token not received"
    echo "Trying to login instead..."
    
    LOGIN_RESPONSE=$(curl -s -X POST https://clientarbitrator-production.up.railway.app/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{
        "email": "test@example.com",
        "password": "Test123!"
      }')
    echo "$LOGIN_RESPONSE" | python3 -m json.tool
    TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('access_token', ''))" 2>/dev/null)
fi

echo ""
echo "2️⃣ Testing Job Creation with Token:"
if [ -n "$TOKEN" ]; then
    curl -s -X POST https://clientarbitrator-production.up.railway.app/api/jobs \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{
        "title": "Test Job",
        "description": "Test description",
        "budget_usdc": 100,
        "required_skills": ["JavaScript", "React"]
      }' | python3 -m json.tool
else
    echo "❌ No token available, skipping job creation test"
fi
