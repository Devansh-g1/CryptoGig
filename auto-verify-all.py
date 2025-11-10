#!/usr/bin/env python3
"""
Auto-verify all pending accounts by directly updating the database
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv('backend/.env')

async def verify_all_accounts():
    """Auto-verify all unverified accounts"""
    try:
        mongo_url = os.environ['MONGO_URL']
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ['DB_NAME']]
        
        # Find all unverified users (except arbitrator)
        unverified_users = await db.users.find({
            'email_verified': {'$ne': True},
            'email': {'$ne': 'devanshgoyal1234@gmail.com'}
        }).to_list(1000)
        
        print(f"🔍 Found {len(unverified_users)} unverified accounts")
        
        if not unverified_users:
            print("✅ All accounts are already verified!")
            client.close()
            return
        
        # Verify all accounts
        result = await db.users.update_many(
            {
                'email_verified': {'$ne': True},
                'email': {'$ne': 'devanshgoyal1234@gmail.com'}
            },
            {'$set': {'email_verified': True}}
        )
        
        print(f"✅ Verified {result.modified_count} accounts!")
        
        # Clean up verification tokens
        await db.verification_tokens.delete_many({})
        print("🧹 Cleaned up verification tokens")
        
        # List all verified accounts
        all_users = await db.users.find({}, {'email': 1, 'name': 1, 'role': 1}).to_list(1000)
        
        print("\n🎉 All accounts are now ready to login!")
        print("=====================================")
        
        clients = [u for u in all_users if u.get('role') == 'client']
        freelancers = [u for u in all_users if u.get('role') == 'freelancer']
        arbitrators = [u for u in all_users if u.get('role') == 'arbitrator']
        
        if clients:
            print("\n👥 CLIENTS:")
            for user in clients:
                print(f"   • {user['email']} / test123 ({user['name']})")
        
        if freelancers:
            print("\n💻 FREELANCERS:")
            for user in freelancers:
                print(f"   • {user['email']} / test123 ({user['name']})")
        
        if arbitrators:
            print("\n⚖️  ARBITRATORS:")
            for user in arbitrators:
                print(f"   • {user['email']} / test123 ({user['name']})")
        
        print(f"\n🌐 Access the app at: http://localhost:3000")
        print("💡 All accounts are verified and ready to use!")
        
        client.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(verify_all_accounts())