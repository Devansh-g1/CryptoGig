#!/bin/bash

echo "🚀 Starting CryptoGig with Docker MongoDB"
echo "========================================="

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    fi
    return 0
}

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "🐳 Starting MongoDB with Docker..."
docker-compose up -d mongodb

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
sleep 5

# Check if MongoDB is accessible
if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" >/dev/null 2>&1; then
    echo "✅ MongoDB is ready!"
else
    echo "⚠️  MongoDB is starting up, continuing anyway..."
fi

# Check ports for backend and frontend
check_port 8000 || echo "Backend port 8000 is busy"
check_port 3000 || echo "Frontend port 3000 is busy"

echo "✅ Starting application services..."

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
echo "   MongoDB:  docker container (cryptogig-mongodb)"
echo "   Backend:  http://localhost:8000"
echo "   Frontend: http://localhost:3000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "🔑 Test Accounts (run create_test_accounts.py to create):"
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
    echo "🐳 Stopping MongoDB container..."
    docker-compose stop mongodb
    echo "✅ Services stopped"
    echo ""
    echo "💡 To completely remove MongoDB data: docker-compose down -v"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait