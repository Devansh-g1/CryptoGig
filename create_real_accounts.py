#!/usr/bin/env python3
"""
Script to create real accounts for CryptoGig with your email addresses
Run this after starting the backend server
"""

import requests
import json

API_BASE = "http://localhost:8000/api"

def create_account(email, password, name, role):
    """Create a real account"""
    try:
        response = requests.post(f"{API_BASE}/auth/register", json={
            "email": email,
            "password": password,
            "name": name,
            "role": role
        })
        
        if response.status_code == 200:
            data = response.json()
            if 'token' in data:
                print(f"✅ Created and logged in: {email} ({role})")
                return True
            else:
                print(f"✅ Created: {email} ({role})")
                return True
        else:
            error = response.json().get('detail', 'Unknown error')
            if 'already registered' in str(error):
                print(f"ℹ️  Already exists: {email}")
                return True
            else:
                print(f"❌ Failed to create {email}: {error}")
                return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Make sure it's running on http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Error creating {email}: {e}")
        return False

def main():
    print("🚀 Creating CryptoGig accounts with your email addresses...")
    print("=========================================================")
    
    # Get user input for real email addresses
    print("\n📧 Enter your email addresses for testing:")
    print("(You can use the same email for multiple roles if you want)")
    
    client_email = input("Client email: ").strip()
    if not client_email:
        client_email = "client@example.com"
    
    freelancer_email = input("Freelancer email: ").strip()
    if not freelancer_email:
        freelancer_email = "freelancer@example.com"
    
    # Arbitrator is fixed to the designated email
    arbitrator_email = "devanshgoyal1234@gmail.com"
    
    password = input("Password for all accounts (default: test123): ").strip()
    if not password:
        password = "test123"
    
    print(f"\n🔧 Creating accounts with password: {password}")
    
    accounts = [
        {
            "email": client_email,
            "password": password,
            "name": "Client User",
            "role": "client"
        },
        {
            "email": freelancer_email,
            "password": password,
            "name": "Freelancer User",
            "role": "freelancer"
        },
        {
            "email": arbitrator_email,
            "password": password,
            "name": "Arbitrator",
            "role": "arbitrator"
        }
    ]
    
    success_count = 0
    for account in accounts:
        if create_account(account['email'], account['password'], account['name'], account['role']):
            success_count += 1
    
    print(f"\n✅ Successfully processed {success_count}/{len(accounts)} accounts")
    
    if success_count > 0:
        print("\n🎉 Accounts ready!")
        print("\n📋 Login credentials:")
        print(f"   Client: {client_email} / {password}")
        print(f"   Freelancer: {freelancer_email} / {password}")
        print(f"   Arbitrator: {arbitrator_email} / {password}")
        print("\n🌐 Access the app at: http://localhost:3000")
        print("\n✅ No email verification required - you can login immediately!")

if __name__ == "__main__":
    main()