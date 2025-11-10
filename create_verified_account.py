#!/usr/bin/env python3
"""
Create a verified account directly in MongoDB
"""
import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt
from datetime import datetime, timezone
import uuid

# MongoDB connection
MONGO_URL = "mongodb+srv://CryptoUser:Devansh%401234@cluster0.go4i2sx.mongodb.net/cryptogig_db?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true"

async def create_verified_user(email, password, name, role="client"):
    """Create a verified user account"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client['cryptogig_db']
    
    # Check if user exists
    existing = await db.users.find_one({"email": email})
    if existing:
        print(f"❌ User {email} already exists!")
        print(f"   User ID: {existing.get('id')}")
        print(f"   Verified: {existing.get('is_verified', False)}")
        
        # Update to verified
        await db.users.update_one(
            {"email": email},
            {"$set": {"is_verified": True}}
        )
        print(f"✅ Updated {email} to verified status")
        return existing.get('id')
    
    # Hash password
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    # Create user
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "email": email,
        "password": hashed.decode('utf-8'),
        "name": name,
        "role": role,
        "is_verified": True,  # Already verified!
        "wallet_address": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "bio": "",
        "skills": [],
        "hourly_rate": 0,
        "portfolio_url": "",
        "github_url": "",
        "linkedin_url": ""
    }
    
    await db.users.insert_one(user_doc)
    print(f"✅ Created verified user: {email}")
    print(f"   User ID: {user_id}")
    print(f"   Password: {password}")
    print(f"   Role: {role}")
    
    client.close()
    return user_id

async def main():
    print("=" * 60)
    print("Creating Verified Test Accounts")
    print("=" * 60)
    
    # Create test accounts
    accounts = [
        ("client@test.com", "Password123!", "Test Client", "client"),
        ("freelancer@test.com", "Password123!", "Test Freelancer", "freelancer"),
        ("admin@test.com", "Password123!", "Test Admin", "client"),
    ]
    
    for email, password, name, role in accounts:
        await create_verified_user(email, password, name, role)
        print()
    
    print("=" * 60)
    print("✅ All accounts created and verified!")
    print("=" * 60)
    print("\nYou can now login with:")
    print("  Email: client@test.com")
    print("  Password: Password123!")
    print("\n  OR")
    print("\n  Email: freelancer@test.com")
    print("  Password: Password123!")

if __name__ == "__main__":
    asyncio.run(main())
