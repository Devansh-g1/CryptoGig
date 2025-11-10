# 🚀 CryptoGig Mainnet Deployment Guide

## Prerequisites

Before deploying to mainnet, you'll need:

### 1. Wallet with MATIC (for gas fees)
- Create or use existing MetaMask wallet
- Buy MATIC tokens (minimum 50 MATIC recommended for deployment + operations)
- Send MATIC to your deployer wallet address

### 2. API Keys & Credentials

#### A. PolygonScan API Key (for contract verification)
1. Go to: https://polygonscan.com/
2. Sign up / Login
3. Go to API Keys section
4. Create new API key
5. Copy the key

#### B. WalletConnect Project ID (already provided)
- Current ID: `47d0c26f19b4e0c21713990e7a8e5f62`
- Or create your own at: https://cloud.walletconnect.com/

#### C. Google OAuth Client ID (for Google Sign-In)
1. Go to: https://console.cloud.google.com/
2. Create new project or select existing
3. Go to "APIs & Services" → "Credentials"
4. Create OAuth 2.0 Client ID
5. Add authorized origins:
   - https://your-domain.com
   - http://localhost:3000 (for development)
6. Copy Client ID

### 3. Export Your Private Key

**⚠️ CRITICAL: Never share or commit your private key!**

From MetaMask:
1. Click on account menu
2. Account Details
3. Show Private Key
4. Enter password
5. Copy private key (starts with 0x...)

## Step-by-Step Deployment

### Phase 1: Deploy Smart Contract

1. **Set Environment Variables**

Edit `/app/backend/.env`:
```bash
# Your deployer wallet private key
DEPLOYER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE

# PolygonScan API key for verification
POLYGONSCAN_API_KEY=YOUR_POLYGONSCAN_API_KEY

# Mainnet RPC (keep as is)
POLYGON_RPC=https://polygon-rpc.com

# Contract address (will be filled after deployment)
CONTRACT_ADDRESS=
```

2. **Update Contract Configuration**

Edit `/app/contracts/hardhat.config.js`:
```javascript
networks: {
  polygon: {
    url: process.env.POLYGON_RPC || \"https://polygon-rpc.com\",
    accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    chainId: 137,
  },
},
```

3. **Update Deployment Script**

Edit `/app/contracts/scripts/deploy.js` - Change addresses to mainnet:
```javascript
// Polygon Mainnet addresses
const SWAP_ROUTER = \"0xE592427A0AEce92De3Edee1F18E0157C05861564\"; // Uniswap V3
const USDC = \"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174\"; // USDC Mainnet
```

4. **Deploy Contract**
```bash
cd /app/contracts
npm install
npm run compile
npx hardhat run scripts/deploy.js --network polygon
```

5. **Save Contract Address**

After deployment, copy the address shown and add to `/app/backend/.env`:
```bash
CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
```

6. **Restart Backend**
```bash
sudo supervisorctl restart backend
```

### Phase 2: Configure Frontend

1. **Update Environment**

Edit `/app/frontend/.env`:
```bash
# Your production domain
REACT_APP_BACKEND_URL=https://your-api-domain.com

# Google OAuth Client ID
REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
```

2. **Update Wagmi Config**

File already updated to use Polygon mainnet in `/app/frontend/src/config/wagmi.js`

3. **Build Frontend**
```bash
cd /app/frontend
yarn build
```

### Phase 3: Database & Backend

1. **MongoDB Production Setup**

Option A: MongoDB Atlas (recommended)
```bash
# Get connection string from https://cloud.mongodb.com/
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
```

Option B: Self-hosted MongoDB
```bash
# Use your MongoDB server URL
MONGO_URL=mongodb://your-server:27017/
```

2. **Update Backend .env**
```bash
MONGO_URL=YOUR_PRODUCTION_MONGO_URL
DB_NAME=cryptogig_production
JWT_SECRET=GENERATE_RANDOM_SECRET_HERE
CORS_ORIGINS=https://your-frontend-domain.com
```

3. **Generate Strong JWT Secret**
```bash
openssl rand -hex 32
# Copy output to JWT_SECRET
```

### Phase 4: Deployment Checklist

- [ ] Smart contract deployed to Polygon mainnet
- [ ] Contract verified on PolygonScan
- [ ] Contract address added to backend .env
- [ ] MongoDB production database configured
- [ ] JWT_SECRET changed to strong random value
- [ ] Google OAuth configured with production domain
- [ ] Frontend built with production env variables
- [ ] CORS configured for production domain
- [ ] SSL certificate configured (HTTPS)
- [ ] Backup strategy in place

