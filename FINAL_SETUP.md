# Final Setup - Sepolia Testnet

## ✅ What's Deployed:

1. **Smart Contract (Sepolia):**
   - Address: `0x8A808f52b19F07C53981b4f43f84E80972F468C7`
   - Network: Sepolia Testnet (Chain ID: 11155111)
   - View: https://sepolia.etherscan.io/address/0x8A808f52b19F07C53981b4f43f84E80972F468C7

2. **Frontend (Netlify):**
   - URL: https://cryptogig-platform.netlify.app
   - Wallet: Rainbow only
   - Network: Sepolia

3. **Backend (Railway):**
   - URL: https://clientarbitrator-production.up.railway.app

## 🔧 REQUIRED: Update Railway

**Go to Railway Dashboard and update this environment variable:**

```
CONTRACT_ADDRESS=0x8A808f52b19F07C53981b4f43f84E80972F468C7
```

**Steps:**
1. Go to https://railway.app
2. Select your backend service
3. Go to Variables tab
4. Update `CONTRACT_ADDRESS`
5. Service will auto-redeploy

## 🧪 Testing the Platform:

### 1. Setup MetaMask/Rainbow for Sepolia

**Add Sepolia Network:**
- Network Name: Sepolia
- RPC URL: https://ethereum-sepolia-rpc.publicnode.com
- Chain ID: 11155111
- Currency: ETH
- Explorer: https://sepolia.etherscan.io

### 2. Get Test Tokens

**Sepolia ETH** (for gas):
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia

**Test USDC** (for payments):
- https://faucet.circle.com/
- Request to your wallet address

### 3. Test Job Flow

**As Client:**
1. Connect Rainbow wallet
2. Switch to Sepolia network
3. Create a job
4. Approve USDC spending
5. Transfer funds to escrow

**As Freelancer:**
1. Browse available jobs
2. Accept a job
3. Complete the work
4. Mark as completed

**As Arbitrator:**
1. Review completed jobs
2. Release funds to freelancer

## 🐛 Troubleshooting:

### "CORS Error"
- Make sure Railway has the correct `CORS_ORIGINS` set
- Should include: `https://cryptogig-platform.netlify.app`

### "Wrong Network"
- Switch MetaMask/Rainbow to Sepolia
- Chain ID should be 11155111

### "Insufficient Funds"
- Get Sepolia ETH from faucets
- Get test USDC from Circle faucet

### "Transaction Failed"
- Make sure you have enough ETH for gas
- Approve USDC spending first
- Check contract on Etherscan for errors

## 📋 Current Configuration:

**Frontend (.env):**
```
VITE_BACKEND_URL=https://clientarbitrator-production.up.railway.app
VITE_CONTRACT_ADDRESS=0x8A808f52b19F07C53981b4f43f84E80972F468C7
VITE_USDC_ADDRESS=0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
VITE_CHAIN_ID=11155111
```

**Backend (Railway - NEEDS UPDATE):**
```
CONTRACT_ADDRESS=0x8A808f52b19F07C53981b4f43f84E80972F468C7  ← UPDATE THIS!
CORS_ORIGINS=https://cryptogig-platform.netlify.app,http://localhost:5173
```

## 🎯 Next Steps:

1. ✅ Update Railway `CONTRACT_ADDRESS`
2. ✅ Get test USDC from Circle faucet
3. ✅ Connect Rainbow wallet to Sepolia
4. ✅ Test creating a job
5. ✅ Test the full escrow flow

---

**Everything is ready! Just update Railway and you can start testing!** 🚀
