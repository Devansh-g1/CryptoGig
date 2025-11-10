# CryptoGig Smart Contract Deployment

## Prerequisites

1. **Get a wallet private key:**
   - Create a MetaMask wallet or use existing one
   - Export your private key (Settings → Security & Privacy → Show private key)
   - ⚠️ NEVER share this key or commit it to git!

2. **Get testnet tokens:**
   - Go to [Polygon Faucet](https://faucet.polygon.technology/)
   - Select "Amoy Testnet"
   - Enter your wallet address
   - Get free MATIC for gas fees

3. **Get API key (optional, for verification):**
   - Go to [PolygonScan](https://polygonscan.com/)
   - Create account and get API key

## Setup

1. **Install dependencies:**
```bash
cd /app/contracts
npm install
```

2. **Configure environment:**
Create `.env` file in `/app` directory:
```
DEPLOYER_PRIVATE_KEY=your_private_key_here
POLYGONSCAN_API_KEY=your_api_key_here
```

3. **Compile contracts:**
```bash
npm run compile
```

4. **Deploy to testnet:**
```bash
# Deploy to Polygon Amoy testnet
npm run deploy:amoy
```

5. **Save contract address:**
After deployment, copy the contract address and add to `/app/backend/.env`:
```
CONTRACT_ADDRESS=0x...
```

## Contract Features

- ✅ Multi-token support (any ERC20)
- ✅ Auto-conversion to USDC via Uniswap V3
- ✅ Gas-optimized operations
- ✅ 5% normal fee, 8% dispute fee
- ✅ Arbitrator-controlled fund releases
- ✅ Dispute resolution with custom splits
- ✅ ReentrancyGuard protection

## Important Addresses (Polygon Amoy)

- **Uniswap V3 Router:** 0xE592427A0AEce92De3Edee1F18E0157C05861564
- **USDC Token:** 0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582
- **RPC URL:** https://rpc-amoy.polygon.technology
- **Chain ID:** 80002

## Testing

To test the contract locally:
```bash
npm test
```

## Security Notes

- Contract uses OpenZeppelin's audited contracts
- ReentrancyGuard prevents reentrancy attacks
- Only arbitrator can release funds
- All token transfers are checked
