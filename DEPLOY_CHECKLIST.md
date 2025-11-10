# ✅ Deployment Checklist

## Current Status

- ✅ **Frontend**: https://cryptogig-platform.netlify.app (Deployed)
- ⚠️  **Backend**: https://cryptogig-production.up.railway.app (Using in-memory storage)
- ✅ **MongoDB**: Connected locally, needs Railway update

## What You Need to Do

### 1. Update Railway Backend (5 minutes)

**Go to Railway Dashboard:**
1. Open: https://railway.app
2. Find your **cryptogig-production** project
3. Click on the backend service
4. Click **"Variables"** tab

**Add These Environment Variables:**

```
MONGO_URL
mongodb+srv://CryptoUser:Devansh%401234@cluster0.go4i2sx.mongodb.net/cryptogig_db?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true

DB_NAME
cryptogig_db

JWT_SECRET
your-super-secret-jwt-key-change-this-make-it-very-long-and-random

CORS_ORIGINS
https://cryptogig-platform.netlify.app,http://localhost:3000

FRONTEND_URL
https://cryptogig-platform.netlify.app
```

**Save and Wait:**
- Railway will automatically redeploy (2-3 minutes)
- Check logs for any errors

### 2. Verify Backend is Connected

Test the backend:
```bash
curl https://cryptogig-production.up.railway.app/api/health
```

Should show:
```json
{
  "status": "healthy",
  "database": "connected"  ← Should say "connected"
}
```

### 3. Update Frontend (If Needed)

If you made changes to frontend code:

```bash
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

Or manually:
1. Go to: https://app.netlify.com
2. Find your site: cryptogig-platform
3. Drag and drop the `frontend/dist` folder

### 4. Test Production Site

Open: https://cryptogig-platform.netlify.app

Test these features:
- [ ] Register a new user (should work immediately, no email verification)
- [ ] Login with credentials
- [ ] Create a job (as Client)
- [ ] Switch to Freelancer role
- [ ] Browse jobs
- [ ] Create a community channel
- [ ] Send a message
- [ ] Refresh page - data should persist
- [ ] Logout and login again - data still there

## Quick Commands

### Test Backend Health
```bash
curl https://cryptogig-production.up.railway.app/api/health
```

### Test Registration
```bash
curl -X POST https://cryptogig-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User","role":"client"}'
```

### Build and Deploy Frontend
```bash
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

## What Should Work After Update

✅ User registration (no email verification)
✅ Instant login
✅ Job creation and management
✅ Community channels and messaging
✅ Role switching (Client ↔ Freelancer)
✅ Data persistence (survives page refresh)
✅ No unexpected logouts
✅ All data saved to MongoDB

## If Something Doesn't Work

### Backend Issues
1. Check Railway logs: https://railway.app
2. Verify MongoDB connection string
3. Check MongoDB Atlas IP whitelist (should include 0.0.0.0/0)

### Frontend Issues
1. Check browser console (F12)
2. Verify VITE_BACKEND_URL in Netlify environment variables
3. Check Network tab for failed API calls

### Database Issues
1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Check Network Access (should allow all IPs)
3. Check Database Access (user CryptoUser should exist)
4. Verify cluster is active (not paused)

## Priority Actions

**Do This First:**
1. ⚠️  Update Railway environment variables with MongoDB connection
2. ⚠️  Wait for Railway to redeploy
3. ✅ Test backend health endpoint
4. ✅ Test frontend registration

**Then:**
5. Test all features on production site
6. Verify data persists after refresh
7. Create test users and jobs

## Your Production URLs

- **Frontend**: https://cryptogig-platform.netlify.app
- **Backend**: https://cryptogig-production.up.railway.app
- **API Docs**: https://cryptogig-production.up.railway.app/docs
- **MongoDB**: https://cloud.mongodb.com

## Success Criteria

When everything is working:
- ✅ Backend health shows "database": "connected"
- ✅ Can register users on production site
- ✅ Can create jobs that persist
- ✅ Can create channels that persist
- ✅ Messages save and persist
- ✅ No "in_memory" in health check
- ✅ No data loss on page refresh

## Estimated Time

- Update Railway variables: 2 minutes
- Wait for redeploy: 2-3 minutes
- Test production site: 5 minutes
- **Total: ~10 minutes**

## Start Here

👉 **Go to: https://railway.app**
👉 **Update environment variables**
👉 **Wait for redeploy**
👉 **Test: https://cryptogig-platform.netlify.app**

That's it! Your production site will be fully functional with MongoDB! 🚀
