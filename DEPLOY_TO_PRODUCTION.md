# 🚀 Deploy to Production (Netlify + Railway)

## Overview

We'll deploy:
- **Backend** → Railway (Free tier)
- **Frontend** → Netlify (Free tier)
- **Database** → MongoDB Atlas (Already set up ✅)

## Step 1: Deploy Backend to Railway

### 1.1 Create Railway Account
1. Go to: https://railway.app
2. Sign up with GitHub (recommended)
3. Verify your email

### 1.2 Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Connect your GitHub account
4. Select your repository
5. Select the **backend** folder (or root if backend is in root)

### 1.3 Configure Environment Variables
In Railway dashboard, go to **Variables** tab and add:

```env
MONGO_URL=mongodb+srv://CryptoUser:Devansh%401234@cluster0.go4i2sx.mongodb.net/cryptogig_db?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true
DB_NAME=cryptogig_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random
JWT_ALGORITHM=HS256
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
ARBITRATOR_WALLET=0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483
CORS_ORIGINS=https://your-netlify-site.netlify.app,http://localhost:3000
FRONTEND_URL=https://your-netlify-site.netlify.app
```

**Important**: 
- Use your actual MongoDB connection string
- Generate a strong JWT_SECRET (random 64+ character string)
- Update CORS_ORIGINS and FRONTEND_URL after deploying frontend

### 1.4 Deploy
1. Railway will automatically deploy
2. Wait for deployment to complete (2-3 minutes)
3. You'll get a URL like: `https://your-app.up.railway.app`
4. Test it: `https://your-app.up.railway.app/api/health`

### 1.5 Get Your Backend URL
Copy your Railway URL (e.g., `https://cryptogig-production.up.railway.app`)

## Step 2: Deploy Frontend to Netlify

### 2.1 Update Frontend Environment
Update `frontend/.env.production`:

```env
VITE_BACKEND_URL=https://your-railway-app.up.railway.app
VITE_WALLETCONNECT_PROJECT_ID=2f05a7cde2bb14b478f07c00594118b1
VITE_CONTRACT_ADDRESS=
VITE_USDC_ADDRESS=0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582
```

Replace `your-railway-app.up.railway.app` with your actual Railway URL.

### 2.2 Build Frontend
```bash
cd frontend
npm run build
```

This creates a `dist` folder with your production build.

### 2.3 Deploy to Netlify

#### Option A: Netlify CLI (Recommended)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
cd frontend
netlify deploy --prod --dir=dist
```

#### Option B: Netlify Dashboard
1. Go to: https://app.netlify.com
2. Sign up/Login with GitHub
3. Click **"Add new site"** → **"Deploy manually"**
4. Drag and drop the `frontend/dist` folder
5. Wait for deployment

#### Option C: GitHub Integration
1. Push your code to GitHub
2. Go to Netlify dashboard
3. Click **"Add new site"** → **"Import from Git"**
4. Select your repository
5. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
6. Add environment variables (same as .env.production)
7. Click **"Deploy"**

### 2.4 Get Your Frontend URL
Copy your Netlify URL (e.g., `https://cryptogig.netlify.app`)

## Step 3: Update CORS Settings

### 3.1 Update Railway Environment Variables
Go back to Railway dashboard and update:

```env
CORS_ORIGINS=https://your-netlify-site.netlify.app,http://localhost:3000
FRONTEND_URL=https://your-netlify-site.netlify.app
```

Replace with your actual Netlify URL.

### 3.2 Redeploy Backend
Railway will automatically redeploy with new environment variables.

## Step 4: Test Production Deployment

### 4.1 Test Backend
```bash
curl https://your-railway-app.up.railway.app/api/health
```

Should return:
```json
{
  "status": "healthy",
  "database": "connected",
  "service": "cryptogig-backend"
}
```

### 4.2 Test Frontend
1. Open your Netlify URL in browser
2. Register a new user
3. Create a job
4. Create a channel
5. Send messages
6. Verify everything works

## Quick Deploy Script

I'll create a script to automate this:

```bash
./deploy-production.sh
```

## Environment Variables Summary

### Railway (Backend)
```env
MONGO_URL=mongodb+srv://CryptoUser:Devansh%401234@cluster0.go4i2sx.mongodb.net/cryptogig_db?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true
DB_NAME=cryptogig_db
JWT_SECRET=<generate-a-long-random-string>
JWT_ALGORITHM=HS256
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
ARBITRATOR_WALLET=0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483
CORS_ORIGINS=https://your-netlify-site.netlify.app,http://localhost:3000
FRONTEND_URL=https://your-netlify-site.netlify.app
```

### Netlify (Frontend)
```env
VITE_BACKEND_URL=https://your-railway-app.up.railway.app
VITE_WALLETCONNECT_PROJECT_ID=2f05a7cde2bb14b478f07c00594118b1
VITE_CONTRACT_ADDRESS=
VITE_USDC_ADDRESS=0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582
```

## Troubleshooting

### Backend deployment fails
- Check Railway logs
- Verify MongoDB connection string
- Ensure all environment variables are set

### Frontend can't connect to backend
- Check CORS_ORIGINS in Railway
- Verify VITE_BACKEND_URL in Netlify
- Check browser console for errors

### Database connection fails
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check MongoDB connection string
- Ensure database user has correct permissions

## Cost

All services have free tiers:
- **Railway**: Free tier with 500 hours/month
- **Netlify**: Free tier with 100GB bandwidth/month
- **MongoDB Atlas**: Free tier with 512MB storage

## Next Steps

1. Deploy backend to Railway
2. Get Railway URL
3. Update frontend .env.production
4. Build and deploy frontend to Netlify
5. Get Netlify URL
6. Update Railway CORS settings
7. Test production site

Your app will be live at:
- Frontend: `https://your-app.netlify.app`
- Backend: `https://your-app.up.railway.app`
- API Docs: `https://your-app.up.railway.app/docs`
