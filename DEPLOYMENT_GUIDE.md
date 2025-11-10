# CryptoGig Deployment Guide

## Prerequisites
1. MongoDB Atlas account and cluster
2. Railway account
3. Vercel account
4. SendGrid account (for email)
5. WalletConnect project ID

## Step 1: Setup MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/atlas
   - Sign up for a free account
   - Create a new cluster (choose the free tier)

2. **Configure Database Access**
   - Go to Database Access → Add New Database User
   - Create user: `cryptogig` with a strong password
   - Give it "Read and write to any database" permissions

3. **Configure Network Access**
   - Go to Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)

4. **Get Connection String**
   - Go to Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `cryptogig_db`

## Step 2: Deploy Backend to Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy Backend**
   ```bash
   cd backend
   railway login
   railway project new cryptogig-backend
   ```

3. **Set Environment Variables in Railway Dashboard**
   - `MONGO_URL`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string (generate with `openssl rand -base64 32`)
   - `POLYGON_AMOY_RPC`: `https://rpc-amoy.polygon.technology`
   - `ARBITRATOR_WALLET`: `0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483`
   - `CORS_ORIGINS`: `https://your-vercel-app.vercel.app`
   - `FRONTEND_URL`: `https://your-vercel-app.vercel.app`
   - `FROM_EMAIL`: `noreply@cryptogig.com`
   - `SENDGRID_API_KEY`: Your SendGrid API key
   - `CONTRACT_ADDRESS`: (Set after deploying smart contracts)

4. **Deploy**
   ```bash
   railway up
   ```

5. **Note your Railway URL** (e.g., `https://cryptogig-backend-production.up.railway.app`)

## Step 3: Deploy Frontend to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   vercel login
   vercel --prod
   ```

3. **Set Environment Variables in Vercel Dashboard**
   - `REACT_APP_BACKEND_URL`: Your Railway backend URL
   - `REACT_APP_WALLETCONNECT_PROJECT_ID`: Your WalletConnect project ID
   - `REACT_APP_CONTRACT_ADDRESS`: (Set after deploying smart contracts)
   - `REACT_APP_USDC_ADDRESS`: `0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582`
   - `REACT_APP_GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `REACT_APP_GITHUB_CLIENT_ID`: Your GitHub OAuth client ID

## Step 4: Deploy Smart Contracts

1. **Setup Polygon Amoy Testnet**
   - Add Polygon Amoy to MetaMask
   - Get test MATIC from faucet: https://faucet.polygon.technology/

2. **Deploy Contracts**
   ```bash
   cd contracts
   npm install
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network amoy
   ```

3. **Update Environment Variables**
   - Copy the deployed contract address
   - Update `CONTRACT_ADDRESS` in both Railway and Vercel

## Step 5: Configure OAuth (Optional)

1. **Google OAuth**
   - Go to Google Cloud Console
   - Create OAuth 2.0 credentials
   - Add your Vercel domain to authorized origins

2. **GitHub OAuth**
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Create new OAuth app
   - Set authorization callback URL to your Vercel domain

## Step 6: Test Deployment

1. **Backend Health Check**
   ```bash
   curl https://your-railway-app.railway.app/api/health
   ```

2. **Frontend Access**
   - Visit your Vercel URL
   - Test user registration and login
   - Test wallet connection

## Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Ensure `CORS_ORIGINS` in Railway includes your Vercel URL
   - Check that both URLs use HTTPS

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check network access settings in Atlas
   - Ensure database user has correct permissions

3. **Environment Variables**
   - Double-check all environment variables are set correctly
   - Restart services after updating variables

4. **Build Failures**
   - Check build logs in Railway/Vercel dashboards
   - Ensure all dependencies are listed in requirements.txt/package.json

### Useful Commands:

```bash
# Check Railway logs
railway logs

# Check Vercel logs
vercel logs

# Redeploy Railway
railway up --detach

# Redeploy Vercel
vercel --prod
```

## Security Notes

1. Never commit `.env` files to version control
2. Use strong, unique passwords for all services
3. Regularly rotate API keys and secrets
4. Enable 2FA on all accounts
5. Monitor deployment logs for suspicious activity

## Support

If you encounter issues:
1. Check the logs in Railway/Vercel dashboards
2. Verify all environment variables are set
3. Test database connectivity
4. Check CORS configuration