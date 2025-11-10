#!/bin/bash

echo "🚀 Starting CryptoGig Backend"
echo "=============================="
echo ""

# Check if MongoDB is configured
if grep -q "your_password_here" backend/.env; then
    echo "⚠️  MongoDB not configured in backend/.env"
    echo ""
    echo "Options:"
    echo "1. Use MongoDB Atlas (recommended for production)"
    echo "2. Use local MongoDB (if installed)"
    echo "3. Use in-memory storage (for quick testing)"
    echo ""
    read -p "Choose option (1/2/3): " choice
    
    case $choice in
        1)
            echo ""
            echo "📝 MongoDB Atlas Setup:"
            echo "1. Go to https://www.mongodb.com/cloud/atlas"
            echo "2. Create a free cluster"
            echo "3. Create a database user"
            echo "4. Whitelist your IP (or use 0.0.0.0/0 for all IPs)"
            echo "5. Get your connection string"
            echo ""
            read -p "Enter your MongoDB connection string: " mongo_url
            
            # Update .env file
            sed -i.bak "s|MONGO_URL=.*|MONGO_URL=$mongo_url|" backend/.env
            echo "✅ MongoDB URL updated in backend/.env"
            ;;
        2)
            echo ""
            echo "Using local MongoDB..."
            sed -i.bak "s|MONGO_URL=.*|MONGO_URL=mongodb://localhost:27017/cryptogig_db|" backend/.env
            echo "✅ Configured to use local MongoDB"
            echo "⚠️  Make sure MongoDB is running: brew services start mongodb-community"
            ;;
        3)
            echo ""
            echo "⚠️  Using in-memory storage (data will be lost on restart)"
            echo "For production, please configure MongoDB"
            
            # Create a simple in-memory version
            cat > backend/server_inmemory.py << 'EOF'
# Simple in-memory version for testing
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

# Mock MongoDB
class MockDB:
    def __init__(self):
        self.data = {}
    
    def __getattr__(self, name):
        if name not in self.data:
            self.data[name] = MockCollection()
        return self.data[name]

class MockCollection:
    def __init__(self):
        self.items = []
    
    async def find_one(self, query, projection=None):
        for item in self.items:
            if self._matches(item, query):
                return item
        return None
    
    async def find(self, query, projection=None):
        class MockCursor:
            def __init__(self, items):
                self.items = items
            async def to_list(self, length):
                return self.items
            def sort(self, field, direction):
                return self
        
        matches = [item for item in self.items if self._matches(item, query)]
        return MockCursor(matches)
    
    async def insert_one(self, doc):
        self.items.append(doc)
        return type('obj', (object,), {'inserted_id': 'mock_id'})
    
    async def update_one(self, query, update, upsert=False):
        for item in self.items:
            if self._matches(item, query):
                if '$set' in update:
                    item.update(update['$set'])
                if '$unset' in update:
                    for key in update['$unset']:
                        item.pop(key, None)
                if '$push' in update:
                    for key, value in update['$push'].items():
                        if key not in item:
                            item[key] = []
                        item[key].append(value)
                if '$pull' in update:
                    for key, value in update['$pull'].items():
                        if key in item and isinstance(item[key], list):
                            item[key] = [x for x in item[key] if x != value]
                if '$inc' in update:
                    for key, value in update['$inc'].items():
                        item[key] = item.get(key, 0) + value
                return
        if upsert:
            doc = query.copy()
            if '$set' in update:
                doc.update(update['$set'])
            self.items.append(doc)
    
    async def update_many(self, query, update):
        for item in self.items:
            if self._matches(item, query):
                if '$set' in update:
                    item.update(update['$set'])
    
    async def count_documents(self, query):
        return len([item for item in self.items if self._matches(item, query)])
    
    async def command(self, cmd):
        return {'ok': 1}
    
    def _matches(self, item, query):
        if not query:
            return True
        for key, value in query.items():
            if key == '$or':
                return any(self._matches(item, q) for q in value)
            elif key == '$in':
                return item.get(key) in value
            elif isinstance(value, dict):
                if '$in' in value:
                    return item.get(key) in value['$in']
                elif '$ne' in value:
                    return item.get(key) != value['$ne']
            elif item.get(key) != value:
                return False
        return True

# Patch the server to use in-memory storage
import backend.server as server_module
server_module.db = MockDB()
server_module.client = type('obj', (object,), {'close': lambda: None})

# Import and run the app
from backend.server import app
import uvicorn

if __name__ == "__main__":
    print("⚠️  Running with IN-MEMORY storage")
    print("📝 Data will be lost when server stops")
    print("🌐 Server starting on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
EOF
            
            cd backend
            python server_inmemory.py
            exit 0
            ;;
        *)
            echo "Invalid option"
            exit 1
            ;;
    esac
fi

# Start the server
echo ""
echo "🌐 Starting server on http://localhost:8000"
echo "📊 API docs available at http://localhost:8000/docs"
echo ""

cd backend
python -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload
