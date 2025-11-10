#!/usr/bin/env python3
"""
Fix database - rename 'password' field to 'password_hash' for all users
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://CryptoUser:Devansh%401234@cluster0.go4i2sx.mongodb.net/cryptogig_db?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true"

async def fix_passwords():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client['cryptogig_db']
    
    print("=" * 60)
    print("Fixing password field names in database")
    print("=" * 60)
    
    # Find all users with 'password' field (old format)
    users_with_old_field = await db.users.find({"password": {"$exists": True}}).to_list(None)
    
    print(f"\nFound {len(users_with_old_field)} users with old 'password' field")
    
    fixed_count = 0
    for user in users_with_old_field:
        # Rename 'password' to 'password_hash'
        await db.users.update_one(
            {"_id": user["_id"]},
            {
                "$rename": {"password": "password_hash"},
                "$set": {"is_verified": True}  # Also set verified
            }
        )
        fixed_count += 1
        print(f"✅ Fixed user: {user.get('email', 'unknown')}")
    
    print(f"\n✅ Fixed {fixed_count} users")
    print("=" * 60)
    
    client.close()

if __name__ == "__main__":
    asyncio.run(fix_passwords())