## Security Best Practices

### 1. Environment Variables
```bash
# NEVER commit these files:
/app/backend/.env
/app/frontend/.env
/app/contracts/.env

# Add to .gitignore
echo \".env\" >> .gitignore
echo \"*.env\" >> .gitignore
```

### 2. Private Key Security
- Store private key in secure vault (e.g., AWS Secrets Manager, Azure Key Vault)
- Use separate wallets for deployment vs operations
- Never log or print private keys
- Rotate keys periodically

### 3. API Keys
- Restrict PolygonScan API key to your IP
- Set rate limits on backend API
- Use environment-specific keys

### 4. Smart Contract
- Get contract audited before mainnet (optional but recommended)
- Test thoroughly on testnet first
- Start with small amounts
- Monitor contract events

## Testing Before Mainnet

### 1. Testnet Testing
```bash
# Test on Polygon Amoy first
npx hardhat run scripts/deploy.js --network polygonAmoy

# Run through complete workflow:
# - Create job
# - Accept job
# - Complete job
# - Raise dispute
# - Resolve dispute
```

### 2. Security Checks
- [ ] All private keys secured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] CORS properly configured
- [ ] SQL injection prevention (using parameterized queries)
- [ ] XSS prevention (React handles this)

## Cost Estimates

### Deployment Costs (one-time)
- Contract deployment: ~10-30 MATIC
- Contract verification: Free
- **Total: ~$5-15 USD** (depending on gas prices)

### Operational Costs (ongoing)
- Job creation: ~0.5-2 MATIC per transaction
- Fund release: ~0.3-1 MATIC per transaction
- Database: $0-57/month (MongoDB Atlas free to M10)
- **Est. per transaction: $0.25-1 USD**

## Monitoring

### 1. Smart Contract Events
Monitor on PolygonScan:
- https://polygonscan.com/address/YOUR_CONTRACT_ADDRESS#events

### 2. Backend Logs
```bash
tail -f /var/log/supervisor/backend.*.log
```

### 3. Database
- Set up MongoDB Atlas alerts
- Monitor connection pool
- Track query performance

## Rollback Plan

If issues arise:

1. **Contract Issues**
   - Cannot rollback deployed contract
   - Deploy new version with fixes
   - Update CONTRACT_ADDRESS in backend

2. **Backend Issues**
   - Revert code changes
   - Restart services
   ```bash
   git revert HEAD
   sudo supervisorctl restart backend
   ```

3. **Database Issues**
   - Restore from backup
   - Check MongoDB Atlas backup settings

## Post-Deployment

### 1. Verify Everything Works
- [ ] MetaMask connects successfully
- [ ] Can create account with Google
- [ ] Can create account with email
- [ ] Jobs can be created
- [ ] Freelancer profiles visible
- [ ] Communities can be created/joined
- [ ] Messages sent in channels
- [ ] Wallet transactions work
- [ ] Arbitrator functions work

### 2. Set Initial Arbitrator
```bash
curl -X POST https://your-api.com/api/admin/arbitrator \
  -H \"Content-Type: application/json\" \
  -H \"Authorization: Bearer YOUR_TOKEN\" \
  -d '{\"user_id\": \"YOUR_USER_ID\"}'
```

### 3. Monitor First Week
- Watch transaction costs
- Monitor error rates
- Check user feedback
- Track gas prices

## Getting Help

### Issues During Deployment

**Contract Deployment Fails:**
- Check you have enough MATIC
- Verify RPC URL is working
- Check gas price settings

**MetaMask Not Connecting:**
- Verify WalletConnect Project ID
- Check network is Polygon (137)
- Clear browser cache

**Google Auth Not Working:**
- Verify Client ID is correct
- Check authorized origins match domain
- Test in incognito mode

### Support Resources

- Polygon Docs: https://docs.polygon.technology/
- Hardhat Docs: https://hardhat.org/docs
- RainbowKit Docs: https://rainbowkit.com/docs

## Summary

**What You Need to Provide:**
1. ✅ Wallet private key (for deployment)
2. ✅ PolygonScan API key (for verification)  
3. ✅ Google OAuth Client ID (for social login)
4. ✅ Production MongoDB URL (optional, can use Atlas free tier)
5. ✅ Domain for CORS (your frontend URL)

**Estimated Time:** 2-4 hours
**Estimated Cost:** $5-15 USD (one-time) + $0.25-1 per transaction

---

Ready to deploy? Follow the steps above and let me know if you need help with any specific part!
