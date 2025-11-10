#!/usr/bin/env python3
"""Verify a user"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://CryptoUser:Devansh%401234@cluster0.go4i2sx.mongodb.net/cryptogig_db?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true"

async def verify_user(email):
    client = AsyncIOMotorClient(MONGO_URL)
    db = client['cryptogig_db']
    
    result = await db.users.update_one(
        {"email": email},
        {"$set": {"email_verified": True, "is_verified": True}}
    )
    
    print(f"✅ Verified {email}: {result.modified_count} user(s) updated")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(verify_user("client@test.com"))
