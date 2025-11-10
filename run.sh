#!/bin/bash

echo "🚀 Starting CryptoGig Application"
echo "================================"

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    fi
    return 0
}

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "❌ MongoDB is not running. Starting MongoDB..."
    # Try to start MongoDB (macOS with Homebrew)
    if command -v brew &> /dev/null; then
        brew services start mongodb-community
    else
        echo "Please start MongoDB manually:"
        echo "  macOS: brew services start mongodb-community"
        echo "  Linux: sudo systemctl start mongod"
        exit 1
    fi
fi

# Check ports
check_port 8000 || echo "Backend port 8000 is busy"
check_port 3000 || echo "Frontend port 3000 is busy"

echo "✅ Starting services..."

# Start backend in background
echo "🔧 Starting backend server..."
cd backend
python3 -m uvicorn server:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend in background
echo "🎨 Starting frontend server..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 CryptoGig is starting up!"
echo ""
echo "📍 Services:"
echo "   Backend:  http://localhost:8000"
echo "   Frontend: http://localhost:3000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "🔑 Test Accounts:"
echo "   Client:     client@cryptogig.com / test123"
echo "   Freelancer: freelancer@cryptogig.com / test123"
echo "   Arbitrator: devanshgoyal1234@gmail.com / test123"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait