# 🚀 CryptoGig Platform - Quick Reference Guide

## 🌐 URLs

| Service | URL |
|---------|-----|
| **Frontend** | https://cryptogig-platform.netlify.app |
| **Admin Portal** | https://cryptogig-platform.netlify.app/admin |
| **Backend** | https://clientarbitrator-production.up.railway.app |
| **GitHub** | https://github.com/Devansh-g1/CryptoGig.git |

## 🔐 Admin Access

- **Email**: devanshgoyal1234@gmail.com
- **Wallet**: 0x6a413e4c59cfb5d4544d5eca74dacf7848b3a483

## 🎯 Key Features

### 1. Network Configuration
- **Network**: Sepolia Testnet
- **Chain ID**: 11155111
- **Auto-switch**: Yes
- **Warning**: Shows if wrong network

### 2. Admin Portal (`/admin`)
- View all users
- Assign arbitrators
- Remove arbitrator roles
- Search by email/wallet

### 3. Arbitrator Dashboard
- View disputed jobs
- Interactive fund distribution sliders
- Real-time USDC calculations
- Quick presets (Full Refund, 50/50, Full Payment)
- 8% arbitrator fee for disputes
- 5% arbitrator fee for normal releases

### 4. Swap to USDC
- Swap ETH to USDC before funding
- Uniswap V2 integration
- Real-time price estimation
- 5% slippage protection
- MAX button for convenience

### 5. Job Funding
- Fund with USDC directly
- Or swap ETH to USDC first
- Platform fee: 5% (8% if disputed)
- Escrow contract protection

## 📋 User Flows

### Create & Fund Job (Client)
```
1. Login → Client Dashboard
2. Click "Create Job"
3. Fill details (title, description, budget)
4. Click "Create Job"
5. Click "Fund Job" on created job
6. Choose:
   a. "Fund with USDC" (if you have USDC)
   b. "Swap ETH to USDC First" (if you need USDC)
7. Approve transactions
8. Job activated
```

### Resolve Dispute (Arbitrator)
```
1. Login → Arbitrator Dashboard
2. Go to "Disputes" tab
3. Review dispute details
4. Click "Resolve Dispute"
5. Adjust distribution sliders
6. See real-time amounts
7. Write resolution notes
8. Click "Confirm Resolution"
9. Funds distributed automatically
```

### Assign Arbitrator (Admin)
```
1. Login → Admin Portal (/admin)
2. Click "Assign Arbitrator"
3. Search for user
4. Click on user to assign
5. User role updated to arbitrator
```

## 🧪 Testing

### Get Test Tokens
- **Sepolia ETH**: https://sepoliafaucet.com
- **Sepolia USDC**: https://faucet.circle.com

### Test Accounts
Create test accounts with different roles:
- Client account
- Freelancer account
- Arbitrator account (assign via admin portal)

## 💰 Fee Structure

| Action | Fee | Recipient |
|--------|-----|-----------|
| Normal Job Release | 5% | Arbitrator |
| Disputed Job Resolution | 8% | Arbitrator |
| Job Creation | Free | - |
| Wallet Connection | Free | - |

## 🔧 Smart Contract Addresses (Sepolia)

| Contract | Address |
|----------|---------|
| **USDC** | 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238 |
| **WETH** | 0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9 |
| **Uniswap Router** | 0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008 |
| **Escrow** | (Set in .env) |

## 📱 Dashboard Features by Role

### Client Dashboard
- ✅ Create jobs
- ✅ Fund jobs (USDC or swap from ETH)
- ✅ View job status
- ✅ Raise disputes
- ✅ Switch roles

### Freelancer Dashboard
- ✅ Browse available jobs
- ✅ Apply to jobs
- ✅ Submit work
- ✅ View earnings
- ✅ Switch roles

