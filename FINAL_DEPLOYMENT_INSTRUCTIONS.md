# 🚀 CryptoGig Final Deployment Instructions

## Current Status ✅

**Backend (Railway)**: Deployed at `https://cryptogig-production.up.railway.app`
**Frontend (Vercel)**: Build ready, needs manual deployment
**Issues Fixed**: CORS, health endpoints, environment configuration

## 🔧 What You Need to Do

### Step 1: Set Up MongoDB Atlas (REQUIRED)

1. **Go to MongoDB Atlas**: https://www.mongodb.com/atlas
2. **Create a free account** and cluster
3. **Create database user**:
   - Username: `cryptogig`
   - Password: Choose a strong password (save it!)
4. **Network Access**: Allow access from anywhere (0.0.0.0/0)
5. **Get connection string**:
   - Go to Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `cryptogig_db`

### Step 2: Update Railway Backend

```bash
cd backend
railway variables --set "MONGO_URL=mongodb+srv://cryptogig:YOUR_ACTUAL_PASSWORD@cluster0.XXXXX.mongodb.net/cryptogig_db?retryWrites=true&w=majority"
```

Replace `YOUR_ACTUAL_PASSWORD` and `XXXXX` with your actual values.

### Step 3: Deploy Frontend to Vercel Manually

Since the automatic deployment has npm install issues, use the Vercel dashboard:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Import Project**: Connect your GitHub repo or upload the `frontend` folder
3. **Set Environment Variables**:
   ```
   REACT_APP_BACKEND_URL=https://cryptogig-production.up.railway.app
   REACT_APP_WALLETCONNECT_PROJECT_ID=2f05a7cde2bb14b478f07c00594118b1
   REACT_APP_USDC_ADDRESS=0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582
   ```
4. **Deploy**: Click deploy

### Step 4: Update CORS Settings

After getting your Vercel URL, update Railway:

```bash
railway variables --set "CORS_ORIGINS=https://your-vercel-url.vercel.app,http://localhost:3000"
railway variables --set "FRONTEND_URL=https://your-vercel-url.vercel.app"
```

## 🧪 Testing Your Deployment

### Test Backend Health
```bash
curl https://cryptogig-production.up.railway.app/api/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "database": "connected",
  "service": "cryptogig-backend"
}
```

### Test Frontend
1. Visit your Vercel URL
2. Try registering a new user
3. Test wallet connection
4. Check browser console for errors

## 🔑 Environment Variables Reference

### Railway (Backend)
```
MONGO_URL=mongodb+srv://cryptogig:password@cluster0.xxxxx.mongodb.net/cryptogig_db?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DB_NAME=cryptogig_db
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
ARBITRATOR_WALLET=0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483
CORS_ORIGINS=https://your-vercel-url.vercel.app,http://localhost:3000
FRONTEND_URL=https://your-vercel-url.vercel.app
FROM_EMAIL=noreply@cryptogig.com
```

### Vercel (Frontend)
```
REACT_APP_BACKEND_URL=https://cryptogig-production.up.railway.app
REACT_APP_WALLETCONNECT_PROJECT_ID=2f05a7cde2bb14b478f07c00594118b1
REACT_APP_CONTRACT_ADDRESS=(set after deploying smart contracts)
REACT_APP_USDC_ADDRESS=0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582
```

## 📋 Optional Enhancements

### Email Functionality (SendGrid)
1. Create SendGrid account
2. Get API key
3. Set in Railway: `railway variables --set "SENDGRID_API_KEY=your_key"`

### Smart Contracts
1. Deploy contracts to Polygon Amoy testnet
2. Update `CONTRACT_ADDRESS` in both Railway and Vercel

### OAuth (Google/GitHub)
1. Set up OAuth apps
2. Add client IDs to environment variables

## 🚨 Troubleshooting

### Backend Issues
- **500 errors**: Check Railway logs with `railway logs`
- **Database connection**: Verify MongoDB Atlas connection string
- **CORS errors**: Ensure frontend URL is in CORS_ORIGINS

### Frontend Issues
- **Build failures**: Check Vercel build logs
- **API errors**: Verify REACT_APP_BACKEND_URL is correct
- **Wallet issues**: Check WalletConnect project ID

## 📞 Support Commands

```bash
# Check Railway status
railway status

# View Railway logs
railway logs

# List Railway variables
railway variables

# Check Vercel deployments
vercel ls

# View Vercel logs
vercel logs your-deployment-url
```

## 🎉 Success Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Railway backend deployed and healthy
- [ ] Vercel frontend deployed and accessible
- [ ] CORS configured correctly
- [ ] User registration/login works
- [ ] Wallet connection works
- [ ] No console errors in browser

---

**Your deployment URLs:**
- Backend: https://cryptogig-production.up.railway.app
- Frontend: (will be provided after Vercel deployment)

**Next Steps:** Set up MongoDB Atlas and update the MONGO_URL, then test the complete deployment!