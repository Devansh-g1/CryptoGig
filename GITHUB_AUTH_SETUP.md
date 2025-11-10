# 🔐 GitHub OAuth Setup Guide

## Quick Setup (3 minutes)

### Step 1: Create GitHub OAuth App

1. **Go to GitHub Developer Settings**
   - Visit: https://github.com/settings/developers
   - Or: GitHub → Settings → Developer settings → OAuth Apps

2. **Create New OAuth App**
   - Click "New OAuth App"
   - Fill in:
     - **Application name**: CryptoGig
     - **Homepage URL**: http://localhost:3000 (for dev) or https://your-domain.com
     - **Authorization callback URL**: http://localhost:3000 (same as homepage)
   - Click "Register application"

3. **Get Credentials**
   - You'll see **Client ID** (looks like: `Ov23liVq8C5LAByfRDQs`)
   - Click "Generate a new client secret"
   - **Copy both Client ID and Client Secret immediately** (secret shown only once!)

### Step 2: Add Credentials to Your App

#### Backend (.env)
Edit `/app/backend/.env`:
```bash
GITHUB_CLIENT_ID=Ov23liVq8C5LAByfRDQs
GITHUB_CLIENT_SECRET=your_client_secret_here
```

#### Frontend (.env)
Edit `/app/frontend/.env`:
```bash
REACT_APP_GITHUB_CLIENT_ID=Ov23liVq8C5LAByfRDQs
```

⚠️ **Important**: 
- Client ID goes in BOTH files
- Client Secret goes ONLY in backend (keep it secret!)

### Step 3: Restart Services
```bash
sudo supervisorctl restart backend frontend
```

### Step 4: Test It!

1. Go to http://localhost:3000
2. Click "Get Started"
3. Click "Continue with GitHub" button
4. Authorize the app
5. ✅ You should be logged in!

## Features

When user signs in with GitHub:
- ✅ Auto-fills name from GitHub profile
- ✅ Auto-fills email
- ✅ **Auto-fills GitHub link in profile**
- ✅ Auto-fills bio if available
- ✅ Auto-fills portfolio link if in GitHub profile

Perfect for freelancers!

## Troubleshooting

### Error: "Bad verification code"
- Client ID or Secret might be wrong
- Check both .env files
- Restart services

### Error: "Redirect URI mismatch"
- Make sure callback URL in GitHub matches your domain exactly
- For dev: http://localhost:3000
- For prod: https://your-domain.com
- No trailing slash!

### GitHub button not working
- Check browser console for errors
- Verify REACT_APP_GITHUB_CLIENT_ID is set
- Clear browser cache and try again

### Private email?
- GitHub might not share your email
- Go to GitHub Settings → Emails
- Uncheck "Keep my email addresses private"
- Or add a public email

## Security Notes

✅ **Safe to commit**: Client ID (public, goes in frontend)
❌ **Never commit**: Client Secret (private, backend only!)

Add to `.gitignore`:
```
*.env
.env
.env.*
```

## For Production

When deploying:
1. Create new OAuth App in GitHub (or update existing)
2. Set Homepage URL: https://your-production-domain.com
3. Set Callback URL: https://your-production-domain.com
4. Update both .env files with production domain
5. Deploy!

## Multiple Environments

You can create separate OAuth apps for:
- Development (localhost:3000)
- Staging (staging.your-domain.com)
- Production (your-domain.com)

Each gets its own Client ID/Secret pair.

---

**Both Google AND GitHub OAuth enabled!** Users can choose their preferred sign-in method.
