# 🔄 Migration from Sepolia to Holesky Testnet

## Why Holesky?

Holesky testnet offers several advantages over Sepolia:
- ✅ **Better Faucet Availability** - Multiple reliable faucets
- ✅ **More Test ETH** - Easier to get larger amounts
- ✅ **Active Community** - Better support and resources
- ✅ **Stable Network** - More reliable for testing
- ✅ **Longer Chain History** - Better for testing complex scenarios

## 🌐 Network Details

### Holesky Testnet
- **Chain ID**: 17000 (0x4268 in hex)
- **RPC URL**: https://ethereum-holesky-rpc.publicnode.com
- **Explorer**: https://holesky.etherscan.io
- **Currency**: ETH (testnet)

### Comparison
| Feature | Sepolia | Holesky |
|---------|---------|---------|
| Chain ID | 11155111 | 17000 |
| Faucet Availability | Limited | Excellent |
| Test ETH Amount | Small | Generous |
| Network Stability | Good | Excellent |

## ✅ Changes Made

### 1. Environment Files Updated

#### `frontend/.env`
```env
VITE_CHAIN_ID=17000  # Changed from 11155111
VITE_USDC_ADDRESS=0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8  # Holesky USDC
```

#### `.env` (root)
```env
HOLESKY_RPC=https://ethereum-holesky-rpc.publicnode.com  # Changed from SEPOLIA_RPC
```

### 2. Frontend Configuration

#### `frontend/src/config/wagmi.js`
- Changed from `sepolia` to `holesky` chain
- Updated RPC URL to Holesky
- Chain ID: 17000

#### `frontend/src/components/SimpleWalletConnect.jsx`
- Updated chain ID check: `0x4268` (Holesky)
- Updated network name: "Holesky Testnet"
- Updated RPC and explorer URLs

#### `frontend/src/components/SwapToUSDC.jsx`
- Updated USDC address for Holesky
- Updated WETH address for Holesky
- Updated network display text

#### `frontend/src/hooks/useFundJob.js`
- Updated USDC address to Holesky

### 3. Smart Contract Configuration

#### `contracts/hardhat.config.js`
- Added Holesky network configuration
- Chain ID: 17000
- RPC URL: https://ethereum-holesky-rpc.publicnode.com

#### `contracts/deploy-holesky.js`
- New deployment script for Holesky
- Includes balance checks
- Provides faucet links

## 🚀 Deployment Steps

### Step 1: Get Holesky ETH

Get test ETH from these faucets:

1. **PoW Faucet** (Recommended - Most generous)
   - URL: https://holesky-faucet.pk910.de
   - Amount: Up to 10 ETH
   - Method: Mine for ETH (browser-based)

2. **QuickNode Faucet**
   - URL: https://faucet.quicknode.com/ethereum/holesky
   - Amount: 0.1 ETH
   - Method: Social verification

3. **Alchemy Faucet**
   - URL: https://www.alchemy.com/faucets/ethereum-holesky
   - Amount: 0.5 ETH
   - Method: Account required

4. **Chainstack Faucet**
   - URL: https://faucet.chainstack.com/holesky-faucet
   - Amount: 0.05 ETH
   - Method: Email verification

### Step 2: Deploy Contracts

```bash
cd contracts

# Install dependencies (if not already)
npm install

# Deploy to Holesky
npx hardhat run deploy-holesky.js --network holesky
```

Expected output:
```
🚀 Deploying CryptoGig Escrow to Holesky Testnet...
📝 Deploying with account: 0x...
💰 Account balance: 1.5 ETH
🛡️  Arbitrator address: 0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483
💵 USDC address: 0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8

✅ Deployment successful!
📋 Contract Details:
   Escrow Address: 0x...
   Network: Holesky Testnet (Chain ID: 17000)
```

### Step 3: Update Environment Variables

Update the contract address in your `.env` files:

```bash
# frontend/.env
VITE_CONTRACT_ADDRESS=<new_escrow_address>

# backend/.env
CONTRACT_ADDRESS=<new_escrow_address>
```

### Step 4: Deploy Frontend

```bash
cd frontend
npm run build
netlify deploy --prod --dir=build
```

### Step 5: Deploy Backend

```bash
# Push to GitHub (Railway auto-deploys)
git add -A
git commit -m "Migrate to Holesky testnet"
git push origin main
```

## 🧪 Testing

### 1. Test Network Connection

