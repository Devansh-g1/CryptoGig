# 🔐 Google OAuth Setup Guide

## Quick Setup (5 minutes)

### Step 1: Get Google OAuth Client ID

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create Project** (if you don't have one)
   - Click "Select a project" → "New Project"
   - Name it "CryptoGig" or anything you like
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Select "External" → "Create"
   - Fill in:
     - App name: CryptoGig
     - User support email: your email
     - Developer contact: your email
   - Click "Save and Continue"
   - Skip "Scopes" → "Save and Continue"
   - Skip "Test users" → "Save and Continue"

5. **Create OAuth Client ID**
   - Go to "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "CryptoGig Web Client"
   
   **Authorized JavaScript origins:**
   - http://localhost:3000
   - https://your-production-domain.com
   
   **Authorized redirect URIs:**
   - http://localhost:3000
   - https://your-production-domain.com
   
   - Click "Create"
   - **Copy the Client ID** (it looks like: `123456789-abc123.apps.googleusercontent.com`)

### Step 2: Add Client ID to Your App

#### Backend (.env)
Edit `/app/backend/.env`:
```bash
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

#### Frontend (.env)
Edit `/app/frontend/.env`:
```bash
REACT_APP_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

### Step 3: Restart Services
```bash
sudo supervisorctl restart backend frontend
```

### Step 4: Test It!

1. Go to http://localhost:3000
2. Click "Get Started"
3. Click "Sign in with Google" button
4. Select your Google account
5. ✅ You should be logged in!

## Troubleshooting

### Error: "Invalid Client ID"
- Make sure Client ID matches in both `.env` files
- Make sure there are no extra spaces
- Restart services after changing .env

### Error: "Unauthorized origin"
- Add your domain to "Authorized JavaScript origins"
- For development: http://localhost:3000
- For production: https://your-domain.com

### Error: "redirect_uri_mismatch"
- Add your domain to "Authorized redirect URIs"
- Must match exactly (http vs https, trailing slash, etc.)

### Google button not showing
- Check browser console for errors
- Make sure REACT_APP_GOOGLE_CLIENT_ID is set
- Try clearing browser cache

## Security Notes

✅ **Safe to commit**: The Client ID is public (frontend needs it)
❌ **Never commit**: Client Secret (not used in this app)

## What This Enables

Once setup:
- Users can sign up with Google (no password needed)
- Existing users can login with Google
- Profile info (name, email) auto-filled
- Faster onboarding, better UX

## For Production

When deploying to production:
1. Go back to Google Cloud Console
2. Add your production domain to:
   - Authorized JavaScript origins: `https://your-domain.com`
   - Authorized redirect URIs: `https://your-domain.com`
3. Update both `.env` files with production domain
4. Deploy!

---

**Need help?** The setup takes ~5 minutes. If you get stuck, let me know which step!