### Arbitrator Dashboard
- ✅ View all jobs
- ✅ Release funds for completed jobs
- ✅ Resolve disputes
- ✅ Adjust fund distribution
- ✅ Earn arbitration fees

### Admin Dashboard
- ✅ View all users
- ✅ Assign arbitrators
- ✅ Remove arbitrators
- ✅ Search users
- ✅ Platform management

## 🚨 Troubleshooting

### Wallet Not Connecting
1. Install MetaMask or Rainbow wallet
2. Switch to Sepolia network
3. Refresh page
4. Try connecting again

### Wrong Network
1. Wallet will auto-switch to Sepolia
2. If not, manually switch in wallet
3. Refresh page

### Insufficient USDC
1. Get test USDC from faucet
2. Or use "Swap ETH to USDC" feature
3. Ensure you have ETH for gas

### Swap Failed
1. Check ETH balance (need for gas)
2. Verify Sepolia network
3. Try smaller amount
4. Check slippage tolerance

### Job Not Funding
1. Ensure wallet connected
2. Check USDC balance
3. Approve USDC spending
4. Verify escrow contract address

## 📚 Documentation Files

| File | Description |
|------|-------------|
| `ARBITRATOR_AND_SWAP_FEATURES.md` | Detailed feature guide |
| `FINAL_DEPLOYMENT_STATUS.md` | Deployment overview |
| `RAILWAY_SETUP_GUIDE.md` | Backend setup |
| `DEPLOYMENT_SUMMARY.md` | Technical changes |
| `QUICK_REFERENCE.md` | This file |

## 🔄 Deployment Commands

### Frontend (Netlify)
```bash
cd frontend
npm run build
netlify deploy --prod --dir=build
```

### Backend (Railway)
```bash
# Configure via Railway dashboard
# Or push to GitHub (auto-deploys)
git push origin main
```

### Full Deployment
```bash
./deploy-all.sh
```

## 🎨 UI Color Scheme

| Element | Color |
|---------|-------|
| Client amounts | Cyan (#22d3ee) |
| Freelancer amounts | Green (#10b981) |
| Arbitrator fees | Purple (#a855f7) |
| Disputes | Red (#ef4444) |
| Success | Green (#10b981) |
| Warning | Amber (#f59e0b) |

## 📊 Status Badges

| Status | Badge Color | Meaning |
|--------|-------------|---------|
| `pending_payment` | Yellow | Awaiting funding |
| `created` | Blue | Open for applications |
| `in_progress` | Indigo | Work in progress |
| `completed` | Green | Awaiting release |
| `disputed` | Red | Under dispute |
| `resolved` | Green | Dispute resolved |

## 🎯 Quick Actions

### As Client
- Create job: Dashboard → "Create Job"
- Fund job: Job card → "Fund Job"
- Raise dispute: Job card → "Raise Dispute"

### As Arbitrator
- Release funds: "Pending Releases" tab → "Release Funds"
- Resolve dispute: "Disputes" tab → "Resolve Dispute"

### As Admin
- Assign arbitrator: Admin Portal → "Assign Arbitrator"
- Remove arbitrator: Admin Portal → User card → "Remove"

## 🔗 Important Links

- **Sepolia Faucet**: https://sepoliafaucet.com
- **USDC Faucet**: https://faucet.circle.com
- **Sepolia Explorer**: https://sepolia.etherscan.io
- **Uniswap Docs**: https://docs.uniswap.org

## ✅ Checklist for New Users

- [ ] Install MetaMask or Rainbow wallet
- [ ] Get Sepolia ETH from faucet
- [ ] Get Sepolia USDC from faucet
- [ ] Connect wallet to platform
- [ ] Verify Sepolia network
- [ ] Create account
- [ ] Test creating a job
- [ ] Test funding with swap
- [ ] Explore all dashboards

---

**Need Help?** Check the detailed documentation files or contact the admin.

**Platform Status**: ✅ Live and Operational
**Last Updated**: November 14, 2025
