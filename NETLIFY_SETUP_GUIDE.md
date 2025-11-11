# Netlify Deployment Setup Guide

## Step 1: Connect GitHub Repository to Netlify

### 1.1 Login to Netlify
1. Go to https://app.netlify.com
2. Sign in with your GitHub account (or create account)

### 1.2 Create New Site
1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Authorize Netlify to access your GitHub account
4. Select your repository: **`Devansh-g1/CryptoGig`**

### 1.3 Configure Build Settings

**Base directory:** `frontend`

**Build command:** `npm run build`

**Publish directory:** `frontend/build`

**Branch to deploy:** `main`

## Step 2: Environment Variables

Go to **Site settings** → **Environment variables** → **Add a variable**

Add these variables:

### Required Variables:

```
VITE_BACKEND_URL=https://clientarbitrator-production.up.railway.app/api
```

### Optional Variables (for Web3 features):

```
VITE_WALLETCONNECT_PROJECT_ID=2f05a7cde2bb14b478f07c00594118b1
VITE_USDC_ADDRESS=0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582
VITE_CONTRACT_ADDRESS=<your-deployed-contract-address>
```

### Optional Variables (for OAuth):

```
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
VITE_GITHUB_CLIENT_ID=<your-github-client-id>
```

## Step 3: Deploy Settings

### Build Settings (already configured in netlify.toml):
- ✅ Build command: `npm run build`
- ✅ Publish directory: `build`
- ✅ Redirects configured for SPA routing

### Deploy Triggers:
- ✅ Auto-deploy on push to `main` branch
- ✅ Deploy previews for pull requests (optional)

## Step 4: Verify Deployment

### 4.1 Trigger First Deploy
1. After connecting, Netlify will automatically start building
2. Watch the deploy log for any errors
3. Build should take 2-3 minutes

### 4.2 Check Deploy Status
1. Go to **Deploys** tab
2. Wait for status to show **"Published"** (green)
3. Click on the deploy to see logs if there are issues

### 4.3 Get Your Site URL
1. Your site will be at: `https://[random-name].netlify.app`
2. You can customize this in **Site settings** → **Domain management**
3. Current site: `https://cryptogig-platform.netlify.app`

## Step 5: Update Backend CORS

After getting your Netlify URL, update Railway environment variables:

1. Go to Railway dashboard
2. Select your backend service
3. Add/update environment variable:
   ```
   CORS_ORIGINS=https://cryptogig-platform.netlify.app,http://localhost:5173
   FRONTEND_URL=https://cryptogig-platform.netlify.app
   ```

## Troubleshooting

### Build Fails
**Check:**
- Node version (should be 18 or higher)
- Environment variables are set correctly
- Build logs for specific errors

**Fix:**
Add to netlify.toml:
```toml
[build.environment]
  NODE_VERSION = "18"
```

### Site Shows Old Code
**Fix:**
1. Clear Netlify cache: **Deploys** → **Trigger deploy** → **Clear cache and deploy**
2. Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### API Calls Fail (CORS errors)
**Fix:**
1. Verify `VITE_BACKEND_URL` is set correctly in Netlify
2. Verify Railway has your Netlify URL in `CORS_ORIGINS`
3. Check browser console for exact error

### Environment Variables Not Working
**Important:** 
- Vite uses `VITE_` prefix (not `REACT_APP_`)
- After changing env vars, you must **redeploy** (not just rebuild)
- Go to **Deploys** → **Trigger deploy** → **Deploy site**

## Current Configuration

Your `frontend/netlify.toml` is already configured with:

```toml
[build]
  publish = "build"
  command = "npm run build"

[build.environment]
  REACT_APP_BACKEND_URL = "https://cryptogig-production.up.railway.app"
  REACT_APP_WALLETCONNECT_PROJECT_ID = "2f05a7cde2bb14b478f07c00594118b1"
  REACT_APP_USDC_ADDRESS = "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Note:** If you're using Vite (not Create React App), change `REACT_APP_` to `VITE_` in netlify.toml

## Quick Commands

### Trigger Manual Deploy
```bash
# Install Netlify CLI (optional)
npm install -g netlify-cli

# Login
netlify login

# Link to your site
netlify link

# Deploy manually
netlify deploy --prod
```

## Post-Deployment Checklist

- [ ] Site is accessible at Netlify URL
- [ ] Can register/login
- [ ] Can create jobs (client)
- [ ] Can browse jobs (freelancer)
- [ ] Can join communities
- [ ] **Can see members sidebar in communities** ← NEW!
- [ ] No CORS errors in console
- [ ] All API calls work

## Support

If you encounter issues:
1. Check Netlify deploy logs
2. Check browser console (F12)
3. Verify environment variables
4. Check Railway backend logs
5. Verify CORS settings on backend

## Auto-Deploy Status

✅ **Enabled** - Pushes to `main` branch will auto-deploy
✅ **Build from source** - Netlify builds fresh code on each deploy
✅ **SPA routing** - Redirects configured for React Router

---

**Your site:** https://cryptogig-platform.netlify.app
**Backend:** https://clientarbitrator-production.up.railway.app
**GitHub:** https://github.com/Devansh-g1/CryptoGig