1. Visit: https://cryptogig-platform.netlify.app
2. Connect wallet
3. Should auto-switch to Holesky
4. Verify chain ID: 17000

### 2. Test Token Faucets

Get test USDC:
- **Circle Faucet**: https://faucet.circle.com (if available for Holesky)
- **Or deploy your own mock USDC** (see below)

### 3. Test Complete Flow

1. Create job as client
2. Fund job (with swap if needed)
3. Accept job as freelancer
4. Complete work
5. Release funds as arbitrator

## 💰 Mock USDC Deployment (Optional)

If you need to deploy your own mock USDC on Holesky:

```solidity
// MockUSDC.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {
        _mint(msg.sender, 1000000 * 10**6); // 1M USDC
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
```

Deploy:
```bash
npx hardhat run scripts/deploy-mock-usdc.js --network holesky
```

## 🔍 Verification

### Verify Contracts on Etherscan

```bash
npx hardhat verify --network holesky <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

Example:
```bash
npx hardhat verify --network holesky 0x... 0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8 0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483
```

## 📊 Network Comparison

### Transaction Costs
| Action | Sepolia | Holesky |
|--------|---------|---------|
| Deploy Contract | ~0.01 ETH | ~0.01 ETH |
| Fund Job | ~0.001 ETH | ~0.001 ETH |
| Swap Tokens | ~0.002 ETH | ~0.002 ETH |

### Faucet Availability
| Faucet | Sepolia | Holesky |
|--------|---------|---------|
| Amount per Request | 0.05-0.5 ETH | 0.1-10 ETH |
| Frequency | 24h cooldown | Varies |
| Reliability | Medium | High |

## 🛠️ Troubleshooting

### Issue: Wallet won't switch to Holesky
**Solution**: Manually add Holesky network in wallet:
- Network Name: Holesky Testnet
- RPC URL: https://ethereum-holesky-rpc.publicnode.com
- Chain ID: 17000
- Currency Symbol: ETH
- Block Explorer: https://holesky.etherscan.io

### Issue: Can't get test ETH
**Solution**: Try multiple faucets:
1. PoW Faucet (most reliable): https://holesky-faucet.pk910.de
2. QuickNode: https://faucet.quicknode.com/ethereum/holesky
3. Ask in Discord/Telegram communities

### Issue: USDC not available
**Solution**: 
1. Deploy your own mock USDC (see above)
2. Or use the provided mock USDC address
3. Mint tokens to your address

### Issue: Swap not working
**Solution**:
1. Ensure Uniswap is deployed on Holesky
2. Or disable swap feature temporarily
3. Use direct USDC funding only

## 📝 Checklist

- [ ] Get Holesky ETH from faucets
- [ ] Deploy escrow contract to Holesky
- [ ] Update frontend/.env with new contract address
- [ ] Update backend/.env with new contract address
- [ ] Deploy frontend to Netlify
- [ ] Deploy backend to Railway
- [ ] Test wallet connection
- [ ] Test job creation
- [ ] Test funding flow
- [ ] Test dispute resolution
- [ ] Update documentation

## 🎯 Benefits After Migration

1. **Easier Testing**: More test ETH available
2. **Better Reliability**: Stable network
3. **Faster Development**: Less time waiting for faucets
4. **Community Support**: Active Holesky community
5. **Future-Proof**: Holesky is the recommended testnet

## 📚 Resources

### Holesky Resources
- **Official Docs**: https://github.com/eth-clients/holesky
- **Faucets List**: https://faucetlink.to/holesky
- **Explorer**: https://holesky.etherscan.io
- **Status**: https://holesky.beaconcha.in

### Development Tools
- **Hardhat**: https://hardhat.org/hardhat-runner/docs/guides/deploying
- **Ethers.js**: https://docs.ethers.org/v6/
- **Wagmi**: https://wagmi.sh/react/chains

## 🚀 Quick Start After Migration

```bash
# 1. Get test ETH
Visit: https://holesky-faucet.pk910.de

# 2. Deploy contracts
cd contracts
npx hardhat run deploy-holesky.js --network holesky

# 3. Update .env files with new addresses

# 4. Deploy frontend
cd frontend
npm run build
netlify deploy --prod --dir=build

# 5. Test the platform
Visit: https://cryptogig-platform.netlify.app
```

## ✅ Migration Complete!

Your platform is now running on Holesky testnet with:
- ✅ Better faucet availability
- ✅ More test tokens
- ✅ Stable network
- ✅ Active community support

**All features remain the same, just on a better testnet!**
