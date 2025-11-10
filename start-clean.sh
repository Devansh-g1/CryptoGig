#!/bin/bash

echo "🚀 Starting CryptoGig (Clean Mode - No Wallet Errors)"
echo "===================================================="

# Stop any existing processes
echo "🛑 Stopping existing processes..."
pkill -f "uvicorn"
pkill -f "npm start"
pkill -f "craco start"

# Wait a moment
sleep 2

# Start backend
echo "🔧 Starting backend server..."
cd backend
python3 -m uvicorn server:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend with error suppression
echo "🎨 Starting frontend (with error suppression)..."
cd frontend

# Set environment variables to reduce errors
export GENERATE_SOURCEMAP=false
export DISABLE_ESLINT_PLUGIN=true

# Start with reduced warnings
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 CryptoGig is starting up (Clean Mode)!"
echo ""
echo "📍 Services:"
echo "   Backend:  http://localhost:8000"
echo "   Frontend: http://localhost:3000"
echo ""
echo "🔧 Improvements:"
echo "   ✅ Wallet errors suppressed"
echo "   ✅ Simplified wallet connection"
echo "   ✅ Better error handling"
echo ""
echo "🔑 Test Accounts:"
echo "   Client:     ruzan1224@gmail.com / test123"
echo "   Freelancer: devanshgoyal1234@gmail.com / test123"
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