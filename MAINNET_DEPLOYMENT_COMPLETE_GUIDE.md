# CryptoGig Mainnet Deployment Guide

## Overview
This guide will help you deploy CryptoGig to Polygon Mainnet with real cryptocurrency payments.

## Prerequisites
- Node.js 18+ and yarn
- Hardhat for smart contract deployment
- Polygon (MATIC) for gas fees
- Verified accounts on required services

---

## Part 1: Smart Contract Deployment to Polygon Mainnet

### Step 1: Install Hardhat and Dependencies

```bash
cd /app
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts
npx hardhat
```

Choose "Create a JavaScript project" when prompted.

### Step 2: Configure Hardhat for Polygon Mainnet

Create `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    polygonMainnet: {
      url: "https://polygon-rpc.com", // Or use Alchemy/Infura
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
      chainId: 137
    },
    polygonAmoy: {
      url: "https://rpc-amoy.polygon.technology",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
      chainId: 80002
    }
  },
  etherscan: {
    apiKey: {
      polygon: process.env.POLYGONSCAN_API_KEY
    }
  }
};
```

### Step 3: Update Environment Variables

Add to `/app/backend/.env`:

```bash
# Deployment Keys
DEPLOYER_PRIVATE_KEY="your_wallet_private_key_here"
POLYGONSCAN_API_KEY="your_polygonscan_api_key"

# Contract Addresses (after deployment)
CONTRACT_ADDRESS="deployed_contract_address"
USDC_TOKEN_ADDRESS="0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" # USDC on Polygon Mainnet
POLYGON_MAINNET_RPC="https://polygon-rpc.com"
```

**⚠️ SECURITY WARNING:**
- Never commit your private key to version control
- Use a dedicated deployment wallet
- Fund it with only necessary MATIC for gas

### Step 4: Deploy Smart Contract

```bash
cd /app
npx hardhat run scripts/deploy.js --network polygonMainnet
```

After deployment, you'll get the contract address. Update `CONTRACT_ADDRESS` in `.env`.

### Step 5: Verify Contract on Polygonscan

```bash
npx hardhat verify --network polygonMainnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

---

## Part 2: Frontend Configuration for Mainnet

### Step 1: Update Wagmi Config

Edit `/app/frontend/src/config/wagmi.js`:

```javascript
import { http } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

export const wagmiConfig = getDefaultConfig({
  appName: 'CryptoGig',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Get from https://cloud.walletconnect.com
  chains: [polygon], // Mainnet only
  transports: {
    [polygon.id]: http('https://polygon-rpc.com'), // Use Alchemy/Infura for production
  },
  ssr: false,
});
```

### Step 2: Get WalletConnect Project ID

1. Go to https://cloud.walletconnect.com
2. Create a new project
3. Copy the Project ID
4. Update it in `wagmi.js`

---

## Part 3: Backend API Configuration

### Step 1: Update Backend to Use Mainnet

Edit `/app/backend/server.py`:

```python
# Web3 setup for Mainnet
CONTRACT_ADDRESS = os.environ.get('CONTRACT_ADDRESS')  # Your deployed contract
POLYGON_RPC = os.environ.get('POLYGON_MAINNET_RPC', 'https://polygon-rpc.com')
USDC_ADDRESS = os.environ.get('USDC_TOKEN_ADDRESS', '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359')

w3 = Web3(Web3.HTTPProvider(POLYGON_RPC))

# Load contract ABI
with open('contracts/CryptoGigEscrow.json', 'r') as f:
    contract_abi = json.load(f)['abi']

escrow_contract = w3.eth.contract(
    address=Web3.to_checksum_address(CONTRACT_ADDRESS),
    abi=contract_abi
)
```

---

## Part 4: Email Service Configuration

### Option A: SendGrid (Recommended)

1. Sign up at https://sendgrid.com
2. Create an API key
3. Add to `/app/backend/.env`:

```bash
SENDGRID_API_KEY="your_sendgrid_api_key"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
```

4. Install library:

```bash
pip install sendgrid
```

5. Update `send_verification_email` in `server.py`:

```python
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

async def send_verification_email(email: str, token: str):
    verification_link = f"{os.environ.get('FRONTEND_URL')}/verify?token={token}"
    
    message = Mail(
        from_email=os.environ['SENDGRID_FROM_EMAIL'],
        to_emails=email,
        subject='Verify your CryptoGig account',
        html_content=f'''
        <h2>Welcome to CryptoGig!</h2>
        <p>Click the link below to verify your email:</p>
        <a href="{verification_link}">Verify Email</a>
        <p>This link expires in 24 hours.</p>
        '''
    )
    
    try:
        sg = SendGridAPIClient(os.environ['SENDGRID_API_KEY'])
        response = sg.send(message)
        return True
    except Exception as e:
        logging.error(f"Email send failed: {e}")
        return False
```

### Option B: AWS SES

Similar setup with `boto3` library.

---

## Part 5: How Crypto Payments Work

### For Clients (Creating Jobs):

1. **Create Job on Platform**
   - Fill job details (title, description, budget in USDC)
   - Submit creates database record

2. **Fund Job via Smart Contract**
   ```javascript
   // Frontend code
   import { useWriteContract } from 'wagmi';
   
   const { writeContract } = useWriteContract();
   
   // Client approves USDC spending
   await writeContract({
     address: USDC_ADDRESS,
     abi: ERC20_ABI,
     functionName: 'approve',
     args: [CONTRACT_ADDRESS, amountInUSDC]
   });
   
   // Client funds the job
   await writeContract({
     address: CONTRACT_ADDRESS,
     abi: ESCROW_ABI,
     functionName: 'fundJob',
     args: [jobId, amountInUSDC]
   });
   ```

3. **Funds Locked in Escrow**
   - USDC transferred to smart contract
   - Job marked as "funded" in database

### For Freelancers (Completing Work):

1. **Accept Job**
   - Click "Accept" on available job
   - Transaction records freelancer assignment

2. **Complete Work**
   - Submit work for review
   - Client reviews and approves

3. **Release Payment**
   ```javascript
   // Client releases payment
   await writeContract({
     address: CONTRACT_ADDRESS,
     abi: ESCROW_ABI,
     functionName: 'releasePayment',
     args: [jobId]
   });
   ```

4. **Freelancer Receives USDC**
   - Smart contract transfers USDC to freelancer's wallet
   - Arbitrator receives 5% fee automatically
   - Freelancer can withdraw or swap to other tokens

### For Arbitrator (Dispute Resolution):

1. **Dispute Raised**
   - Either party can raise dispute
   - Smart contract locks funds

2. **Arbitrator Reviews**
   - Reviews evidence from both parties
   - Decides split percentage (e.g., 70% client, 30% freelancer)

3. **Resolve Dispute**
   ```javascript
   // Only arbitrator can call
   await writeContract({
     address: CONTRACT_ADDRESS,
     abi: ESCROW_ABI,
     functionName: 'resolveDispute',
     args: [jobId, clientPercentage, freelancerPercentage]
   });
   ```

4. **Funds Distributed**
   - Smart contract splits USDC according to decision
   - Arbitrator receives additional 3% dispute fee (total 8%)

---

## Part 6: Testing on Polygon Amoy Testnet First

**Before mainnet deployment, test everything on Amoy testnet:**

1. Get testnet MATIC from faucet: https://faucet.polygon.technology
2. Get testnet USDC from Aave faucet
3. Deploy contract to Amoy first
4. Test all flows:
   - Job creation and funding
   - Payment release
   - Dispute resolution
   - Wallet connections

---

## Part 7: Frontend Deployment

### Deploy to Vercel/Netlify:

1. **Build the frontend:**
   ```bash
   cd /app/frontend
   yarn build
   ```

2. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Environment Variables on Vercel:**
   - `REACT_APP_BACKEND_URL`: Your backend API URL
   - `REACT_APP_CONTRACT_ADDRESS`: Deployed contract address
   - `REACT_APP_WALLETCONNECT_PROJECT_ID`: WalletConnect project ID

---

## Part 8: Backend Deployment

### Deploy to Railway/Render:

1. **Prepare backend:**
   ```bash
   cd /app/backend
   pip freeze > requirements.txt
   ```

2. **Create Procfile:**
   ```
   web: uvicorn server:app --host 0.0.0.0 --port $PORT
   ```

3. **Deploy and set environment variables:**
   - All variables from `.env`
   - MongoDB connection string (MongoDB Atlas)

---

## Security Checklist

- [ ] Private keys stored securely (never in code)
- [ ] Smart contract audited (recommended: CertiK, OpenZeppelin)
- [ ] Rate limiting on API endpoints
- [ ] CORS configured properly
- [ ] SSL/TLS certificates for HTTPS
- [ ] Email verification working
- [ ] Wallet signature verification for sensitive operations
- [ ] Database backups configured
- [ ] Error logging and monitoring (Sentry)

---

## Cost Estimates (Polygon Mainnet)

- **Smart Contract Deployment**: ~5-10 MATIC ($3-6)
- **Transaction Gas Fees**: ~0.01-0.1 MATIC per transaction ($0.006-$0.06)
- **MongoDB Atlas**: $0-9/month (shared cluster free)
- **SendGrid Email**: Free tier (100 emails/day)
- **Hosting**: $0-20/month (Vercel free, Railway $5-20)

**Total Monthly Cost**: $5-30 for small scale operations

---

## Monitoring and Maintenance

1. **Transaction Monitoring**
   - Use Polygonscan API to track contract interactions
   - Set up webhooks for payment notifications

2. **Error Tracking**
   - Integrate Sentry for backend errors
   - Monitor smart contract events

3. **User Support**
   - Help users with wallet connection issues
   - Guide through transaction confirmations
   - Explain gas fees

---

## Common Issues and Solutions

### Issue: "Insufficient funds for gas"
**Solution**: User needs MATIC for gas fees on Polygon

### Issue: "Transaction failed"
**Solution**: Check if USDC approval was done before funding job

### Issue: "Wallet not connecting"
**Solution**: Ensure user has MetaMask/compatible wallet installed

---

## Support Resources

- Polygon Documentation: https://docs.polygon.technology
- RainbowKit Docs: https://rainbowkit.com
- Hardhat Docs: https://hardhat.org
- Wagmi Docs: https://wagmi.sh

---

## Mainnet Checklist

- [ ] Smart contract deployed and verified
- [ ] Frontend configured for mainnet
- [ ] Backend connected to mainnet RPC
- [ ] Email service configured
- [ ] All environment variables set
- [ ] Tested on testnet thoroughly
- [ ] Security audit completed (if budget allows)
- [ ] User documentation prepared
- [ ] Support system ready
- [ ] Monitoring tools active

---

**Once deployed, update these addresses in your environment:**

```bash
# Polygon Mainnet
CONTRACT_ADDRESS="0x..." # Your deployed escrow contract
USDC_TOKEN_ADDRESS="0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" # USDC on Polygon
POLYGON_MAINNET_RPC="https://polygon-rpc.com" # Or Alchemy/Infura
```

**Your CryptoGig platform will be live with real cryptocurrency payments! 🚀**
