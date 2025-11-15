# 🚀 Complete Setup Guide - Step by Step

## ✅ Good News: CORS is Fixed!

The CORS error you're seeing is **cached in your browser**. The backend is now properly configured and working.

## 🎯 Follow These Steps IN ORDER

### Step 1: Clear Browser Cache (CRITICAL!)

**Why**: Your browser has cached the old CORS error

**How**:
1. Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
2. Select **"All time"** from dropdown
3. Check these boxes:
   - ✅ Cached images and files
   - ✅ Cookies and other site data
4. Click **"Clear data"**
5. **Close ALL browser tabs**
6. **Restart your browser**

### Step 2: Add Sepolia Network

**Option A: Use Helper Page** (Easiest)
1. Visit: https://cryptogig-platform.netlify.app/add-sepolia.html
2. Click "Add Sepolia to MetaMask"
3. Approve in MetaMask popup
4. Done!

**Option B: Enable in MetaMask**
1. Open MetaMask
2. Click network dropdown (top left)
3. Click "Show/hide test networks"
4. Toggle ON "Show test networks"
5. Select "Sepolia test network"

### Step 3: Get Test ETH

1. **Copy your wallet address** from MetaMask
2. **Visit**: https://sepoliafaucet.com
3. **Paste** your address
4. **Complete** captcha
5. **Click** "Send Me ETH"
6. **Wait** 1-2 minutes
7. **Check** MetaMask - should see 0.5 ETH

**Alternative Faucets** (if first one doesn't work):
- https://www.infura.io/faucet/sepolia
- https://faucet.quicknode.com/ethereum/sepolia
- https://faucets.chain.link/sepolia

### Step 4: Register on Platform

1. **Visit**: https://cryptogig-platform.netlify.app
2. **Click**: "Get Started" or "Sign Up"
3. **Fill in**:
   - Email: your-email@example.com
   - Password: your-password (min 8 characters)
   - Name: Your Name
   - **Role: Client** ← Important for creating jobs!
4. **Click**: "Register"
5. **You should see**: Client Dashboard

### Step 5: Connect Wallet

1. **Click**: "Connect Wallet" button (top right)
2. **MetaMask popup** will appear
3. **Click**: "Next" → "Connect"
4. **Platform will auto-switch** to Sepolia
5. **Approve** network switch in MetaMask
6. **You should see**: Your wallet address displayed

### Step 6: Create Your First Job

1. **Click**: "Create Job" button
2. **Fill in**:
   - Title: "Test Job"
   - Description: "This is a test job"
   - Budget: 10 (USDC)
   - Skills: "Testing" (optional)
3. **Click**: "Create Job"
4. **You should see**: Job created successfully!

### Step 7: Fund the Job (Optional)

1. **Get test USDC**:
   - Visit: https://faucet.circle.com
   - Select Sepolia network
   - Get test USDC

2. **Or use Swap feature**:
   - Click "Fund Job" on your created job
   - Click "Swap ETH to USDC First"
   - Enter ETH amount
   - Confirm swap

## 🔍 Troubleshooting

### Issue: Still seeing CORS error

**Solution**:
1. Did you clear cache? (Step 1)
2. Did you restart browser?
3. Try **Incognito/Private mode**:
   - Press `Ctrl+Shift+N` (Windows) or `Cmd+Shift+N` (Mac)
   - Visit platform in incognito
   - If works, your cache wasn't cleared properly

### Issue: "Not authenticated" error

**Solution**:
- This is NORMAL if you're not logged in
- Complete Step 4 (Register)
- Make sure you see your name in top right corner

### Issue: Can't see Sepolia in MetaMask

**Solution**:
- Follow Step 2 carefully
- Use helper page: /add-sepolia.html
- See: ENABLE_TESTNET_GUIDE.md

### Issue: No test ETH

**Solution**:
- Try all faucets listed in Step 3
- Some faucets require social verification
- Wait 24 hours between requests

### Issue: Wallet won't connect

**Solution**:
1. Make sure MetaMask is installed
2. Make sure you're on Sepolia network
3. Refresh page
4. Try connecting again

## ✅ Success Checklist

You're ready when you see:

- [ ] Browser cache cleared
- [ ] MetaMask shows "Sepolia" at top
- [ ] Have at least 0.1 ETH in wallet
- [ ] Registered on platform (see your name top right)
- [ ] Wallet connected (see address top right)
- [ ] Can create jobs without errors

## 🎯 Quick Test

To verify everything works:

1. **Open DevTools**: Press F12
2. **Go to Console tab**
3. **Type**: `localStorage.getItem('token')`
4. **Should return**: A long token string (not null)
5. **If null**: You're not logged in, go to Step 4

## 📱 Mobile Setup

If using mobile:

1. **Install MetaMask app**
2. **Add Sepolia network** (see Step 2)
3. **Get test ETH** (see Step 3)
4. **Visit platform** in MetaMask browser
5. **Register** (see Step 4)
6. **Connect wallet** (automatic in MetaMask browser)

## 🆘 Still Having Issues?

### Check Backend Status

```bash
curl https://clientarbitrator-production.up.railway.app/api/health
```

Should return:
```json
{"status":"healthy","database":"connected"}
```

### Check CORS Headers

```bash
curl -I -H "Origin: https://cryptogig-platform.netlify.app" \
  https://clientarbitrator-production.up.railway.app/api/health
```

Should include:
```
access-control-allow-origin: https://cryptogig-platform.netlify.app
```

### Check Your Login Status

1. Open DevTools (F12)
2. Console tab
3. Type: `localStorage.getItem('token')`
4. If null → Not logged in
5. If long string → Logged in ✅

## 📚 Additional Resources

- **Troubleshooting**: TROUBLESHOOTING_GUIDE.md
- **Sepolia Setup**: ADD_SEPOLIA_INSTRUCTIONS.md
- **Testnet Guide**: ENABLE_TESTNET_GUIDE.md
- **Quick Reference**: QUICK_REFERENCE.md

## 🎉 You're All Set!

Once you complete all 6 steps:
- ✅ CORS is working
- ✅ You're logged in
- ✅ Wallet connected
- ✅ Can create jobs
- ✅ Platform fully functional

**Happy testing!** 🚀

---

## ⚠️ Important Notes

1. **CORS is fixed** - The error you see is cached
2. **Clear cache is critical** - Don't skip Step 1
3. **Must register first** - Can't create jobs without login
4. **Sepolia only** - Make sure you're on Sepolia network
5. **Test tokens** - All ETH and USDC are fake (testnet)

## 🔄 If You Need to Start Over

1. Clear browser cache completely
2. Logout from platform
3. Clear localStorage: `localStorage.clear()`
4. Refresh page
5. Start from Step 1 again
