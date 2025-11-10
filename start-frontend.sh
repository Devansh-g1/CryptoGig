#!/bin/bash

echo "🚀 Starting CryptoGig Frontend"
echo "=============================="
echo ""

# Check if node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing dependencies..."
    cd frontend
    npm install
    cd ..
fi

echo "✅ Dependencies ready"
echo ""
echo "🌐 Starting frontend on http://localhost:3000"
echo "🔗 Backend API: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

cd frontend
npm run dev
