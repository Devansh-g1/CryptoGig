# 🔍 Railway Diagnostic Guide

## Check These Things in Order

### 1. Verify Variables Are in Backend Service

**Go to Railway:**
1. Open: https://railway.app
2. Click your project
3. Click on the **backend service** (the box/card with your backend)
4. Click **"Variables"** tab

**You should see:**
```
MONGO_URL = mongodb+srv://CryptoUser:...
DB_NAME = cryptogig_db
(and other variables)
```

**If you DON'T see them:**
- You added them to the wrong place (project level)
- Add them directly to THIS service

### 2. Check Deployment Status

**In the backend service:**
1. Click **"Deployments"** tab
2. Look at the latest deployment
3. Check the status:
   - ✅ **Success** - Good, but might be old code
   - ⏳ **Building** - Wait for it to finish
   - ❌ **Failed** - Click to see error logs

### 3. Check Logs for MongoDB Connection

**In the backend service:**
1. Click **"Logs"** tab (or **"View Logs"**)
2. Look for these messages:

**Good signs:**
```
✅ Successfully connected to MongoDB!
✅ Application startup complete
✅ Uvicorn running on...
```

**Bad signs:**
```
❌ KeyError: 'MONGO_URL'
❌ MongoDB connection failed
❌ Authentication failed
❌ Connection timeout
```

### 4. Check Which Code Version is Running

The backend might be running **old code** that uses in-memory storage.

**Solution: Push Latest Code**

```bash
# Make sure you're in the project root
git add .
git commit -m "Update backend with MongoDB connection"
git push origin main
```

Railway will automatically detect the push and redeploy.

### 5. Check Railway Build Settings

**In the backend service:**
1. Click **"Settings"** tab
2. Check **"Root Directory"**:
   - Should be `/backend` or `/` (depending on your repo structure)
3. Check **"Start Command"**:
   - Should be something like: `uvicorn server:app --host 0.0.0.0 --port $PORT`

### 6. Force a Fresh Deploy

**Option A: Redeploy**
1. Go to **"Deployments"** tab
2. Click on latest deployment
3. Click **"Redeploy"** button

**Option B: Trigger New Deploy**
1. Make a small change to any file
2. Commit and push
3. Railway will auto-deploy

## Common Issues and Fixes

### Issue 1: Variables Not Taking Effect

**Symptom:** Added variables but still shows "in_memory"

**Fix:**
1. Verify variables are in **service** (not project)
2. Click **"Redeploy"** in Deployments tab
3. Wait 2-3 minutes
4. Check logs for MongoDB connection

### Issue 2: Old Code Running

**Symptom:** Health check shows old response format

**Fix:**
```bash
git add .
git commit -m "Update backend"
git push
```

Wait for Railway to redeploy (2-3 minutes).

### Issue 3: MongoDB Connection Fails

**Symptom:** Logs show "MongoDB connection failed"

**Fix:**
1. Check MongoDB Atlas Network Access
2. Ensure `0.0.0.0/0` is whitelisted
3. Verify connection string is correct
4. Check password doesn't have special characters (or URL encode them)

### Issue 4: App Crashes on Startup

**Symptom:** Deployment fails, logs show KeyError

**Fix:**
1. Ensure ALL required variables are set:
   - MONGO_URL
   - DB_NAME
   - JWT_SECRET
   - JWT_ALGORITHM
2. Redeploy after adding variables

## Quick Diagnostic Commands

### Test Backend Health
```bash
curl https://cryptogig-production.up.railway.app/api/health
```

### Test with Verbose Output
```bash
curl -v https://cryptogig-production.up.railway.app/api/health
```

### Test Registration
```bash
curl -X POST https://cryptogig-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test","role":"client"}'
```

## What to Share if Still Not Working

1. **Screenshot of Variables tab** in backend service
2. **Recent logs** from backend service (last 50 lines)
3. **Output of health check** curl command
4. **Deployment status** (success/failed)

## Expected Behavior

When everything is correct:

1. **Variables tab** shows MONGO_URL and other vars
2. **Logs** show "Successfully connected to MongoDB"
3. **Health check** returns `"database": "connected"`
4. **Frontend** can register users and data persists

## Railway Service vs Project

```
Railway Dashboard
│
├── Project Level (cryptogig-production)
│   ├── Shared Variables ❌ Don't use for backend
│   └── Settings
│
└── Service Level (backend service) ✅ Use this!
    ├── Variables ← Add MONGO_URL here
    ├── Deployments
    ├── Logs
    └── Settings
```

## Still Shows "in_memory"?

This means one of these:

1. **Variables not in service** - Add to backend service, not project
2. **Old code running** - Push latest code to GitHub
3. **Variables not loaded** - Redeploy the service
4. **MongoDB connection failed** - Check logs for errors

## Next Steps

1. ✅ Verify variables are in **backend service** → Variables tab
2. ✅ Push latest code: `git push`
3. ✅ Wait for redeploy (2-3 minutes)
4. ✅ Check logs for MongoDB connection
5. ✅ Test health endpoint
6. ✅ Test frontend registration

## Need More Help?

Run these and share the output:

```bash
# 1. Health check
curl https://cryptogig-production.up.railway.app/api/health

# 2. API docs (should load)
curl https://cryptogig-production.up.railway.app/docs

# 3. Test registration
curl -X POST https://cryptogig-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test123@example.com","password":"test123","name":"Test","role":"client"}'
```

Also share:
- Screenshot of Variables tab in backend service
- Last 20 lines of logs from backend service
