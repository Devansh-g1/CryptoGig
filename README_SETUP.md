# CryptoGig - Complete Setup Guide

## What You Need to Do

Your CryptoGig backend requires **MongoDB** to store all data (users, jobs, channels, messages). Without it, the backend cannot start.

## Current Status

❌ MongoDB is **NOT configured**
- Connection string in `backend/.env` is a placeholder
- Backend will not start until MongoDB is set up

## Two Options

### Option 1: Automated Setup (Recommended)

Run the setup script:
```bash
./setup-mongodb-atlas.sh
```

This will:
1. Guide you through MongoDB Atlas setup
2. Ask for your connection string
3. Update `backend/.env` automatically
4. Test the connection
5. Confirm everything works

### Option 2: Manual Setup

Follow the detailed guide: **[MONGODB_SETUP_COMPLETE.md](MONGODB_SETUP_COMPLETE.md)**

## After MongoDB is Set Up

### 1. Start the Backend
```bash
./start-backend.sh
```

This script will:
- ✅ Check Python installation
- ✅ Install dependencies
- ✅ Test MongoDB connection
- ✅ Start server on http://localhost:8000

### 2. Test Everything
```bash
python3 test-fixes.py
```

This will test:
- ✅ User registration (no email verification)
- ✅ User login
- ✅ Job creation
- ✅ Channel creation
- ✅ Role switching

### 3. Start Frontend
```bash
cd frontend
npm install
npm start
```

Frontend will be available at: http://localhost:3000

## What Was Fixed

### ✅ Email Verification Removed
- Users can now register and login immediately
- No more "email not verified" errors
- Registration returns login token right away

### ✅ MongoDB Integration
- Backend now uses MongoDB for data persistence
- Users won't get logged out unexpectedly
- All data (users, jobs, channels) is saved

### ✅ Job Posting Fixed
- Clients can create jobs successfully
- Role-based permissions work correctly
- Uses `active_role` for permission checks

### ✅ Community Features Fixed
- Channel creation works
- Messages persist in database
- Members can join/leave channels

## Files Created

### Setup Scripts
- `setup-mongodb-atlas.sh` - Interactive MongoDB setup wizard
- `start-backend.sh` - Start backend with checks
- `test-fixes.py` - Test all functionality

### Documentation
- `MONGODB_SETUP_COMPLETE.md` - Detailed MongoDB guide (step-by-step)
- `QUICK_START.md` - Quick reference guide
- `FIXES_APPLIED.md` - Technical details of fixes
- `README_SETUP.md` - This file

## MongoDB Atlas Setup (Quick Version)

1. **Create Account**: https://www.mongodb.com/cloud/atlas/register
2. **Create Cluster**: Choose M0 FREE tier
3. **Create User**: Username: `cryptogig`, Password: [your choice]
4. **Whitelist IP**: Add `0.0.0.0/0` (for development)
5. **Get Connection String**: Copy from Atlas dashboard
6. **Update .env**: Paste connection string in `backend/.env`

**Detailed instructions**: See [MONGODB_SETUP_COMPLETE.md](MONGODB_SETUP_COMPLETE.md)

## Verification Steps

### 1. Test MongoDB Connection
```bash
python3 backend/test_mongodb.py
```

Expected output:
```
✅ Successfully connected to MongoDB!
✅ Database 'cryptogig_db' is accessible
✅ MongoDB connection test completed successfully!
```

### 2. Check Backend Health
```bash
curl http://localhost:8000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

### 3. Register a Test User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User",
    "role": "client"
  }'
```

Should return a token immediately (no email verification needed).

## Common Issues

### "Connection refused" Error
**Problem**: Backend is not running
**Solution**: Run `./start-backend.sh`

### "DNS query name does not exist"
**Problem**: MongoDB connection string is wrong
**Solution**: 
1. Check `backend/.env`
2. Verify connection string from Atlas
3. Run `./setup-mongodb-atlas.sh` to reconfigure

### "Authentication failed"
**Problem**: Wrong MongoDB password
**Solution**:
1. Check password in connection string
2. Verify database user in Atlas
3. Make sure you replaced `<password>` with actual password

### "IP not whitelisted"
**Problem**: Your IP is not allowed to connect
**Solution**:
1. Go to Network Access in MongoDB Atlas
2. Add `0.0.0.0/0` to allow all IPs
3. Wait 1-2 minutes for changes to apply

## Project Architecture

```
CryptoGig
├── Backend (FastAPI + MongoDB)
│   ├── User authentication (JWT)
│   ├── Job management
│   ├── Community channels
│   └── Arbitrator functions
│
├── Frontend (React)
│   ├── User interface
│   ├── Web3 wallet integration
│   └── Real-time updates
│
└── Smart Contracts (Solidity)
    ├── Escrow management
    ├── Payment handling
    └── Dispute resolution
```

## Data Flow

```
User Registration
    ↓
MongoDB (users collection)
    ↓
JWT Token Generated
    ↓
User Can Login
    ↓
Create Jobs/Channels
    ↓
MongoDB (jobs/channels collections)
    ↓
Data Persists Forever
```

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register (returns token)
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/switch-role` - Switch between client/freelancer

### Jobs
- `POST /api/jobs` - Create job
- `GET /api/jobs` - List jobs
- `POST /api/jobs/{id}/accept` - Accept job

### Community
- `POST /api/channels` - Create channel
- `GET /api/channels` - List channels
- `POST /api/channels/{id}/messages` - Send message

Full API docs: http://localhost:8000/docs (when backend is running)

## Next Steps

1. **Set up MongoDB** (10 minutes)
   ```bash
   ./setup-mongodb-atlas.sh
   ```

2. **Start backend** (1 minute)
   ```bash
   ./start-backend.sh
   ```

3. **Test API** (1 minute)
   ```bash
   python3 test-fixes.py
   ```

4. **Start frontend** (2 minutes)
   ```bash
   cd frontend && npm install && npm start
   ```

5. **Use the app** 🎉
   - Open http://localhost:3000
   - Register a user
   - Create jobs
   - Join channels

## Support & Documentation

- **MongoDB Setup**: [MONGODB_SETUP_COMPLETE.md](MONGODB_SETUP_COMPLETE.md)
- **Quick Start**: [QUICK_START.md](QUICK_START.md)
- **Technical Details**: [FIXES_APPLIED.md](FIXES_APPLIED.md)
- **API Docs**: http://localhost:8000/docs

## Important Notes

1. **MongoDB is Required**: The backend will not start without it
2. **Free Tier is Fine**: MongoDB Atlas M0 FREE tier is perfect for development
3. **No Email Verification**: Users can login immediately after registration
4. **Data Persists**: All data is saved in MongoDB (not lost on restart)
5. **Role Switching**: Users can switch between client and freelancer roles

## Ready to Start?

Run this command to begin:
```bash
./setup-mongodb-atlas.sh
```

Or read the detailed guide first:
```bash
cat MONGODB_SETUP_COMPLETE.md
```

## Questions?

Check the troubleshooting sections in:
- [MONGODB_SETUP_COMPLETE.md](MONGODB_SETUP_COMPLETE.md) - MongoDB issues
- [QUICK_START.md](QUICK_START.md) - General issues
- [FIXES_APPLIED.md](FIXES_APPLIED.md) - Technical details

---

**You're almost there!** Just set up MongoDB and everything will work. 🚀
