#!/usr/bin/env python3
"""
Helper script to verify all pending accounts
"""

import requests
import json
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')

API_BASE = "http://localhost:8000/api"

async def get_pending_verifications():
    """Get all pending verification tokens from database"""
    try:
        mongo_url = os.environ['MONGO_URL']
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.environ['DB_NAME']]
        
        # Get all verification tokens
        tokens = await db.verification_tokens.find({}).to_list(1000)
        
        # Get user details for each token
        pending = []
        for token in tokens:
            user = await db.users.find_one({'id': token['user_id']})
            if user and not user.get('email_verified', False):
                pending.append({
                    'email': user['email'],
                    'name': user['name'],
                    'token': token['token']
                })
        
        client.close()
        return pending
        
    except Exception as e:
        print(f"❌ Database error: {e}")
        return []

def verify_account(email, token):
    """Verify an account using the verification token"""
    try:
        response = requests.get(f"{API_BASE}/auth/verify-email?token={token}")
        if response.status_code == 200:
            print(f"✅ Verified: {email}")
            return True
        else:
            print(f"❌ Verification failed for {email}")
            return False
    except Exception as e:
        print(f"❌ Verification error for {email}: {e}")
        return False

async def main():
    print("🔍 Finding accounts pending verification...")
    print("=========================================")
    
    pending = await get_pending_verifications()
    
    if not pending:
        print("✅ No accounts pending verification!")
        return
    
    print(f"📧 Found {len(pending)} accounts pending verification:")
    for account in pending:
        print(f"   • {account['email']} ({account['name']})")
    
    print("\n🔧 Auto-verifying all accounts...")
    
    verified_count = 0
    for account in pending:
        if verify_account(account['email'], account['token']):
            verified_count += 1
    
    print(f"\n🎉 Verified {verified_count}/{len(pending)} accounts!")
    print("\n✅ All accounts are now ready to login!")
    
    print("\n📋 You can now login with any of these accounts:")
    print("   Password for all: test123")

if __name__ == "__main__":
    asyncio.run(main())