#!/usr/bin/env python3
"""
Script to create test accounts for CryptoGig
Run this after starting the backend server
"""

import requests
import json

API_BASE = "http://localhost:8000/api"

# Test accounts to create
test_accounts = [
    {
        "email": "client@cryptogig.com",
        "password": "test123",
        "name": "Test Client",
        "role": "client"
    },
    {
        "email": "freelancer@cryptogig.com", 
        "password": "test123",
        "name": "Test Freelancer",
        "role": "freelancer"
    },
    {
        "email": "devanshgoyal1234@gmail.com",
        "password": "test123", 
        "name": "Arbitrator",
        "role": "arbitrator"
    }
]

def create_account(account_data):
    """Create a test account"""
    try:
        response = requests.post(f"{API_BASE}/auth/register", json=account_data)
        if response.status_code == 200:
            data = response.json()
            if 'token' in data:
                print(f"✅ Created and logged in: {account_data['email']} ({account_data['role']})")
                return True
            else:
                print(f"✅ Created (verification required): {account_data['email']} ({account_data['role']})")
                return True
        else:
            error = response.json().get('detail', 'Unknown error')
            if 'already registered' in str(error):
                print(f"ℹ️  Already exists: {account_data['email']}")
                return True
            else:
                print(f"❌ Failed to create {account_data['email']}: {error}")
                return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Make sure it's running on http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Error creating {account_data['email']}: {e}")
        return False

def main():
    print("🚀 Creating CryptoGig test accounts...")
    print("=====================================")
    
    success_count = 0
    for account in test_accounts:
        if create_account(account):
            success_count += 1
    
    print(f"\n✅ Successfully processed {success_count}/{len(test_accounts)} accounts")
    
    if success_count > 0:
        print("\n🎉 Test accounts ready!")
        print("\n📋 Login credentials:")
        for account in test_accounts:
            print(f"   {account['role'].title()}: {account['email']} / {account['password']}")
        print("\n🌐 Access the app at: http://localhost:3000")

if __name__ == "__main__":
    main()