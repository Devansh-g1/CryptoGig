#!/bin/bash

echo "🗄️  MongoDB Atlas Setup Guide"
echo "=============================="
echo ""
echo "Follow these steps to set up MongoDB Atlas:"
echo ""
echo "1️⃣  Create MongoDB Atlas Account"
echo "   → Go to: https://www.mongodb.com/cloud/atlas/register"
echo "   → Sign up for free (no credit card required)"
echo ""
echo "2️⃣  Create a Cluster"
echo "   → Click 'Build a Database'"
echo "   → Choose 'FREE' tier (M0)"
echo "   → Select a cloud provider and region (closest to you)"
echo "   → Click 'Create Cluster'"
echo ""
echo "3️⃣  Create Database User"
echo "   → Go to 'Database Access' in left sidebar"
echo "   → Click 'Add New Database User'"
echo "   → Choose 'Password' authentication"
echo "   → Username: cryptogig"
echo "   → Password: (generate a strong password)"
echo "   → User Privileges: 'Atlas admin' or 'Read and write to any database'"
echo "   → Click 'Add User'"
echo ""
echo "4️⃣  Whitelist IP Address"
echo "   → Go to 'Network Access' in left sidebar"
echo "   → Click 'Add IP Address'"
echo "   → Click 'Allow Access from Anywhere' (0.0.0.0/0)"
echo "   → Or add your specific IP address"
echo "   → Click 'Confirm'"
echo ""
echo "5️⃣  Get Connection String"
echo "   → Go to 'Database' in left sidebar"
echo "   → Click 'Connect' on your cluster"
echo "   → Choose 'Connect your application'"
echo "   → Driver: Python, Version: 3.12 or later"
echo "   → Copy the connection string"
echo "   → It looks like: mongodb+srv://cryptogig:<password>@cluster0.xxxxx.mongodb.net/"
echo ""
echo "6️⃣  Update .env File"
echo "   → Replace <password> with your actual password"
echo "   → Update backend/.env with your connection string"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "Have you completed the above steps? (y/n): " completed

if [ "$completed" != "y" ] && [ "$completed" != "Y" ]; then
    echo ""
    echo "Please complete the MongoDB Atlas setup first."
    echo "Run this script again when ready."
    exit 0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 Enter Your MongoDB Connection Details"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Paste your MongoDB connection string:"
echo "(Example: mongodb+srv://cryptogig:mypassword@cluster0.abc123.mongodb.net/)"
echo ""
read -p "Connection String: " mongo_url

if [ -z "$mongo_url" ]; then
    echo "❌ Connection string cannot be empty"
    exit 1
fi

# Validate connection string format
if [[ ! "$mongo_url" =~ ^mongodb(\+srv)?:// ]]; then
    echo "❌ Invalid MongoDB connection string format"
    echo "It should start with mongodb:// or mongodb+srv://"
    exit 1
fi

# Add database name if not present
if [[ ! "$mongo_url" =~ /cryptogig_db ]]; then
    # Remove trailing slash if present
    mongo_url="${mongo_url%/}"
    # Add database name
    mongo_url="${mongo_url}/cryptogig_db?retryWrites=true&w=majority"
fi

echo ""
echo "📝 Updating backend/.env..."

# Backup existing .env
cp backend/.env backend/.env.backup

# Update MONGO_URL in .env
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|MONGO_URL=.*|MONGO_URL=$mongo_url|" backend/.env
else
    # Linux
    sed -i "s|MONGO_URL=.*|MONGO_URL=$mongo_url|" backend/.env
fi

echo "✅ Configuration updated"
echo ""
echo "🧪 Testing MongoDB connection..."
echo ""

# Test the connection
python3 backend/test_mongodb.py

if [ $? -eq 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ MongoDB Setup Complete!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Next steps:"
    echo "1. Start the backend: ./start-backend.sh"
    echo "2. Test the API: python3 test-fixes.py"
    echo ""
else
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "❌ MongoDB Connection Failed"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Common issues:"
    echo "1. Wrong password in connection string"
    echo "2. IP address not whitelisted"
    echo "3. Database user not created"
    echo "4. Cluster not ready (wait a few minutes)"
    echo ""
    echo "Your old .env has been backed up to backend/.env.backup"
    echo ""
fi
