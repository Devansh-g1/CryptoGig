#!/bin/bash

echo "🔍 CryptoGig Status Check"
echo "========================"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js: Not installed"
fi

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "✅ Python: $PYTHON_VERSION"
else
    echo "❌ Python: Not installed"
fi

# Check MongoDB
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB: Running"
else
    echo "⚠️  MongoDB: Not running"
fi

# Check backend dependencies
echo ""
echo "🔧 Backend Dependencies:"
cd backend
if python3 -c "import fastapi, uvicorn, motor, pymongo" 2>/dev/null; then
    echo "✅ Backend dependencies: OK"
else
    echo "❌ Backend dependencies: Missing - run 'pip install -r requirements.txt'"
fi
cd ..

# Check frontend dependencies
echo ""
echo "🎨 Frontend Dependencies:"
if [ -d "frontend/node_modules" ]; then
    echo "✅ Frontend dependencies: Installed"
else
    echo "❌ Frontend dependencies: Missing - run './fix-dependencies.sh'"
fi

# Check environment files
echo ""
echo "⚙️  Environment Configuration:"
if [ -f "backend/.env" ]; then
    echo "✅ Backend .env: Exists"
else
    echo "❌ Backend .env: Missing"
fi

if [ -f "frontend/.env" ]; then
    echo "✅ Frontend .env: Exists"
else
    echo "❌ Frontend .env: Missing"
fi

# Check ports
echo ""
echo "🌐 Port Status:"
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 8000: In use (backend might be running)"
else
    echo "✅ Port 8000: Available"
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 3000: In use (frontend might be running)"
else
    echo "✅ Port 3000: Available"
fi

echo ""
echo "📋 Next Steps:"
if [ ! -f "backend/.env" ] || [ ! -f "frontend/.env" ]; then
    echo "1. Run './setup.sh' to configure environment"
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "2. Run './fix-dependencies.sh' to install frontend dependencies"
fi

if ! pgrep -x "mongod" > /dev/null; then
    echo "3. Start MongoDB:"
    echo "   macOS: brew services start mongodb-community"
    echo "   Linux: sudo systemctl start mongod"
fi

echo "4. Run './run.sh' to start the application"
echo "5. Run 'python create_test_accounts.py' to create test accounts"