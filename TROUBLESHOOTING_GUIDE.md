# 🔧 CryptoGig Troubleshooting Guide

## 🚨 Common Issues & Solutions

### Issue 1: 401 Unauthorized Error

**Error Message**: `POST https://clientarbitrator-production.up.railway.app/api/jobs 401 (Unauthorized)`

**Cause**: You're not logged in or your session expired.

**Solution**:

#### Step 1: Check if you're logged in
1. Open browser DevTools (F12)
2. Go to Console tab
3. Type: `localStorage.getItem('token')`
4. If it returns `null`, you need to login

#### Step 2: Login or Register
1. Go to: https://cryptogig-platform.netlify.app
2. Click "Get Started" or "Login"
3. Register a new account:
   - Email: your-email@example.com
   - Password: your-password
   - Name: Your Name
   - Role: Client (to create jobs)
4. Click "Register"

#### Step 3: Verify Login
1. After login, you should see the dashboard
2. Check DevTools Console: `localStorage.getItem('token')`
3. Should return a long token string

#### Step 4: Try Creating Job Again
1. Click "Create Job"
2. Fill in details
3. Submit

**If still getting 401**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Clear localStorage: `localStorage.clear()`
3. Refresh page
4. Login again

---

### Issue 2: Testnet Not Visible in Wallet

**Problem**: Can't see Sepolia testnet in MetaMask/Rainbow wallet

**Solution**:

#### For MetaMask:

**Step 1: Enable Test Networks**
1. Open MetaMask
2. Click the network dropdown (top left)
3. Click "Show/hide test networks"
4. Toggle ON "Show test networks"
5. Sepolia should now appear in the list

**Step 2: Add Sepolia Manually (if not showing)**
1. Open MetaMask
2. Click network dropdown
3. Click "Add Network"
4. Click "Add a network manually"
5. Enter these details:
   ```
   Network Name: Sepolia Testnet
   RPC URL: https://ethereum-sepolia-rpc.publicnode.com
   Chain ID: 11155111
   Currency Symbol: ETH
   Block Explorer: https://sepolia.etherscan.io
   ```
6. Click "Save"

**Step 3: Switch to Sepolia**
1. Click network dropdown
2. Select "Sepolia Testnet"
3. You should see "Sepolia" at the top

#### For Rainbow Wallet:

**Step 1: Enable Testnets**
1. Open Rainbow Wallet
2. Go to Settings
3. Find "Developer Settings" or "Advanced"
4. Enable "Testnets"

**Step 2: Switch Network**
1. Tap network selector
2. Choose "Sepolia"

#### Auto-Add via Platform:

**Easiest Method**:
1. Go to: https://cryptogig-platform.netlify.app
2. Click "Connect Wallet"
3. Platform will automatically prompt to add Sepolia
4. Click "Approve" in wallet popup
5. Sepolia will be added and switched automatically

---

### Issue 3: No Test ETH

**Problem**: Need Sepolia ETH to test

**Solution**:

#### Best Faucets (in order):

1. **Alchemy Faucet** (0.5 ETH/day)
   - URL: https://sepoliafaucet.com
   - Steps:
     1. Visit website
     2. Enter your wallet address
     3. Complete captcha
     4. Click "Send Me ETH"
     5. Wait 1-2 minutes

2. **Infura Faucet** (0.5 ETH/day)
   - URL: https://www.infura.io/faucet/sepolia
   - Requires Infura account (free)

3. **QuickNode Faucet** (0.1 ETH)
   - URL: https://faucet.quicknode.com/ethereum/sepolia
   - Requires Twitter/GitHub verification

4. **Chainlink Faucet** (0.1 ETH)
   - URL: https://faucets.chain.link/sepolia
   - Requires GitHub verification

**Pro Tip**: Use multiple faucets to get more ETH faster!

---

### Issue 4: No Test USDC

**Problem**: Need USDC to fund jobs

**Solution**:

#### Option 1: Circle Faucet
1. Visit: https://faucet.circle.com
2. Select "Sepolia" network
3. Enter your wallet address
4. Click "Get Test USDC"
5. Wait for transaction

#### Option 2: Use Swap Feature
1. Get Sepolia ETH first (see above)
2. Create a job on platform
3. Click "Fund Job"
4. Click "Swap ETH to USDC First"
5. Enter ETH amount
6. Confirm swap
7. You'll have USDC!

---

### Issue 5: Wallet Won't Connect

**Problem**: Can't connect wallet to platform

**Solutions**:

