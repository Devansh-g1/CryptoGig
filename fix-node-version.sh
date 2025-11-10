#!/bin/bash

echo "🔧 Fixing Node.js Version Compatibility"
echo "======================================="

# Check current Node version
echo "Current Node.js version: $(node --version)"

# Check if nvm is available
if command -v nvm &> /dev/null; then
    echo "Using nvm to switch to Node 18..."
    nvm use 18
    if [ $? -ne 0 ]; then
        echo "Installing Node 18..."
        nvm install 18
        nvm use 18
    fi
elif command -v n &> /dev/null; then
    echo "Using n to switch to Node 18..."
    n 18
else
    echo "⚠️  Please install Node.js 18.x manually:"
    echo "   - Download from: https://nodejs.org/en/download/"
    echo "   - Or install nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    exit 1
fi

echo "New Node.js version: $(node --version)"

cd frontend

# Clean and reinstall with Node 18
echo "Cleaning and reinstalling dependencies..."
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Test build
echo "Testing build with Node 18..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful with Node 18!"
else
    echo "❌ Still having issues. Trying manual fix..."
fi