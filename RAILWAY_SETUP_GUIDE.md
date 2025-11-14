# 🚂 Railway Deployment Setup Guide

## Problem
Railway shows error: "Could not find root directory: backend"

This happens because Railway is trying to deploy from local CLI instead of GitHub, and the directory structure doesn't match.

## ✅ Solution: Configure Railway to Deploy from GitHub

### Method 1: Railway Dashboard (Recommended)

#### Step 1: Open Railway Dashboard
The command `railway open` should have opened your browser to:
https://railway.app/project/6ce15398-15d7-4a70-ab90-c938d6245a00

Or manually go to: https://railway.app/dashboard

#### Step 2: Select Your Service
1. Click on project: **CryptoGig**
2. Click on service: **Client_arbitrator**

#### Step 3: Configure GitHub Source
1. Click **Settings** (gear icon)
2. Scroll to **Source** section
3. Click **Disconnect** if there's an existing source
4. Click **Connect Repo**
5. Select: **Devansh-g1/CryptoGig**
6. Branch: **main**

#### Step 4: Set Root Directory
Still in Settings:
1. Find **Root Directory** field
2. Enter: `backend`
3. Click **Save**

#### Step 5: Configure Start Command
1. In Settings, find **Start Command**
2. Enter: `uvicorn server:app --host 0.0.0.0 --port $PORT`
3. Click **Save**

#### Step 6: Deploy
1. Click **Deploy** button
2. Or it will auto-deploy when you push to GitHub

### Method 2: Delete and Recreate Service

If the above doesn't work, recreate the service:

#### Step 1: Delete Current Service
```bash
# In Railway dashboard, delete the Client_arbitrator service
```

#### Step 2: Create New Service from GitHub
1. In Railway project, click **+ New**
2. Select **GitHub Repo**
3. Choose: **Devansh-g1/CryptoGig**
4. Railway will detect it's a Python app

#### Step 3: Configure Root Directory
1. Before deploying, go to Settings
2. Set **Root Directory**: `backend`
3. Set **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`

#### Step 4: Add Environment Variables
Copy these from your old service or set manually:

```bash
CONTRACT_ADDRESS=0x8A808f52b19F07C53981b4f43f84E80972F468C7
CORS_ORIGINS=https://cryptogig-platform.netlify.app
DB_NAME=cryptogig_db
FRONTEND_URL=https://cryptogig-platform.netlify.app
JWT_SECRET=ae98b6c6e1999ffd80fb056d45dcdc713821ed3488968bcbc92c397b66c2fc3bc240eca3
MONGO_URL=<your-mongodb-url>
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
```

#### Step 5: Deploy
Click **Deploy** and watch the logs

### Method 3: Use Railway CLI with GitHub

Try forcing Railway to use GitHub:

```bash
cd backend
railway link
# Select: CryptoGig → production → Client_arbitrator

# Try to trigger GitHub deployment
railway up --detach
```

## 🔍 Verify Deployment

After setup, check:

1. **Health Check**: https://clientarbitrator-production.up.railway.app/api/health
2. **Build Logs**: Check in Railway dashboard
3. **Runtime Logs**: `railway logs`

## 🔄 Auto-Deploy on Git Push

Once GitHub is connected:

```bash
git add .
git commit -m "Update backend"
git push origin main
# Railway automatically deploys! 🎉
```

## 📝 Current Configuration

**GitHub Repo**: https://github.com/Devansh-g1/CryptoGig.git
**Branch**: main
**Root Directory**: backend
**Start Command**: uvicorn server:app --host 0.0.0.0 --port $PORT
**Backend URL**: https://clientarbitrator-production.up.railway.app

## ⚠️ Important Notes

1. **Root Directory is Critical**: Railway needs to know to look in the `backend` folder
2. **GitHub Connection**: Must be connected to GitHub, not deploying from local CLI
3. **Environment Variables**: Make sure all env vars are set in Railway dashboard
4. **Domain**: Your current domain will remain the same after reconfiguration

## 🆘 If Still Having Issues

1. Check Railway logs: `railway logs --tail 50`
2. Verify GitHub connection in dashboard
3. Ensure `backend` folder exists in repo root
4. Check that `server.py` exists in `backend/` folder
5. Verify `requirements.txt` is in `backend/` folder

## ✅ Success Indicators

You'll know it's working when:
- Railway dashboard shows "GitHub" as source
- Build logs show: "Detected Python application"
- Deployment succeeds without "Could not find root directory" error
- Health check returns 200 OK
