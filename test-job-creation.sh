#!/bin/bash

echo "Testing job creation endpoint..."
echo ""

# Register a test user
echo "1. Registering test user..."
REGISTER_RESPONSE=$(curl -s -X POST https://clientarbitrator-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"testjob$(date +%s)@test.com\",
    \"password\": \"Test123!\",
    \"name\": \"Test User\",
    \"role\": \"client\"
  }")

TOKEN=$(echo "$REGISTER_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('access_token', ''))" 2>/dev/null)

if [ -z "$TOKEN" ]; then
    echo "❌ Failed to get token"
    echo "$REGISTER_RESPONSE" | python3 -m json.tool
    exit 1
fi

echo "✅ Got token: ${TOKEN:0:50}..."
echo ""

# Try to create a job
echo "2. Creating job..."
JOB_RESPONSE=$(curl -s -X POST https://clientarbitrator-production.up.railway.app/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Job",
    "description": "Test description",
    "budget_usdc": 100,
    "required_skills": ["JavaScript", "React"]
  }')

echo "$JOB_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$JOB_RESPONSE"
