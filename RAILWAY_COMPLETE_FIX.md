# 🔧 Railway Complete Fix - Step by Step

## Current Situation

- ✅ Root directory set to `backend`
- ✅ Code pushed with correct configuration
- ❌ Still getting 502 "connection dial timeout"
- ⚠️ This means app is not listening on the correct port

## The Issue

Railway expects the app to listen on the `$PORT` environment variable, but something is preventing the app from starting correctly.

## Complete Fix - Do These Steps in Order

### Step 1: Verify Root Directory

**In Railway → Backend Service → Settings:**

- **Root Directory**: Should be `backend` (you already set this ✅)

### Step 2: Verify Start Command

**In Railway → Backend Service → Settings:**

Find **"Custom Start Command"** or **"Start Command"**:

**Should be:**
```
python -m uvicorn server:app --host 0.0.0.0 --port $PORT
```

**NOT:**
```
cd backend && python -m uvicorn server:app --host 0.0.0.0 --port $PORT
```

(No `cd backend` because root directory is already `backend`)

**If it's wrong:**
1. Click on the start command field
2. Change it to: `python -m uvicorn server:app --host 0.0.0.0 --port $PORT`
3. Click "Save"

### Step 3: Verify Environment Variables

**In Railway → Backend Service → Variables:**

**MUST have these:**
```
MONGO_URL = mongodb+srv://CryptoUser:Devansh%401234@cluster0.go4i2sx.mongodb.net/cryptogig_db?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true

DB_NAME = cryptogig_db

JWT_SECRET = your-secret-key

JWT_ALGORITHM = HS256

PORT = ${{PORT}}
```

**If PORT is missing:**
- Railway usually provides this automatically
- But you can add it: Name: `PORT`, Value: `${{PORT}}`

### Step 4: Check Build Command

**In Railway → Backend Service → Settings:**

Find **"Custom Build Command"** or **"Build Command"**:

**Should be:**
```
pip install -r requirements.txt
```

**NOT:**
```
cd backend && pip install -r requirements.txt
```

### Step 5: Force Clean Deploy

After verifying all settings:

1. Go to **"Deployments"** tab
2. Click **"Deploy"** button (top right)
3. Wait for deployment to complete (3-5 minutes)

### Step 6: Watch Deployment Logs

**In Railway → Backend Service → Logs:**

**Look for these messages:**

✅ **Good signs:**
```
Installing dependencies...
Successfully installed fastapi motor pymongo...
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:XXXX
```

❌ **Bad signs:**
```
No such file or directory: requirements.txt
ModuleNotFoundError: No module named 'motor'
ValueError: MONGO_URL environment variable is required
MongoDB connection failed
```

### Step 7: Test After Deployment

Wait 5 minutes after deployment starts, then test:

```bash
curl https://cryptogig-production.up.railway.app/api/health
```

**Expected:**
```json
{
  "status": "healthy",
  "database": "connected",
  "service": "cryptogig-backend"
}
```

## Alternative: Use Railway CLI

If dashboard settings don't work, use CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Set root directory
railway service

# Set variables
railway variables set MONGO_URL="mongodb+srv://CryptoUser:Devansh%401234@cluster0.go4i2sx.mongodb.net/cryptogig_db?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true"

railway variables set DB_NAME="cryptogig_db"

# Deploy
railway up
```

## Settings Summary

Here's what your Railway backend service settings should look like:

```
Settings Tab:
├── Root Directory: backend
├── Build Command: pip install -r requirements.txt
└── Start Command: python -m uvicorn server:app --host 0.0.0.0 --port $PORT

Variables Tab:
├── MONGO_URL = mongodb+srv://CryptoUser:...
├── DB_NAME = cryptogig_db
├── JWT_SECRET = your-secret-key
└── JWT_ALGORITHM = HS256
```

## Common Mistakes

### ❌ Mistake 1: Double Directory
- Root Directory: `backend`
- Start Command: `cd backend && python ...`
- **Result:** Tries to access `backend/backend/` (doesn't exist)

### ✅ Correct:
- Root Directory: `backend`
- Start Command: `python -m uvicorn server:app --host 0.0.0.0 --port $PORT`

### ❌ Mistake 2: Missing Variables
- MONGO_URL not set
- **Result:** App crashes on startup

### ✅ Correct:
- All variables set in Variables tab

### ❌ Mistake 3: Wrong Port
- App listening on fixed port (8000)
- **Result:** Railway can't connect

### ✅ Correct:
- App uses `$PORT` environment variable

## Debugging Steps

### 1. Check Deployment Status
- Go to Deployments tab
- Is latest deployment "Success" or "Failed"?
- If Failed, click to see error logs

### 2. Check Application Logs
- Go to Logs tab
- Do you see "Application startup complete"?
- Do you see any error messages?

### 3. Check Health Endpoint
```bash
curl -v https://cryptogig-production.up.railway.app/api/health
```
- Does it return 200 OK or 502?
- What's the response?

## If Still Not Working

### Option 1: Screenshot Checklist
Take screenshots of:
1. Settings tab (showing Root Directory and Start Command)
2. Variables tab (showing all variables)
3. Deployments tab (showing latest deployment status)
4. Logs tab (showing last 50 lines)

### Option 2: Try Different Configuration

**In Settings:**
1. Clear Root Directory (leave empty)
2. Set Start Command to: `cd backend && python -m uvicorn server:app --host 0.0.0.0 --port $PORT`
3. Set Build Command to: `cd backend && pip install -r requirements.txt`
4. Redeploy

## Expected Timeline

- Update settings: 2 minutes
- Railway redeploy: 3-5 minutes
- Test: 1 minute
- **Total: 8 minutes**

## Success Criteria

When everything works:
- ✅ Deployment status: Success
- ✅ Logs show: "Application startup complete"
- ✅ Health endpoint returns 200 OK
- ✅ Response shows: `"database": "connected"`

## Next Steps

1. **Verify settings** in Railway dashboard
2. **Ensure start command** doesn't have `cd backend`
3. **Verify variables** are all set
4. **Redeploy** and wait 5 minutes
5. **Test** health endpoint
6. **Check logs** if still failing

The key is: **Root Directory = `backend`** means commands run FROM the backend directory, so no `cd backend` needed! 🔑
