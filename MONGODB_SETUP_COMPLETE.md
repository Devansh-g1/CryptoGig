# Complete MongoDB Setup Guide

## Why MongoDB is Required

Your CryptoGig backend uses MongoDB to store:
- **Users**: Registration, profiles, authentication
- **Jobs**: Job postings, applications, status
- **Channels**: Community channels and messages
- **Disputes**: Dispute records and resolutions
- **Teams**: Team collaborations

Without MongoDB, the backend cannot start and all data would be lost on restart.

## Step-by-Step MongoDB Atlas Setup

### 1. Create MongoDB Atlas Account (5 minutes)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with:
   - Email address
   - Or Google/GitHub account
3. No credit card required for free tier

### 2. Create a Free Cluster (2 minutes)

1. After login, click **"Build a Database"**
2. Choose **"M0 FREE"** tier
   - 512 MB storage
   - Shared RAM
   - Perfect for development
3. Select:
   - **Cloud Provider**: AWS, Google Cloud, or Azure (any is fine)
   - **Region**: Choose closest to your location
4. **Cluster Name**: Leave as "Cluster0" or choose your own
5. Click **"Create Cluster"**
6. Wait 1-3 minutes for cluster to be created

### 3. Create Database User (2 minutes)

1. In left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication method
4. Set credentials:
   ```
   Username: cryptogig
   Password: [Generate a strong password]
   ```
   **IMPORTANT**: Save this password! You'll need it for the connection string.

5. **Database User Privileges**: 
   - Select **"Built-in Role"**
   - Choose **"Atlas admin"** or **"Read and write to any database"**
6. Click **"Add User"**

### 4. Whitelist IP Address (1 minute)

1. In left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. For development, choose one:
   - **Option A (Recommended for dev)**: Click **"Allow Access from Anywhere"**
     - This adds `0.0.0.0/0`
     - Good for development/testing
   - **Option B (More secure)**: Add your specific IP
     - Click **"Add Current IP Address"**
4. Click **"Confirm"**
5. Wait 1-2 minutes for changes to take effect

### 5. Get Connection String (1 minute)

1. In left sidebar, click **"Database"**
2. Find your cluster (Cluster0)
3. Click **"Connect"** button
4. Choose **"Connect your application"**
5. Select:
   - **Driver**: Python
   - **Version**: 3.12 or later
6. Copy the connection string. It looks like:
   ```
   mongodb+srv://cryptogig:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. **Replace `<password>`** with your actual password from Step 3

### 6. Update Your Configuration

#### Option A: Use Setup Script (Easiest)
```bash
./setup-mongodb-atlas.sh
```
Follow the prompts and paste your connection string.

#### Option B: Manual Update
1. Open `backend/.env` in a text editor
2. Find the line starting with `MONGO_URL=`
3. Replace it with your connection string:
   ```env
   MONGO_URL=mongodb+srv://cryptogig:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/cryptogig_db?retryWrites=true&w=majority
   ```
4. Make sure to:
   - Replace `YOUR_PASSWORD` with your actual password
   - Add `/cryptogig_db` before the `?` if not present
5. Save the file

### 7. Test Connection

```bash
python3 backend/test_mongodb.py
```

Expected output:
```
🧪 MongoDB Connection Test
==============================
✅ Successfully connected to MongoDB!
✅ Database 'cryptogig_db' is accessible
✅ Can create collections
✅ Can insert documents
✅ Can query documents
✅ Can update documents
✅ Can delete documents
✅ MongoDB connection test completed successfully!

