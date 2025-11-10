# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/atlas
2. Sign up for a free account
3. Create a new cluster (choose the free tier)

## Step 2: Configure Database Access
1. Go to Database Access in the left sidebar
2. Click "Add New Database User"
3. Create a user with username and password
4. Give it "Read and write to any database" permissions

## Step 3: Configure Network Access
1. Go to Network Access in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Confirm the changes

## Step 4: Get Connection String
1. Go to Clusters in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `cryptogig_db`

## Example Connection String:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cryptogig_db?retryWrites=true&w=majority
```

## Step 5: Update Environment Variables
Update your backend/.env file with the connection string from Step 4.