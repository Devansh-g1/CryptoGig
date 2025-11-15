# 💧 Holesky Testnet Faucets - Quick Reference

## 🌟 Best Faucets (Ranked by Amount)

### 1. PoW Faucet ⭐ RECOMMENDED
- **URL**: https://holesky-faucet.pk910.de
- **Amount**: Up to 10 ETH
- **Method**: Browser-based mining (Proof of Work)
- **Cooldown**: None (mine as much as you want)
- **Pros**: 
  - Highest amount available
  - No account required
  - No cooldown period
  - Very reliable
- **How to use**:
  1. Visit the website
  2. Enter your wallet address
  3. Start mining in browser
  4. Wait for mining to complete
  5. Claim your ETH

### 2. QuickNode Faucet
- **URL**: https://faucet.quicknode.com/ethereum/holesky
- **Amount**: 0.1 ETH
- **Method**: Social verification (Twitter/GitHub)
- **Cooldown**: 24 hours
- **Pros**: Fast and reliable

### 3. Alchemy Faucet
- **URL**: https://www.alchemy.com/faucets/ethereum-holesky
- **Amount**: 0.5 ETH
- **Method**: Account required
- **Cooldown**: 24 hours
- **Pros**: Good amount, trusted provider

### 4. Chainstack Faucet
- **URL**: https://faucet.chainstack.com/holesky-faucet
- **Amount**: 0.05 ETH
- **Method**: Email verification
- **Cooldown**: 24 hours
- **Pros**: Simple and quick

### 5. LearnWeb3 Faucet
- **URL**: https://learnweb3.io/faucets/holesky
- **Amount**: 0.1 ETH
- **Method**: Account required
- **Cooldown**: 24 hours

### 6. Automata Faucet
- **URL**: https://faucet.holesky.ethpandaops.io
- **Amount**: 0.05 ETH
- **Method**: Direct request
- **Cooldown**: 24 hours

## 🎯 Quick Start Guide

### For Developers (Need lots of ETH)
1. **Use PoW Faucet first** - Get 5-10 ETH
2. **Backup with QuickNode** - Get additional 0.1 ETH
3. **Use Alchemy** - Get 0.5 ETH more

**Total**: ~5-10 ETH (enough for extensive testing)

### For Quick Testing (Need small amount)
1. **QuickNode** - Fast, 0.1 ETH
2. **Chainstack** - Quick, 0.05 ETH

**Total**: 0.15 ETH (enough for basic testing)

## 💰 USDC Faucets for Holesky

### Option 1: Deploy Your Own Mock USDC
```bash
cd contracts
npx hardhat run scripts/deploy-mock-usdc.js --network holesky
```

### Option 2: Use Existing Mock USDC
- **Address**: 0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8
- **Method**: Mint function available
- **Call**: `mint(yourAddress, amount)`

### Option 3: Circle Faucet (if available)
- **URL**: https://faucet.circle.com
- Check if Holesky is supported

## 🔧 How to Add Holesky to Your Wallet

### MetaMask / Rainbow Wallet
1. Open wallet
2. Click network dropdown
3. Click "Add Network"
4. Enter details:
   - **Network Name**: Holesky Testnet
   - **RPC URL**: https://ethereum-holesky-rpc.publicnode.com
   - **Chain ID**: 17000
   - **Currency Symbol**: ETH
   - **Block Explorer**: https://holesky.etherscan.io

### Or Use Our Platform
1. Visit: https://cryptogig-platform.netlify.app
2. Click "Connect Wallet"
3. Platform will auto-add Holesky network

## 📊 Faucet Comparison

| Faucet | Amount | Speed | Reliability | Account Required |
|--------|--------|-------|-------------|------------------|
| PoW Faucet | 10 ETH | Slow (mining) | ⭐⭐⭐⭐⭐ | No |
| Alchemy | 0.5 ETH | Fast | ⭐⭐⭐⭐ | Yes |
| QuickNode | 0.1 ETH | Fast | ⭐⭐⭐⭐⭐ | Yes (Social) |
| Chainstack | 0.05 ETH | Fast | ⭐⭐⭐⭐ | Yes (Email) |
| LearnWeb3 | 0.1 ETH | Medium | ⭐⭐⭐ | Yes |
| Automata | 0.05 ETH | Fast | ⭐⭐⭐ | No |

