# Deploy to Sepolia Testnet

## Prerequisites

1. **Get Sepolia ETH** (for gas fees):
   - https://sepoliafaucet.com/
   - https://www.alchemy.com/faucets/ethereum-sepolia
   - https://faucet.quicknode.com/ethereum/sepolia
   - You need ~0.05 ETH for deployment

2. **Get Test USDC on Sepolia**:
   - https://faucet.circle.com/
   - https://www.circle.com/en/usdc-sepolia-faucet
   - Request test USDC to your wallet

3. **Set up environment variables**:
   ```bash
   # In contracts/.env or root .env
   DEPLOYER_PRIVATE_KEY=your_private_key_here
   SEPOLIA_RPC=https://rpc.sepolia.org
   ETHERSCAN_API_KEY=your_etherscan_api_key (optional, for verification)
   ```

## Deployment Steps

### 1. Deploy Contract

```bash
cd contracts
npx hardhat run deploy-sepolia.js --network sepolia
```

### 2. Save Contract Address

The script will output the contract address. Save it!

Example output:
```
✅ Contract deployed successfully!
📍 Contract Address: 0x1234...5678
```

### 3. Update Frontend Environment

Update `frontend/.env`:
```env
VITE_CONTRACT_ADDRESS=0x1234...5678
VITE_USDC_ADDRESS=0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
VITE_CHAIN_ID=11155111
```

### 4. Update Backend Environment

In Railway dashboard, update:
```
CONTRACT_ADDRESS=0x1234...5678
```

### 5. Verify Contract (Optional)

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" "0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483"
```

### 6. Rebuild and Redeploy Frontend

```bash
cd frontend
npm run build
netlify deploy --prod --dir=build
```

## Testing the Escrow

### 1. Get Test Tokens

- **Sepolia ETH**: Use faucets above
- **Test USDC**: https://faucet.circle.com/

### 2. Test Job Flow

1. **Client**: Create a job (requires USDC approval + transfer)
2. **Freelancer**: Accept the job
3. **Freelancer**: Complete the job
4. **Arbitrator**: Release funds to freelancer

### 3. Monitor Transactions

View on Sepolia Etherscan:
```
https://sepolia.etherscan.io/address/<YOUR_CONTRACT_ADDRESS>
```

## Network Details

- **Network**: Sepolia Testnet
- **Chain ID**: 11155111
- **RPC**: https://rpc.sepolia.org
- **USDC Address**: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
- **Arbitrator**: 0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483
- **Block Explorer**: https://sepolia.etherscan.io

## Troubleshooting

### "Insufficient funds for gas"
- Get more Sepolia ETH from faucets

### "USDC transfer failed"
- Make sure you have test USDC from Circle faucet
- Approve the escrow contract to spend your USDC first

### "Contract not verified"
- Run the verify command with your Etherscan API key
- Or verify manually on Etherscan

## Useful Links

- **Sepolia Faucet**: https://sepoliafaucet.com/
- **Circle USDC Faucet**: https://faucet.circle.com/
- **Sepolia Explorer**: https://sepolia.etherscan.io
- **Alchemy Faucet**: https://www.alchemy.com/faucets/ethereum-sepolia
- **MetaMask Network**: Add Sepolia network in MetaMask

## Add Sepolia to MetaMask

1. Open MetaMask
2. Click network dropdown
3. Click "Add Network"
4. Enter:
   - Network Name: Sepolia
   - RPC URL: https://rpc.sepolia.org
   - Chain ID: 11155111
   - Currency Symbol: ETH
   - Block Explorer: https://sepolia.etherscan.io

## Next Steps After Deployment

1. ✅ Contract deployed to Sepolia
2. ✅ Frontend updated with contract address
3. ✅ Backend updated with contract address
4. ✅ Get test USDC
5. ✅ Test job creation flow
6. ✅ Test escrow payment flow
7. ✅ Test arbitration flow

---

**Ready to deploy?** Run:
```bash
cd contracts
npx hardhat run deploy-sepolia.js --network sepolia
```
