# 🔧 Fix Railway - Add Variables to Service (Not Project)

## The Issue

You added variables to **Project Shared Variables**, but Railway needs them in the **Service Variables** (the backend service itself).

## Fix It Now (2 minutes)

### Step 1: Go to Railway Dashboard
Open: https://railway.app

### Step 2: Navigate to Your Backend Service
1. Click on your **cryptogig-production** project
2. You should see multiple services/boxes
3. Click on the **backend service** (the one running your Python/FastAPI app)
   - It might be called "server" or "backend" or have your repo name

### Step 3: Add Variables to THIS Service
1. In the backend service view, click the **"Variables"** tab at the top
2. Click **"+ New Variable"** or **"Raw Editor"**
3. Add these variables **directly to this service**:

```
MONGO_URL=mongodb+srv://CryptoUser:Devansh%401234@cluster0.go4i2sx.mongodb.net/cryptogig_db?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true
DB_NAME=cryptogig_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ALGORITHM=HS256
CORS_ORIGINS=https://cryptogig-platform.netlify.app,http://localhost:3000
FRONTEND_URL=https://cryptogig-platform.netlify.app
ARBITRATOR_WALLET=0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
```

### Step 4: Trigger Redeploy
After adding variables:
1. Railway should automatically redeploy
2. OR click the **"Deploy"** button
3. OR go to **"Deployments"** tab and click **"Redeploy"**

### Step 5: Wait and Check Logs
1. Go to **"Deployments"** tab
2. Click on the latest deployment
3. Watch the logs
4. Look for:
   - ✅ "Successfully connected to MongoDB!"
   - ✅ "Application startup complete"
   - ❌ Any MongoDB connection errors

### Step 6: Verify
After deployment completes (2-3 minutes):

```bash
curl https://cryptogig-production.up.railway.app/api/health
```

Should show:
```json
{
  "status": "healthy",
  "database": "connected"  ← This should say "connected" now!
}
```

## Visual Guide

```
Railway Dashboard
├── Your Project (cryptogig-production)
│   ├── Shared Variables ❌ (You added here - wrong place)
│   │
│   └── Services
│       ├── Backend Service ✅ (Add variables HERE!)
│       │   ├── Variables tab ← Click here
│       │   ├── Deployments tab
│       │   └── Logs tab
│       │
│       └── Other services (if any)
```

## Common Mistakes

### ❌ Wrong: Project Level Variables
- These are shared across all services
- Backend service might not inherit them
- Not recommended for service-specific config

### ✅ Correct: Service Level Variables
- Added directly to the backend service
- Service uses these variables
- This is what you need!

## If Still Shows "in_memory"

### Check 1: Are Variables in the Right Place?
1. Click on **backend service** (not project)
2. Click **"Variables"** tab
3. You should see MONGO_URL listed there
4. If not, add it again to THIS service

### Check 2: Did Service Redeploy?
1. Go to **"Deployments"** tab in backend service
2. Check the timestamp of latest deployment
3. Should be recent (after you added variables)
4. If not, click **"Redeploy"**

### Check 3: Check Logs for Errors
1. Go to **"Logs"** tab in backend service
2. Look for MongoDB connection errors
3. Common errors:
   - "Authentication failed" → Wrong password
   - "Connection timeout" → IP not whitelisted
   - "DNS error" → Wrong connection string

### Check 4: Verify MongoDB Atlas
1. Go to: https://cloud.mongodb.com
2. Click **"Network Access"**
3. Ensure `0.0.0.0/0` is in the list
4. Click **"Database Access"**
5. Verify user `CryptoUser` exists

## Quick Test

After redeploying, test immediately:

```bash
# Test health
curl https://cryptogig-production.up.railway.app/api/health

# Test registration
curl -X POST https://cryptogig-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test","role":"client"}'
```

## Alternative: Use Railway CLI

If dashboard doesn't work, use CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Add variables
railway variables set MONGO_URL="mongodb+srv://CryptoUser:Devansh%401234@cluster0.go4i2sx.mongodb.net/cryptogig_db?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true"

# Redeploy
railway up
```

## Expected Timeline

- Add variables: 1 minute
- Railway redeploy: 2-3 minutes
- Test: 1 minute
- **Total: ~5 minutes**

## Success Indicators

When it works, you'll see:
- ✅ Health endpoint shows `"database": "connected"`
- ✅ Can register users on production site
- ✅ Data persists after page refresh
- ✅ No "in_memory" in health check
- ✅ Logs show "Successfully connected to MongoDB"

## Still Not Working?

If after adding variables to the **service** (not project) it still shows "in_memory":

1. **Check the code**: The backend might be using old code
   - Solution: Push latest code to GitHub
   - Railway will auto-deploy

2. **Check environment loading**: Backend might not be reading env vars
   - Check Railway logs for startup messages
   - Look for MongoDB connection attempts

3. **Force redeploy**: 
   - Go to Deployments tab
   - Click "Redeploy" on latest deployment

## Need Help?

Share:
1. Screenshot of Variables tab in backend service
2. Recent logs from backend service
3. Output of health check curl command

## Remember

✅ Add variables to **Backend Service** → Variables tab
❌ Not to **Project** → Shared Variables

This is the key difference! 🔑
