# 🚀 Update Railway Deployment with MongoDB

## Current Issue

Your Railway backend is using **in-memory storage** instead of MongoDB.
This means data is lost when the server restarts.

## Fix: Update Railway Environment Variables

### Step 1: Go to Railway Dashboard

1. Open: https://railway.app
2. Login with your account
3. Find your **cryptogig-production** project
4. Click on the backend service

### Step 2: Update Environment Variables

Click on **"Variables"** tab and add/update these:

```env
MONGO_URL=mongodb+srv://CryptoUser:Devansh%401234@cluster0.go4i2sx.mongodb.net/cryptogig_db?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true

DB_NAME=cryptogig_db

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-very-long-and-random-at-least-64-characters

JWT_ALGORITHM=HS256

POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology

ARBITRATOR_WALLET=0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483

CORS_ORIGINS=https://cryptogig-platform.netlify.app,http://localhost:3000

FRONTEND_URL=https://cryptogig-platform.netlify.app
```

**Important Notes:**
- The `MONGO_URL` includes `%40` which is the URL-encoded `@` symbol
- Generate a strong `JWT_SECRET` (random 64+ character string)
- `CORS_ORIGINS` includes your Netlify URL

### Step 3: Redeploy Backend

After updating variables:
1. Railway will automatically redeploy
2. Wait 2-3 minutes for deployment
3. Check logs for any errors

### Step 4: Verify MongoDB Connection

Test the backend:
```bash
curl https://cryptogig-production.up.railway.app/api/health
```

Should return:
```json
{
  "status": "healthy",
  "database": "connected",  // ← Should say "connected" not "in_memory"
  "service": "cryptogig-backend"
}
```

## Alternative: Push Updated Code

If you want to push the latest code changes:

### Step 1: Commit Changes
```bash
git add .
git commit -m "Update backend with MongoDB and fixes"
git push
```

### Step 2: Railway Auto-Deploys
Railway will automatically detect the push and redeploy.

### Step 3: Check Deployment
1. Go to Railway dashboard
2. Click on your service
3. Check "Deployments" tab
4. View logs for any errors

## What Gets Fixed

Once MongoDB is connected:

✅ **Data Persistence** - Users, jobs, channels persist
✅ **No Data Loss** - Data survives server restarts
✅ **Registration Works** - Users can register and login
✅ **Jobs Persist** - Created jobs are saved
✅ **Channels Persist** - Community channels are saved
✅ **Messages Persist** - Chat messages are saved

## Test After Update

### 1. Test Backend Health
```bash
curl https://cryptogig-production.up.railway.app/api/health
```

### 2. Test Registration
```bash
curl -X POST https://cryptogig-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User",
    "role": "client"
  }'
```

Should return a token immediately.

### 3. Test Frontend
1. Open: https://cryptogig-platform.netlify.app
2. Register a new user
3. Create a job
4. Refresh page
5. Job should still be there

## MongoDB Atlas Settings

Make sure in MongoDB Atlas:

1. **Network Access**
   - Go to: https://cloud.mongodb.com
   - Click "Network Access"
   - Ensure `0.0.0.0/0` is in IP Access List
   - This allows Railway to connect

2. **Database User**
   - Click "Database Access"
   - Verify user `CryptoUser` exists
   - Password: `Devansh@1234`

## Troubleshooting

### Backend still shows "in_memory"
- Check Railway logs for MongoDB connection errors
- Verify MONGO_URL is correct in Railway variables
- Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Wait 2-3 minutes after updating variables

### "Authentication failed" error
- Check MongoDB password in connection string
- Verify database user exists in Atlas
- Ensure user has read/write permissions

### "Connection timeout" error
- Check MongoDB Atlas network access
- Verify cluster is active (not paused)
- Check Railway logs for detailed error

## Quick Fix Checklist

- [ ] Go to Railway dashboard
- [ ] Click on backend service
- [ ] Go to Variables tab
- [ ] Add/Update MONGO_URL with your connection string
- [ ] Add/Update other environment variables
- [ ] Wait for automatic redeploy (2-3 minutes)
- [ ] Test: `curl https://cryptogig-production.up.railway.app/api/health`
- [ ] Verify response shows `"database": "connected"`
- [ ] Test frontend at https://cryptogig-platform.netlify.app
- [ ] Register user and verify data persists

## Need the Connection String?

Your MongoDB connection string:
```
mongodb+srv://CryptoUser:Devansh%401234@cluster0.go4i2sx.mongodb.net/cryptogig_db?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true
```

Note: `%40` is the URL-encoded `@` symbol in the password.

## After Update

Once MongoDB is connected, your production app will have:
- ✅ Full data persistence
- ✅ No email verification (instant login)
- ✅ Job creation and management
- ✅ Community channels and messaging
- ✅ Role switching
- ✅ All fixes we implemented locally

Your app will be fully functional at:
**https://cryptogig-platform.netlify.app** 🚀
