# Railway GitHub Integration Setup

## Current Issue
Railway is trying to deploy from local files but can't find the `backend` directory because it needs to be configured to deploy from GitHub with the correct root directory.

## Solution: Connect Railway to GitHub

### Step 1: Go to Railway Dashboard
1. Open: https://railway.app/dashboard
2. Navigate to your project: **CryptoGig**
3. Click on the **Client_arbitrator** service

### Step 2: Configure GitHub Source
1. In the service settings, click on **Settings** tab
2. Under **Source**, click **Connect to GitHub**
3. Select repository: **Devansh-g1/CryptoGig.git**
4. Select branch: **main**

### Step 3: Set Root Directory
1. In the same Settings tab, find **Root Directory**
2. Set it to: `backend`
3. This tells Railway to look in the `backend` folder for deployment

### Step 4: Configure Build Settings
Railway should auto-detect Python, but verify:
- **Build Command**: (auto-detected)
- **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`

### Step 5: Verify Environment Variables
Make sure these are set (already configured):
- `MONGO_URL`
- `DB_NAME`
- `JWT_SECRET`
- `CONTRACT_ADDRESS`
- `CORS_ORIGINS`
- `FRONTEND_URL`

### Step 6: Deploy
1. Click **Deploy** or it will auto-deploy on push to main
2. Watch the build logs
3. Once deployed, test: https://clientarbitrator-production.up.railway.app/api/health

## Alternative: Deploy via CLI with GitHub

If you prefer CLI, you can trigger a GitHub-based deployment:

```bash
# Make sure Railway is connected to GitHub repo
railway service

# This should show GitHub as the source
# If not, you need to configure via dashboard first
```

## Verification

After setup, pushing to GitHub should automatically trigger Railway deployment:

```bash
git add .
git commit -m "Update backend"
git push origin main
# Railway will auto-deploy from GitHub
```

## Current Status

✅ Code pushed to GitHub: https://github.com/Devansh-g1/CryptoGig.git
✅ Railway project exists: CryptoGig
✅ Railway service exists: Client_arbitrator
⚠️ Need to configure: GitHub source + root directory

## Quick Fix Command

Since Railway CLI doesn't support changing source via CLI, you must use the dashboard:

1. Go to: https://railway.app/project/6ce15398-15d7-4a70-ab90-c938d6245a00
2. Click service → Settings → Source → Connect GitHub
3. Set root directory to `backend`
4. Save and redeploy

## Backend URL
https://clientarbitrator-production.up.railway.app