## 🎮 Gaming the System (Ethical Tips)

### Maximize Your ETH
1. **Start with PoW Faucet** - Mine overnight for max ETH
2. **Use multiple faucets** - Each has different cooldowns
3. **Create multiple test wallets** - Use different addresses
4. **Time your requests** - Some faucets reset at specific times

### Pro Tips
- PoW Faucet: Leave it running overnight
- Social faucets: Use different social accounts
- Email faucets: Use email aliases (gmail+test@gmail.com)
- Share with team: Pool resources if working in a team

## 🚨 Troubleshooting

### Faucet Not Working
1. **Check cooldown period** - Wait 24 hours
2. **Try different browser** - Some faucets have issues with certain browsers
3. **Disable ad blockers** - May interfere with faucet
4. **Use VPN** - Some faucets are region-restricted
5. **Try another faucet** - Always have backups

### Not Receiving ETH
1. **Check transaction on explorer**: https://holesky.etherscan.io
2. **Wait 5-10 minutes** - Network can be slow
3. **Verify wallet address** - Make sure it's correct
4. **Check network** - Ensure you're on Holesky

### PoW Faucet Mining Slow
1. **Use desktop browser** - Mobile is slower
2. **Close other tabs** - Free up CPU
3. **Use Chrome/Brave** - Better performance
4. **Let it run longer** - Mining takes time

## 📱 Mobile Faucets

Most faucets work on mobile, but PoW Faucet is best on desktop due to mining requirements.

**Best for Mobile**:
1. QuickNode
2. Chainstack
3. Automata

## 🔗 Additional Resources

### Holesky Network Info
- **Explorer**: https://holesky.etherscan.io
- **Status**: https://holesky.beaconcha.in
- **Docs**: https://github.com/eth-clients/holesky

### Community
- **Discord**: Ethereum R&D Discord
- **Telegram**: Ethereum Testnet groups
- **Reddit**: r/ethdev

### Faucet Aggregators
- **FaucetLink**: https://faucetlink.to/holesky
- **All Faucets**: https://www.allthatnode.com/faucet/ethereum.dsrv

## 💡 Best Practices

### For Development
1. **Get 5-10 ETH initially** - Use PoW faucet
2. **Keep 1-2 ETH reserve** - Don't spend everything
3. **Monitor balance** - Refill before running out
4. **Use multiple wallets** - Separate dev/test/demo

### For Testing
1. **Start with 0.5 ETH** - Enough for basic tests
2. **Test on testnet first** - Before mainnet
3. **Document gas costs** - Track spending
4. **Share with team** - Pool resources

## 🎯 Quick Commands

### Check Balance
```bash
# Using cast (Foundry)
cast balance <YOUR_ADDRESS> --rpc-url https://ethereum-holesky-rpc.publicnode.com

# Using ethers.js
npx hardhat console --network holesky
> (await ethers.provider.getBalance("YOUR_ADDRESS")).toString()
```

### Send Test ETH
```bash
cast send <TO_ADDRESS> --value 0.1ether --rpc-url https://ethereum-holesky-rpc.publicnode.com --private-key <YOUR_KEY>
```

## ✅ Checklist

Before starting development:
- [ ] Add Holesky network to wallet
- [ ] Get 5-10 ETH from PoW faucet
- [ ] Get additional ETH from 2-3 other faucets
- [ ] Deploy or get mock USDC
- [ ] Test transaction (send 0.001 ETH to yourself)
- [ ] Verify on explorer
- [ ] Save faucet links for future use

## 🎉 You're Ready!

With Holesky testnet, you have:
- ✅ Abundant test ETH
- ✅ Multiple reliable faucets
- ✅ Stable network
- ✅ Active community

**Happy testing!** 🚀
