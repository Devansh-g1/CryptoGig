#!/bin/bash

echo "🚀 CryptoGig Backend Quick Start"
echo "================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    exit 1
fi

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ backend directory not found"
    exit 1
fi

# Install dependencies if needed
echo "📦 Checking dependencies..."
cd backend

if [ ! -f "requirements.txt" ]; then
    echo "❌ requirements.txt not found"
    exit 1
fi

# Check if uvicorn is installed
if ! python3 -c "import uvicorn" 2>/dev/null; then
    echo "📥 Installing dependencies..."
    pip3 install -r requirements.txt
fi

# Check MongoDB configuration
echo ""
echo "🔍 Checking MongoDB configuration..."

if grep -q "your_password_here" .env; then
    echo ""
    echo "⚠️  MongoDB is not configured!"
    echo ""
    echo "You have 2 options:"
    echo ""
    echo "Option 1: Quick Test (In-Memory Storage)"
    echo "  - Data will be lost when server stops"
    echo "  - Good for testing"
    echo ""
    echo "Option 2: Setup MongoDB Atlas (Recommended)"
    echo "  - Free tier available"
    echo "  - Data persists"
    echo "  - Go to: https://www.mongodb.com/cloud/atlas"
    echo ""
    read -p "Use in-memory storage for testing? (y/n): " use_memory
    
    if [ "$use_memory" = "y" ] || [ "$use_memory" = "Y" ]; then
        echo ""
        echo "✅ Using in-memory storage"
        export USE_MEMORY_DB=true
    else
        echo ""
        echo "Please configure MongoDB in backend/.env"
        echo "Update the MONGO_URL line with your connection string"
        exit 1
    fi
else
    echo "✅ MongoDB configured"
fi

echo ""
echo "🌐 Starting server on http://localhost:8000"
echo "📊 API docs: http://localhost:8000/docs"
echo "❤️  Health check: http://localhost:8000/api/health"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start the server
python3 -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload
