#!/usr/bin/env python3
"""Check what's in the database"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://CryptoUser:Devansh%401234@cluster0.go4i2sx.mongodb.net/cryptogig_db?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true"

async def check_db():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client['cryptogig_db']
    
    print("=" * 60)
    print("Checking database users")
    print("=" * 60)
    
    # Get client@test.com user
    user = await db.users.find_one({"email": "client@test.com"})
    
    if user:
        print(f"\nUser: {user.get('email')}")
        print(f"Has 'password' field: {'password' in user}")
        print(f"Has 'password_hash' field: {'password_hash' in user}")
        print(f"Is verified: {user.get('is_verified', False)}")
        
        if 'password' in user:
            print(f"Password value (first 20 chars): {user['password'][:20]}...")
        if 'password_hash' in user:
            print(f"Password_hash value (first 20 chars): {user['password_hash'][:20]}...")
    else:
        print("User not found!")
    
    print("=" * 60)
    client.close()

if __name__ == "__main__":
    asyncio.run(check_db())
