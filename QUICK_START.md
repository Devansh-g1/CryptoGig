# CryptoGig Quick Start Guide

## Prerequisites

- Python 3.8+ installed
- Internet connection
- MongoDB Atlas account (free)

## Setup Steps

### 1. MongoDB Setup (10 minutes)

```bash
./setup-mongodb-atlas.sh
```

Or follow the detailed guide: [MONGODB_SETUP_COMPLETE.md](MONGODB_SETUP_COMPLETE.md)

**Quick MongoDB Atlas Setup:**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create M0 FREE cluster
4. Create database user: `cryptogig` / `[your-password]`
5. Whitelist IP: `0.0.0.0/0` (for development)
6. Get connection string
7. Update `backend/.env` with your connection string

### 2. Install Dependencies

```bash
cd backend
pip3 install -r requirements.txt
cd ..
```

### 3. Test MongoDB Connection

```bash
python3 backend/test_mongodb.py
```

Expected: ✅ All tests pass

### 4. Start Backend

```bash
./start-backend.sh
```

Server will start on: http://localhost:8000

### 5. Test API

In a new terminal:

```bash
python3 test-fixes.py
```

Expected: ✅ All tests pass

### 6. Start Frontend

```bash
cd frontend
npm install
npm start
```

Frontend will start on: http://localhost:3000

## Verify Everything Works

### Backend Health Check
```bash
curl http://localhost:8000/api/health
```

### Register a User
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

### Create a Job
```bash
# Use the token from registration
curl -X POST http://localhost:8000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Job",
    "description": "Test description",
    "budget_usdc": 100,
    "required_skills": ["Python"]
  }'
```

## Troubleshooting

### MongoDB Connection Failed
1. Check connection string in `backend/.env`
2. Verify password is correct
3. Ensure IP is whitelisted (0.0.0.0/0)
4. Wait 2-3 minutes after creating cluster

### Backend Won't Start
1. Check Python version: `python3 --version` (need 3.8+)
2. Install dependencies: `pip3 install -r backend/requirements.txt`
3. Check MongoDB connection: `python3 backend/test_mongodb.py`

### Tests Failing
1. Ensure backend is running: `curl http://localhost:8000/api/health`
2. Check MongoDB is connected
3. Review error messages in terminal

## Project Structure

```
.
├── backend/
│   ├── server.py           # Main FastAPI application
│   ├── .env                # Configuration (MongoDB, JWT, etc.)
│   ├── requirements.txt    # Python dependencies
│   └── test_mongodb.py     # MongoDB connection test
├── frontend/
│   ├── src/                # React application
│   └── package.json        # Node dependencies
├── start-backend.sh        # Start backend server
├── setup-mongodb-atlas.sh  # MongoDB setup wizard
├── test-fixes.py           # API test suite
└── MONGODB_SETUP_COMPLETE.md  # Detailed MongoDB guide
```

## Key Features Working

✅ User registration (no email verification)
✅ User login with JWT tokens
✅ Job creation by clients
✅ Job listing and filtering
✅ Community channel creation
✅ Channel messaging
✅ Role switching (client ↔ freelancer)
✅ Arbitrator functions
✅ Data persistence in MongoDB

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/switch-role` - Switch role

### Jobs
- `POST /api/jobs` - Create job (client only)
- `GET /api/jobs` - List jobs
- `GET /api/jobs/{id}` - Get job details
- `POST /api/jobs/{id}/accept` - Accept job (freelancer)

### Community
- `POST /api/channels` - Create channel
- `GET /api/channels` - List channels
- `POST /api/channels/{id}/join` - Join channel
- `GET /api/channels/{id}/messages` - Get messages
- `POST /api/channels/{id}/messages` - Send message

### Arbitrator
- `GET /api/disputes` - List disputes
- `POST /api/disputes/{id}/resolve` - Resolve dispute
- `GET /api/stats` - Get statistics

## API Documentation

Once backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables

Key variables in `backend/.env`:

```env
# MongoDB (REQUIRED)
MONGO_URL=mongodb+srv://...
DB_NAME=cryptogig_db

# JWT (REQUIRED)
JWT_SECRET=your-secret-key

# Arbitrator
ARBITRATOR_WALLET=0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483
```

## Development Workflow

1. **Make changes** to backend code
2. **Server auto-reloads** (uvicorn --reload)
3. **Test changes**: `python3 test-fixes.py`
4. **Check MongoDB**: View data in Atlas dashboard

## Production Deployment

See: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## Support

- MongoDB Issues: [MONGODB_SETUP_COMPLETE.md](MONGODB_SETUP_COMPLETE.md)
- API Issues: Check `backend/server.py`
- Frontend Issues: Check `frontend/src/`

## Quick Commands Reference

```bash
# Setup
./setup-mongodb-atlas.sh          # Setup MongoDB
pip3 install -r backend/requirements.txt  # Install deps

# Testing
python3 backend/test_mongodb.py   # Test MongoDB
python3 test-fixes.py             # Test API

# Running
./start-backend.sh                # Start backend
cd frontend && npm start          # Start frontend

# Monitoring
curl http://localhost:8000/api/health  # Health check
```

## Success Checklist

- [ ] MongoDB Atlas account created
- [ ] Cluster created and running
- [ ] Database user created
- [ ] IP whitelisted
- [ ] Connection string in backend/.env
- [ ] MongoDB connection test passes
- [ ] Backend starts successfully
- [ ] API tests pass
- [ ] Frontend connects to backend
- [ ] Can register and login users
- [ ] Can create jobs
- [ ] Can create channels

Once all checked, you're ready to develop! 🎉
