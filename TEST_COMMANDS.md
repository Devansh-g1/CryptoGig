# 🧪 Test Commands for Production

## Current Status

✅ **App is running**
✅ **MongoDB is connected** (users are being saved)
❌ **Old code deployed** (still has email verification)

## After You Redeploy Latest Code

Use these commands to test:

### Test 1: Register User (Should Return Token)

```bash
curl -X POST https://cryptogig-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user1@example.com","password":"test123","name":"User One","role":"client"}'
```

**Expected (NEW CODE):**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": "...",
    "email": "user1@example.com",
    "name": "User One",
    "role": "client"
  }
}
```

**Current (OLD CODE):**
```json
{
  "message": "Verification email sent..."
}
```

### Test 2: Register Another User

```bash
curl -X POST https://cryptogig-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user2@example.com","password":"test123","name":"User Two","role":"freelancer"}'
```

### Test 3: Register with Timestamp (Always Unique)

```bash
curl -X POST https://cryptogig-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"user$(date +%s)@example.com\",\"password\":\"test123\",\"name\":\"Test User\",\"role\":\"client\"}"
```

### Test 4: Login (After Registration Works)

```bash
curl -X POST https://cryptogig-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user1@example.com","password":"test123"}'
```

**Expected:**
```json
{
  "access_token": "...",
  "user": {...}
}
```

### Test 5: Create Job (Use Token from Registration)

```bash
# First register and save token
TOKEN=$(curl -s -X POST https://cryptogig-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"client1@example.com","password":"test123","name":"Client","role":"client"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])")

# Then create job
curl -X POST https://cryptogig-production.up.railway.app/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Test Job","description":"Test description","budget_usdc":100,"required_skills":["Python"]}'
```

### Test 6: Get Jobs

```bash
curl -X GET https://cryptogig-production.up.railway.app/api/jobs \
  -H "Authorization: Bearer $TOKEN"
```

### Test 7: Create Channel

```bash
curl -X POST https://cryptogig-production.up.railway.app/api/channels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Python Developers","skill":"python","description":"For Python devs"}'
```

### Test 8: Get Channels

```bash
curl -X GET https://cryptogig-production.up.railway.app/api/channels
```

## Quick Test Script

Save this as `test-production.sh`:

```bash
#!/bin/bash

API="https://cryptogig-production.up.railway.app/api"

echo "🧪 Testing Production API"
echo "========================="
echo ""

# Test 1: Register
echo "1️⃣ Testing Registration..."
RESPONSE=$(curl -s -X POST $API/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test$(date +%s)@example.com\",\"password\":\"test123\",\"name\":\"Test\",\"role\":\"client\"}")

echo "$RESPONSE" | python3 -m json.tool

if echo "$RESPONSE" | grep -q "access_token"; then
    echo "✅ Registration works! (Returns token)"
    TOKEN=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])")
    
    # Test 2: Create Job
    echo ""
    echo "2️⃣ Testing Job Creation..."
    curl -s -X POST $API/jobs \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{"title":"Test Job","description":"Test","budget_usdc":100,"required_skills":["Python"]}' \
      | python3 -m json.tool
    
    echo "✅ Job creation works!"
else
    echo "❌ Still using old code (email verification required)"
    echo "👉 Redeploy latest code in Railway"
fi
```

Run it:
```bash
chmod +x test-production.sh
./test-production.sh
```

## Frontend Test

After backend is updated, test frontend:

1. Open: https://cryptogig-platform.netlify.app
2. Click "Register"
3. Fill in:
   - Email: yourname@example.com
   - Password: test123
   - Name: Your Name
4. Click "Create Account"
5. ✅ Should login immediately (no email verification)
6. Create a job
7. Refresh page
8. ✅ Job should still be there

## How to Redeploy Latest Code

**In Railway Dashboard:**
1. Go to: https://railway.app
2. Click your project
3. Click backend service
4. Click "Deployments" tab
5. Click "Deploy" button
6. Wait 5 minutes
7. Run tests above

## Success Indicators

When latest code is deployed:
- ✅ Registration returns `access_token`
- ✅ No "verification email sent" message
- ✅ Can login immediately
- ✅ Jobs persist
- ✅ Channels work

## Current vs New Code

**Current (OLD):**
```bash
$ curl -X POST .../auth/register ...
{"message": "Verification email sent..."}
```

**After Redeploy (NEW):**
```bash
$ curl -X POST .../auth/register ...
{"access_token": "eyJ...", "user": {...}}
```

That's the difference! 🎯
