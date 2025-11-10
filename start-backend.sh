#!/bin/bash

echo "🚀 Starting CryptoGig Backend"
echo "=============================="
echo ""

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ backend directory not found"
    exit 1
fi

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    exit 1
fi

echo "✅ Python 3 found"

# Check dependencies
echo "📦 Checking dependencies..."

# Check if required packages are installed
python3 -c "import fastapi, motor, uvicorn, bcrypt, jwt, pydantic" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "📥 Installing dependencies..."
    pip3 install -r backend/requirements.txt
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

echo "✅ Dependencies installed"
echo ""

# Test MongoDB connection
echo "🔍 Testing MongoDB connection..."
python3 backend/test_mongodb.py

if [ $? -ne 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "❌ MongoDB Connection Failed"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "You need to set up MongoDB Atlas first."
    echo ""
    read -p "Would you like to set up MongoDB now? (y/n): " setup_mongo
    
    if [ "$setup_mongo" = "y" ] || [ "$setup_mongo" = "Y" ]; then
        ./setup-mongodb-atlas.sh
        exit 0
    else
        echo ""
        echo "Please run: ./setup-mongodb-atlas.sh"
        echo "Or manually update backend/.env with your MongoDB connection string"
        exit 1
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All checks passed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Starting server on http://localhost:8000"
echo "📊 API Documentation: http://localhost:8000/docs"
echo "❤️  Health Check: http://localhost:8000/api/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
python3 -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload --app-dir backend