🎉 Your MongoDB setup is ready for deployment!
```

## Start the Backend

Once MongoDB is configured and tested:

```bash
./start-backend.sh
```

This will:
1. Check Python installation
2. Install dependencies if needed
3. Test MongoDB connection
4. Start the server on http://localhost:8000

## Verify Everything Works

### 1. Check Health Endpoint
```bash
curl http://localhost:8000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-07T...",
  "database": "connected",
  "service": "cryptogig-backend"
}
```

### 2. Run Full Test Suite
```bash
python3 test-fixes.py
```

This tests:
- User registration
- Login
- Job creation
- Channel creation
- Role switching

## Common Issues and Solutions

### Issue 1: "DNS query name does not exist"
**Cause**: Wrong connection string or cluster not ready
**Solution**: 
- Wait 2-3 minutes after creating cluster
- Double-check connection string
- Ensure you copied the full string

### Issue 2: "Authentication failed"
**Cause**: Wrong username or password
**Solution**:
- Verify username is `cryptogig`
- Check password in connection string
- Make sure you replaced `<password>` with actual password
- No special characters should be URL-encoded

### Issue 3: "Connection timeout"
**Cause**: IP not whitelisted
**Solution**:
- Go to Network Access in Atlas
- Add `0.0.0.0/0` to allow all IPs
- Wait 1-2 minutes for changes to apply

### Issue 4: "Server selection timeout"
**Cause**: Firewall or network issue
**Solution**:
- Check your internet connection
- Try disabling VPN temporarily
- Check if port 27017 is blocked by firewall

## MongoDB Atlas Dashboard

Access your data at: https://cloud.mongodb.com

You can:
- View collections (users, jobs, channels, etc.)
- Browse documents
- Run queries
- Monitor performance
- Set up backups

## Connection String Format

```
mongodb+srv://[username]:[password]@[cluster-url]/[database]?[options]
```

Example:
```
mongodb+srv://cryptogig:MyP@ssw0rd@cluster0.abc123.mongodb.net/cryptogig_db?retryWrites=true&w=majority
```

Parts:
- `mongodb+srv://` - Protocol (SRV for Atlas)
- `cryptogig` - Username
- `MyP@ssw0rd` - Password (URL encode special chars)
- `cluster0.abc123.mongodb.net` - Cluster hostname
- `cryptogig_db` - Database name
- `?retryWrites=true&w=majority` - Connection options

## Security Best Practices

### For Development:
- ✅ Use `0.0.0.0/0` for IP whitelist
- ✅ Use simple password
- ✅ Free tier is fine

### For Production:
- ⚠️ Whitelist only your server IPs
- ⚠️ Use strong, complex passwords
- ⚠️ Enable 2FA on Atlas account
- ⚠️ Use environment variables (never commit .env)
- ⚠️ Consider upgrading to paid tier for backups
- ⚠️ Enable MongoDB encryption at rest

## Data Collections

After running the app, you'll see these collections in MongoDB:

- **users** - User accounts and profiles
- **jobs** - Job postings and applications
- **channels** - Community channels
- **messages** - Channel messages
- **disputes** - Dispute records
- **job_teams** - Team collaborations
- **kick_votes** - Channel moderation votes
- **settings** - App settings

## Backup and Restore

### Manual Backup (Free Tier)
```bash
# Export all data
mongodump --uri="your-connection-string"

# Restore data
mongorestore --uri="your-connection-string" dump/
```

### Automatic Backups
- Available on paid tiers (M2+)
- Point-in-time recovery
- Scheduled snapshots

## Monitoring

In MongoDB Atlas dashboard:
- **Metrics**: View database performance
- **Real-time**: See active connections
- **Profiler**: Analyze slow queries
- **Alerts**: Set up notifications

## Cost

- **Free Tier (M0)**: $0/month
  - 512 MB storage
  - Shared resources
  - Perfect for development
  
- **Paid Tiers**: Start at $9/month
  - More storage
  - Dedicated resources
  - Automatic backups
  - Better performance

## Need Help?

1. **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
2. **Community Forums**: https://www.mongodb.com/community/forums/
3. **Support**: Available on paid tiers

## Quick Commands

```bash
# Setup MongoDB
./setup-mongodb-atlas.sh

# Test connection
python3 backend/test_mongodb.py

# Start backend
./start-backend.sh

# Test everything
python3 test-fixes.py
```

## Next Steps

1. ✅ Complete MongoDB Atlas setup
2. ✅ Test connection
3. ✅ Start backend
4. ✅ Run tests
5. ✅ Start frontend
6. ✅ Test full application

Your CryptoGig platform will now have persistent data storage with MongoDB!
