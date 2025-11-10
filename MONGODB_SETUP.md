# 🍃 MongoDB Setup Guide for CryptoGig

## 🎯 Choose Your MongoDB Option

### Option 1: Demo Mode (No Installation) ⚡
**Best for**: Quick testing and development

```bash
./run-demo.sh
```

**Pros**: 
- No installation required
- Instant setup
- Perfect for testing features

**Cons**: 
- Data is lost when server stops
- In-memory storage only

---

### Option 2: Docker (Recommended) 🐳
**Best for**: Development and testing with persistent data

#### Prerequisites
1. Install Docker Desktop from https://www.docker.com/products/docker-desktop/
2. Start Docker Desktop

#### Setup
```bash
# Start MongoDB with Docker
docker run --name cryptogig-mongodb -p 27017:27017 -d mongo:7.0

# Start the application
./run.sh

# Create test accounts
python create_test_accounts.py
```

#### Management Commands
```bash
# Stop MongoDB
docker stop cryptogig-mongodb

# Start MongoDB (after stopping)
docker start cryptogig-mongodb

# Remove MongoDB (deletes all data)
docker rm -f cryptogig-mongodb

# View MongoDB logs
docker logs cryptogig-mongodb
```

**Pros**:
- Easy installation
- Persistent data storage
- Easy to manage and remove
- Works on all systems

**Cons**:
- Requires Docker Desktop

---

### Option 3: Homebrew (Native Installation) 🍺
**Best for**: Production-like development environment

#### Prerequisites
- macOS with Homebrew installed
- Xcode Command Line Tools updated

#### Setup
```bash
# Update Xcode Command Line Tools first
xcode-select --install

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Start the application
./run.sh

# Create test accounts
python create_test_accounts.py
```

#### Management Commands
```bash
# Stop MongoDB
brew services stop mongodb-community

# Restart MongoDB
brew services restart mongodb-community

# Check MongoDB status
brew services list | grep mongodb
```

**Pros**:
- Native performance
- Integrates with macOS services
- Production-like environment

**Cons**:
- Requires Xcode updates
- More complex installation
- Takes more system resources

---

### Option 4: MongoDB Atlas (Cloud) ☁️
**Best for**: Production deployment and team collaboration

#### Setup
1. Go to https://www.mongodb.com/atlas
2. Create free account
3. Create a free cluster (M0 Sandbox)
4. Get connection string
5. Update `backend/.env`:
   ```bash
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/cryptogig_db
   ```

**Pros**:
- No local installation
- Production-ready
- Automatic backups
- Free tier available

**Cons**:
- Requires internet connection
- Account setup needed

---

## 🚀 Quick Start Commands

### For Demo Mode
```bash
./run-demo.sh
# Access at http://localhost:3000
```

### For Docker
```bash
# Start Docker Desktop first, then:
docker run --name cryptogig-mongodb -p 27017:27017 -d mongo:7.0
./run.sh
python create_test_accounts.py
```

### For Homebrew
```bash
brew services start mongodb-community
./run.sh
python create_test_accounts.py
```

## 🔧 Troubleshooting

### "Docker daemon not running"
- Start Docker Desktop application
- Wait for Docker to fully start (whale icon in menu bar)

### "Xcode too outdated" (Homebrew)
- Update Xcode from App Store or Apple Developer
- Or use Docker option instead

### "Connection refused" (MongoDB)
```bash
# Check if MongoDB is running
# For Docker:
docker ps | grep mongo

# For Homebrew:
brew services list | grep mongodb

# For any method:
./check-status.sh
```

### "Port 27017 already in use"
```bash
# Find what's using the port
lsof -i :27017

# Stop existing MongoDB
docker stop cryptogig-mongodb  # For Docker
brew services stop mongodb-community  # For Homebrew
```

## 📊 Comparison Table

| Method | Setup Time | Persistence | Performance | Ease of Removal |
|--------|------------|-------------|-------------|-----------------|
| Demo | 1 min | ❌ | ⭐⭐⭐ | ⭐⭐⭐ |
| Docker | 5 min | ✅ | ⭐⭐ | ⭐⭐⭐ |
| Homebrew | 10 min | ✅ | ⭐⭐⭐ | ⭐⭐ |
| Atlas | 15 min | ✅ | ⭐⭐ | ⭐⭐⭐ |

## 🎯 Recommendations

- **Just testing features?** → Use Demo Mode
- **Development work?** → Use Docker
- **Production-like setup?** → Use Homebrew (after Xcode update)
- **Team collaboration?** → Use MongoDB Atlas

## 🔑 Test Accounts

All methods support the same test accounts:
- **Client**: client@cryptogig.com / test123
- **Freelancer**: freelancer@cryptogig.com / test123
- **Arbitrator**: devanshgoyal1234@gmail.com / test123

## 📞 Need Help?

1. Run `./check-status.sh` to diagnose issues
2. Check `TROUBLESHOOTING.md` for common problems
3. Use Demo Mode if all else fails: `./run-demo.sh`