#### Check 1: Wallet Installed
- MetaMask: https://metamask.io/download/
- Rainbow: https://rainbow.me/

#### Check 2: Correct Network
1. Make sure you're on Sepolia (see Issue 2)
2. Refresh page
3. Try connecting again

#### Check 3: Clear Cache
1. Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
2. Select "All time"
3. Check "Cached images and files"
4. Click "Clear data"
5. Refresh page

#### Check 4: Try Incognito Mode
1. Open incognito/private window
2. Visit platform
3. Connect wallet
4. If works, clear cache in normal browser

---

### Issue 6: Transaction Failing

**Problem**: Transactions fail or get stuck

**Solutions**:

#### Check 1: Sufficient ETH for Gas
- Need at least 0.01 ETH for gas fees
- Get more from faucets (see Issue 3)

#### Check 2: Correct Network
- Verify you're on Sepolia
- Check wallet shows "Sepolia" at top

#### Check 3: Reset Account (MetaMask)
1. Open MetaMask
2. Click account icon (top right)
3. Settings → Advanced
4. Scroll down to "Reset Account"
5. Click "Reset"
6. Try transaction again

#### Check 4: Increase Gas Limit
1. When confirming transaction
2. Click "Edit" on gas
3. Increase gas limit by 20%
4. Confirm

---

### Issue 7: Job Not Showing After Creation

**Problem**: Created job but don't see it

**Solutions**:

#### Check 1: Refresh Page
- Simple refresh (F5)
- Hard refresh (Ctrl+F5)

#### Check 2: Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Look for failed requests (red)
4. Check error messages

#### Check 3: Verify Backend
1. Check backend is running: https://clientarbitrator-production.up.railway.app/api/health
2. Should return: `{"status": "healthy"}`
3. If not, backend might be down

#### Check 4: Check Database
- Job might be created but not displaying
- Try logging out and back in
- Check different browser

---

### Issue 8: Can't See Admin Portal

**Problem**: Can't access /admin route

**Solution**:

#### Check 1: Correct Email/Wallet
Admin access is restricted to:
- Email: devanshgoyal1234@gmail.com
- OR Wallet: 0x6a413e4c59cfb5d4544d5eca74dacf7848b3a483

#### Check 2: Login First
1. Must be logged in
2. Go to: https://cryptogig-platform.netlify.app/admin
3. If redirected, you don't have access

#### Check 3: Assign Yourself (if you're admin)
1. Login with admin account
2. Go to /admin
3. Assign yourself as arbitrator

---

## 🔍 Debug Checklist

Before asking for help, check:

- [ ] Logged in? (Check localStorage.getItem('token'))
- [ ] On Sepolia network? (Check wallet)
- [ ] Have test ETH? (Check balance)
- [ ] Have test USDC? (If funding jobs)
- [ ] Backend healthy? (Visit /api/health)
- [ ] Browser cache cleared?
- [ ] Tried incognito mode?
- [ ] Checked browser console for errors?

---

## 🛠️ Quick Fixes

### Clear Everything and Start Fresh

```javascript
// Open browser console (F12) and run:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Check Your Setup

```javascript
// In browser console:
console.log('Token:', localStorage.getItem('token'));
console.log('Backend:', import.meta.env.VITE_BACKEND_URL);
console.log('Chain ID:', import.meta.env.VITE_CHAIN_ID);
```

### Test Backend Connection

```bash
# In terminal:
curl https://clientarbitrator-production.up.railway.app/api/health
```

Should return:
```json
{
  "status": "healthy",
  "version": "2.3.0-ADMIN-PORTAL",
  "database": "connected"
}
```

---

## 📞 Still Having Issues?

### Check These Resources:

1. **Platform Status**: https://cryptogig-platform.netlify.app
2. **Backend Health**: https://clientarbitrator-production.up.railway.app/api/health
3. **GitHub Issues**: https://github.com/Devansh-g1/CryptoGig.git/issues
4. **Documentation**: See QUICK_REFERENCE.md

### Collect This Info:

When reporting issues, include:
- Browser and version
- Wallet type (MetaMask/Rainbow)
- Network (should be Sepolia)
- Error message (full text)
- Console errors (F12 → Console)
- Steps to reproduce

---

## ✅ Success Checklist

You're ready when:
- [ ] Wallet connected
- [ ] On Sepolia network
- [ ] Have 0.5+ ETH
- [ ] Have 10+ USDC (or can swap)
- [ ] Logged into platform
- [ ] Can see dashboard
- [ ] Backend health check passes

**Now you can test the full platform!** 🎉
