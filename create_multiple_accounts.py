#!/usr/bin/env python3
"""
Script to create multiple test accounts for CryptoGig
Run this after starting the backend server
"""

import requests
import json
import time

API_BASE = "http://localhost:8000/api"

# Multiple test accounts for different roles
test_accounts = [
    # Clients
    {
        "email": "client1@example.com",
        "password": "test123",
        "name": "Alice Johnson",
        "role": "client"
    },
    {
        "email": "client2@example.com", 
        "password": "test123",
        "name": "Bob Smith",
        "role": "client"
    },
    {
        "email": "startup@example.com",
        "password": "test123", 
        "name": "TechStartup Inc",
        "role": "client"
    },
    
    # Freelancers
    {
        "email": "dev1@example.com",
        "password": "test123",
        "name": "Sarah Developer",
        "role": "freelancer"
    },
    {
        "email": "designer@example.com",
        "password": "test123",
        "name": "Mike Designer", 
        "role": "freelancer"
    },
    {
        "email": "writer@example.com",
        "password": "test123",
        "name": "Emma Writer",
        "role": "freelancer"
    },
    {
        "email": "fullstack@example.com",
        "password": "test123",
        "name": "Alex Fullstack",
        "role": "freelancer"
    },
    
    # Arbitrator (auto-verified)
    {
        "email": "devanshgoyal1234@gmail.com",
        "password": "test123",
        "name": "Platform Arbitrator",
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
                print(f"✅ Created and auto-logged in: {account_data['email']} ({account_data['role']})")
                return True, "auto_login"
            else:
                print(f"📧 Created (verification required): {account_data['email']} ({account_data['role']})")
                return True, "verification_needed"
        else:
            error = response.json().get('detail', 'Unknown error')
            if 'already registered' in str(error):
                print(f"ℹ️  Already exists: {account_data['email']}")
                return True, "exists"
            else:
                print(f"❌ Failed to create {account_data['email']}: {error}")
                return False, "error"
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Make sure it's running on http://localhost:8000")
        return False, "connection_error"
    except Exception as e:
        print(f"❌ Error creating {account_data['email']}: {e}")
        return False, "exception"

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

def main():
    print("🚀 Creating Multiple CryptoGig Test Accounts...")
    print("===============================================")
    
    success_count = 0
    verification_needed = []
    
    for account in test_accounts:
        success, status = create_account(account)
        if success:
            success_count += 1
            if status == "verification_needed":
                verification_needed.append(account['email'])
        
        # Small delay between requests
        time.sleep(0.5)
    
    print(f"\n✅ Successfully processed {success_count}/{len(test_accounts)} accounts")
    
    if verification_needed:
        print(f"\n📧 Accounts needing email verification ({len(verification_needed)}):")
        for email in verification_needed:
            print(f"   • {email}")
        
        print("\n📋 How to verify accounts:")
        print("1. Check the backend console for verification links")
        print("2. Copy and paste the verification links in your browser")
        print("3. Accounts will be automatically verified")
        print("4. You can then login normally")
    
    print("\n🎉 Test accounts ready!")
    print("\n📋 Available test accounts:")
    print("\n👥 CLIENTS:")
    print("   • client1@example.com / test123 (Alice Johnson)")
    print("   • client2@example.com / test123 (Bob Smith)")
    print("   • startup@example.com / test123 (TechStartup Inc)")
    
    print("\n💻 FREELANCERS:")
    print("   • dev1@example.com / test123 (Sarah Developer)")
    print("   • designer@example.com / test123 (Mike Designer)")
    print("   • writer@example.com / test123 (Emma Writer)")
    print("   • fullstack@example.com / test123 (Alex Fullstack)")
    
    print("\n⚖️  ARBITRATOR:")
    print("   • devanshgoyal1234@gmail.com / test123 (Platform Arbitrator)")
    print("   • Wallet: 0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483")
    
    print("\n🌐 Access the app at: http://localhost:3000")
    print("\n💡 Note: Regular accounts need email verification, arbitrator is auto-verified")

if __name__ == "__main__":
    main()