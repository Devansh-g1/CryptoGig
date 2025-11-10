# 🚀 How to Run CryptoGig (Full Version with Persistent Storage)

## 🎯 **You have 3 options for running the full app:**

---

## Option 1: Docker MongoDB (Recommended) 🐳

### Prerequisites
1. **Start Docker Desktop** application on your Mac
2. Wait for Docker to fully start (whale icon appears in menu bar)

### Steps
```bash
# 1. Start MongoDB container
docker run --name cryptogig-mongodb -p 27017:27017 -d mongo:7.0

# 2. Verify MongoDB is running
docker ps | grep mongo

# 3. Start the application
./run.sh

# 4. Create test accounts (in new terminal)
python create_test_accounts.py
```

### Access
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Management Commands
```bash
# Stop MongoDB
docker stop cryptogig-mongodb

# Start MongoDB (if stopped)
docker start cryptogig-mongodb

# Remove MongoDB (deletes all data)
docker rm -f cryptogig-mongodb

# View MongoDB logs
docker logs cryptogig-mongodb
```

---

## Option 2: MongoDB Atlas (Cloud) ☁️

### Prerequisites
- Internet connection
- Free MongoDB Atlas account

### Steps

#### 1. Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/atlas
2. Sign up for free (no credit card required)
3. Create a **free M0 cluster**
4. Create a database user
5. Whitelist your IP address (or use 0.0.0.0/0 for development)

#### 2. Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string

#### 3. Update Configuration
Edit `backend/.env` and replace the MONGO_URL:
```bash
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/cryptogig_db?retryWrites=true&w=majority
```

#### 4. Start Application
```bash
./run.sh
python create_test_accounts.py
```

**Pros**: No local installation, production-ready, automatic backups
**Cons**: Requires internet, account setup

---

## Option 3: Native MongoDB (After Xcode Update) 🍺

### Prerequisites
1. Update Xcode to version 26.0+
2. Update Command Line Tools

### Steps
```bash
# 1. Update Xcode Command Line Tools
sudo xcode-select --install

# 2. Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# 3. Start MongoDB
brew services start mongodb-community

# 4. Start application
./run.sh

# 5. Create test accounts
python create_test_accounts.py
```

---

## 🔧 **Manual Setup (Any MongoDB Option)**

If the automated scripts don't work:

### Terminal 1: Backend
```bash
cd backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2: Frontend
```bash
cd frontend
npm start
```

### Terminal 3: Create Test Accounts
```bash
python create_test_accounts.py
```

---

## 🔑 **Test Accounts**

After running `python create_test_accounts.py`:

- **Client**: client@cryptogig.com / test123
- **Freelancer**: freelancer@cryptogig.com / test123
- **Arbitrator**: devanshgoyal1234@gmail.com / test123

---

## ✅ **Verification Steps**

1. **Backend Health Check**: Visit http://localhost:8000
   - Should show: `{"message": "CryptoGig API", "version": "1.0.0"}`

2. **Frontend**: Visit http://localhost:3000
   - Should show the CryptoGig landing page

3. **Login Test**: 
   - Click "Get Started"
   - Login with client@cryptogig.com / test123
   - Should redirect to client dashboard

4. **Role Switching Test**:
   - Click "Switch to Freelancer"
   - Should switch without asking for login again ✅

---

## 🚨 **Troubleshooting**

### "Docker daemon not running"
1. Open **Docker Desktop** application
2. Wait for it to fully start
3. Try the docker commands again

### "Connection refused" (MongoDB)
```bash
# Check if MongoDB is running
docker ps | grep mongo  # For Docker
brew services list | grep mongodb  # For Homebrew

# Check application status
./check-status.sh
```

### "Port already in use"
```bash
# Find what's using the port
lsof -i :27017  # MongoDB
lsof -i :8000   # Backend
lsof -i :3000   # Frontend

# Kill processes if needed
kill -9 $(lsof -ti:8000)  # Kill backend
kill -9 $(lsof -ti:3000)  # Kill frontend
```

### "Module not found" errors
```bash
# Reinstall dependencies
cd backend && pip install -r requirements.txt
cd frontend && npm install --legacy-peer-deps
```

---

## 🎯 **Recommended Approach**

**For immediate testing**: Use **MongoDB Atlas** (Option 2)
- No local installation needed
- Works immediately
- Production-ready

**For development**: Use **Docker** (Option 1) after starting Docker Desktop
- Local control
- Fast performance
- Easy to reset data

---

## 📞 **Need Help?**

1. Run `./check-status.sh` to diagnose issues
2. Check `TROUBLESHOOTING.md` for common problems
3. Use demo mode as fallback: `./run-demo.sh`

The application will have **full functionality** with persistent data storage using any of these options!