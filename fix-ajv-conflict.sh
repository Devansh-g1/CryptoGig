#!/bin/bash

echo "🔧 Fixing AJV Dependency Conflict"
echo "================================="

cd frontend

# Step 1: Clean everything
echo "Cleaning node_modules and lock files..."
rm -rf node_modules package-lock.json yarn.lock

# Step 2: Fix the AJV version conflict
echo "Installing compatible AJV version..."
npm install ajv@^8.17.1 ajv-keywords@^5.1.0 --save

# Step 3: Install all dependencies with resolutions
echo "Installing all dependencies..."
npm install --legacy-peer-deps --no-audit --no-fund

# Step 4: Try building
echo "Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful! Dependencies fixed."
else
    echo "❌ Build still failing. Trying alternative fix..."
    
    # Alternative fix: downgrade Node.js compatibility
    echo "Trying with different AJV versions..."
    npm install ajv@^6.12.6 ajv-keywords@^3.5.2 --save
    npm run build
fi