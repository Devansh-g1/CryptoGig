#!/bin/bash

echo "🚀 Deploying Temporary Backend (No Database)"
echo "============================================"

cd backend

# Backup original server
cp server.py server_original.py

# Create temporary server without MongoDB
cat > server.py << 'EOF'
from fastapi import FastAPI, APIRouter, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timezone
import jwt
import bcrypt
import uuid

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# In-memory storage (temporary)
users_db = {}
JWT_SECRET = "temp-secret-key"

class UserRegister(BaseModel):
    email: str
    password: str
    role: str = "client"

class UserLogin(BaseModel):
    email: str
    password: str

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "database": "in_memory",
        "service": "cryptogig-backend"
    }

# Registration endpoint
@api_router.post("/auth/register")
async def register(user: UserRegister):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Hash password
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    
    # Store user
    users_db[user.email] = {
        "id": str(uuid.uuid4()),
        "email": user.email,
        "password": hashed_password,
        "role": user.role,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    return {"message": "User registered successfully", "email": user.email}

# Login endpoint
@api_router.post("/auth/login")
async def login(user: UserLogin):
    if user.email not in users_db:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    stored_user = users_db[user.email]
    
    # Check password
    if not bcrypt.checkpw(user.password.encode('utf-8'), stored_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create JWT token
    token = jwt.encode({
        "user_id": stored_user["id"],
        "email": stored_user["email"],
        "role": stored_user["role"]
    }, JWT_SECRET, algorithm="HS256")
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": stored_user["id"],
            "email": stored_user["email"],
            "role": stored_user["role"]
        }
    }

# Include router
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
EOF

echo "✅ Created temporary backend without MongoDB"
echo "🚀 Deploying to Railway..."

railway up --detach

echo "✅ Temporary backend deployed!"
echo ""
echo "🧪 Test it:"
echo "curl https://cryptogig-production.up.railway.app/api/health"
echo ""
echo "⚠️  This is temporary - data will be lost on restart"
echo "📝 Set up MongoDB Atlas for permanent solution"