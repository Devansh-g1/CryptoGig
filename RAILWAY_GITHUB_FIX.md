# Fix Railway GitHub Connection

## The Problem
Railway is NOT cloning from GitHub. It's using an old cached version.

## Solution: Complete Reconnection

### Step 1: Remove Current Service
1. Go to Railway Dashboard
2. Click on your backend service
3. Go to **Settings** tab (bottom)
4. Scroll down to **Danger Zone**
5. Click **"Remove Service from Project"**
6. Confirm deletion

### Step 2: Create New Service from GitHub
1. In your Railway project, click **"+ New"**
2. Select **"GitHub Repo"**
3. If prompted, authorize Railway to access your GitHub
4. Select repository: **`Devansh-g1/EDAI-LIFTTRIBE`**
5. Railway will show deployment options

### Step 3: Configure the New Service
When Railway asks for configuration:

**Root Directory:** `backend`
**Branch:** `main`

Railway will automatically:
- Detect the Dockerfile in `backend/`
- Start building
- Deploy

### Step 4: Add Environment Variables
After deployment starts, go to **Variables** tab and add:

```
MONGODB_URL=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
FRONTEND_URL=https://your-frontend.vercel.app
ARBITRATOR_WALLET=0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483
```

### Step 5: Verify Deployment
Wait 2-3 minutes, then check:

```bash
curl https://your-new-railway-url.up.railway.app/api/health
```

You should see:
```json
{
  "status": "healthy",
  "version": "2.0.0-FIXED-NO-EMAIL-VERIFICATION",
  "features": ["instant_registration", "mongodb_integrated", "no_email_verification"]
}
```

## Alternative: Check Railway CLI

If you want to keep the current service, try Railway CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Force deploy from current directory
cd backend
railway up
```

## What's Happening
Railway sometimes caches the initial deployment method. If you deployed via CLI or local files first, it won't switch to GitHub automatically. You need to create a fresh service from GitHub.

## After Success
Once the new service is running:
1. Update your frontend's API URL to the new Railway URL
2. Test registration without email verification
3. Delete the old service if it's still there
