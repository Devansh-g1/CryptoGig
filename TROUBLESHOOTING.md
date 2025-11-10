# 🔧 CryptoGig Troubleshooting Guide

## Common Issues and Solutions

### 🚀 Setup Issues

#### "MongoDB connection failed"
```bash
# Check if MongoDB is running
pgrep mongod

# Start MongoDB (macOS)
brew services start mongodb-community

# Start MongoDB (Linux)
sudo systemctl start mongod

# Check MongoDB status
mongo --eval "db.adminCommand('ping')"
```

#### "Port already in use"
```bash
# Find process using port 8000 (backend)
lsof -ti:8000 | xargs kill -9

# Find process using port 3000 (frontend)  
lsof -ti:3000 | xargs kill -9
```

#### "Module not found" errors
```bash
# Reinstall backend dependencies
cd backend && pip install -r requirements.txt

# Reinstall frontend dependencies (with dependency conflict fix)
cd frontend && rm -rf node_modules package-lock.json && npm install --legacy-peer-deps
```

#### "ERESOLVE unable to resolve dependency tree" error
```bash
# This is a known issue with date-fns version conflict
# Use the fix script:
./fix-dependencies.sh

# Or manually:
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### 🔐 Authentication Issues

#### "Invalid credentials" on login
- Check if test accounts exist: `python create_test_accounts.py`
- Verify MongoDB is running and accessible
- Check backend logs for detailed errors

#### "Token expired" errors
- Tokens expire after 24 hours
- Simply login again to get a new token
- Check system clock is correct

#### Role switching asks for login
- **FIXED**: Updated RoleSwitcher to use AuthContext properly
- Clear browser cache and cookies if issue persists
- Check browser console for JavaScript errors

### 💰 Wallet Connection Issues

#### "WalletConnect Project ID" warnings
1. Get free Project ID from https://cloud.walletconnect.com
2. Add to `frontend/.env`: `REACT_APP_WALLETCONNECT_PROJECT_ID=your_id_here`
3. Restart frontend: `cd frontend && npm start`

#### MetaMask connection fails
- Make sure MetaMask is installed and unlocked
- Switch to Polygon Amoy testnet in MetaMask
- Clear MetaMask cache: Settings → Advanced → Reset Account

#### "Smart contract not deployed" error
- This is expected until you deploy the contract
- Follow `DEPLOYMENT_GUIDE.md` to deploy
- App works without blockchain (database mode)

### 🔗 Blockchain Issues

#### "Insufficient MATIC for gas"
- Get free MATIC from https://faucet.polygon.technology/
- Select "Amoy Testnet" and enter your wallet address
- Wait 1-2 minutes for tokens to arrive

#### "Contract not found" errors
1. Deploy contract: `cd contracts && npm run deploy:amoy`
2. Copy contract address to `backend/.env` and `frontend/.env`
3. Restart both services

#### Transaction fails
- Check you have enough MATIC for gas fees
- Verify you're on Polygon Amoy testnet
- Try increasing gas limit in MetaMask

### 🖥️ Frontend Issues

#### White screen / App won't load
```bash
# Check for JavaScript errors in browser console
# Clear browser cache and cookies
# Restart frontend
cd frontend && npm start
```

#### "Network Error" when calling API
- Verify backend is running on http://localhost:8000
- Check `frontend/.env` has correct `REACT_APP_BACKEND_URL`
- Disable browser ad blockers

#### Role switching redirects to login
- **FIXED**: Updated to use proper state management
- Clear localStorage: `localStorage.clear()` in browser console
- Login again

### 🔧 Backend Issues

#### "FastAPI server won't start"
```bash
# Check Python version (need 3.11+)
python3 --version

# Install missing dependencies
pip install -r requirements.txt

# Check for port conflicts
lsof -i :8000
```

#### "Database connection error"
- Verify MongoDB is running: `pgrep mongod`
- Check connection string in `backend/.env`
- Test connection: `mongo cryptogig_db --eval "db.stats()"`

#### "JWT decode error"
- Check `JWT_SECRET` is set in `backend/.env`
- Clear browser localStorage and login again
- Restart backend server

### 📱 Mobile Issues

#### Wallet connection on mobile
- Use WalletConnect instead of MetaMask browser
- Make sure mobile wallet supports Polygon Amoy
- Try different wallet apps (Trust Wallet, Rainbow, etc.)

### 🔍 Debugging Tips

#### Check backend logs
```bash
# Run backend with verbose logging
cd backend
python -m uvicorn server:app --reload --log-level debug
```

#### Check frontend console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Check Network tab for failed API calls

#### Database inspection
```bash
# Connect to MongoDB
mongo cryptogig_db

# List collections
show collections

# Check users
db.users.find().pretty()

# Check jobs
db.jobs.find().pretty()
```

### 🆘 Still Having Issues?

1. **Check the logs**: Backend terminal and browser console
2. **Verify environment**: All `.env` files configured correctly
3. **Test step by step**: Start with basic login, then add features
4. **Clean restart**: Stop all services, clear cache, restart everything

### 📞 Getting Help

If you're still stuck:

1. **Check existing issues** in the repository
2. **Provide details**: Error messages, logs, steps to reproduce
3. **Include environment**: OS, Node version, Python version
4. **Screenshots**: If UI issues, include screenshots

---

## Quick Reset (Nuclear Option)

If everything is broken:

```bash
# Stop all services
pkill -f uvicorn
pkill -f "npm start"

# Clear all data
rm -rf frontend/node_modules
rm -rf backend/__pycache__
mongo cryptogig_db --eval "db.dropDatabase()"

# Fresh start
./setup.sh
./run.sh
python create_test_accounts.py
```

This will give you a completely fresh installation.