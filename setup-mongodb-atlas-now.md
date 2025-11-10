# 🚀 Quick MongoDB Atlas Setup (5 minutes)

## Step 1: Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/atlas
2. Click "Try Free"
3. Sign up with Google or email

## Step 2: Create Cluster
1. Choose "M0 Sandbox" (FREE)
2. Choose any cloud provider (AWS recommended)
3. Choose region closest to you
4. Cluster Name: "Cluster0" (default is fine)
5. Click "Create Cluster"

## Step 3: Create Database User
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Authentication Method: "Password"
4. Username: `cryptogig`
5. Password: `CryptoGig2024` (IMPORTANT: No special characters!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

## Step 4: Configure Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere"
4. Confirm: 0.0.0.0/0
5. Click "Confirm"

## Step 5: Get Connection String
1. Go to "Clusters" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: "Python", Version: "3.12 or later"
5. Copy the connection string
6. It will look like: `mongodb+srv://cryptogig:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

## Step 6: Update Railway
Replace `<password>` with `CryptoGig2024` and add database name:

```bash
cd backend
railway variables --set "MONGO_URL=mongodb+srv://cryptogig:CryptoGig2024@cluster0.xxxxx.mongodb.net/cryptogig_db?retryWrites=true&w=majority"
```

**Replace `xxxxx` with your actual cluster identifier from the connection string!**

## Example Final Connection String:
```
mongodb+srv://cryptogig:CryptoGig2024@cluster0.abc123.mongodb.net/cryptogig_db?retryWrites=true&w=majority
```

After updating, Railway will automatically redeploy and your backend should work!