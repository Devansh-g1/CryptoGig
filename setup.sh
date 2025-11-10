#!/bin/bash

echo "🚀 CryptoGig Setup Script"
echo "========================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+ first."
    exit 1
fi

# Check if MongoDB is installed and running
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB is not installed. Please install MongoDB first:"
    echo ""
    echo "   macOS:"
    echo "   brew tap mongodb/brew"
    echo "   brew install mongodb-community"
    echo "   brew services start mongodb-community"
    echo ""
    echo "   Linux (Ubuntu/Debian):"
    echo "   sudo apt-get install mongodb"
    echo "   sudo systemctl start mongod"
    echo ""
    echo "   Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas"
    echo ""
    exit 1
elif ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is installed but not running. Starting MongoDB..."
    if command -v brew &> /dev/null; then
        brew services start mongodb-community
    else
        echo "Please start MongoDB manually:"
        echo "   macOS: brew services start mongodb-community"
        echo "   Linux: sudo systemctl start mongod"
        exit 1
    fi
fi

echo "✅ Prerequisites check passed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
pip3 install -r requirements.txt
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
# Clear any existing node_modules and package-lock to avoid conflicts
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
cd ..

# Install contract dependencies
echo "📦 Installing contract dependencies..."
cd contracts
npm install
cd ..

echo "✅ Dependencies installed successfully!"

# Create environment files if they don't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend/.env file..."
    cp backend/.env.example backend/.env 2>/dev/null || echo "⚠️  Please create backend/.env manually"
fi

if [ ! -f "frontend/.env" ]; then
    echo "📝 Creating frontend/.env file..."
    cp frontend/.env.example frontend/.env 2>/dev/null || echo "⚠️  Please create frontend/.env manually"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your .env files:"
echo "   - backend/.env (MongoDB URL, JWT secret, etc.)"
echo "   - frontend/.env (Backend URL, WalletConnect Project ID)"
echo ""
echo "2. Start the services:"
echo "   Backend:  cd backend && python3 -m uvicorn server:app --reload --host 0.0.0.0 --port 8000"
echo "   Frontend: cd frontend && npm start"
echo ""
echo "3. Optional - Deploy smart contract:"
echo "   cd contracts && npm run deploy:amoy"
echo ""
echo "🌐 Access the app at: http://localhost:3000"
echo "📚 Read DEPLOYMENT_GUIDE.md for detailed instructions"