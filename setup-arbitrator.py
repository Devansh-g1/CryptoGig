#!/usr/bin/env python3
"""
Script to setup arbitrator account with wallet address
"""

import requests
import json

API_BASE = "http://localhost:8000/api"
ARBITRATOR_WALLET = "0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483"

def setup_arbitrator():
    """Setup arbitrator account and link wallet"""
    
    print("🔧 Setting up Arbitrator Account")
    print("================================")
    print(f"Arbitrator Wallet: {ARBITRATOR_WALLET}")
    print("")
    
    # 1. Create/Login arbitrator account
    try:
        # Try to login first
        login_response = requests.post(f"{API_BASE}/auth/login", json={
            "email": "devanshgoyal1234@gmail.com",
            "password": "test123"
        })
        
        if login_response.status_code == 200:
            print("✅ Arbitrator account exists, logging in...")
            token = login_response.json()['token']
        else:
            print("📝 Creating arbitrator account...")
            register_response = requests.post(f"{API_BASE}/auth/register", json={
                "email": "devanshgoyal1234@gmail.com",
                "password": "test123",
                "name": "Arbitrator",
                "role": "arbitrator"
            })
            
            if register_response.status_code == 200:
                token = register_response.json()['token']
                print("✅ Arbitrator account created!")
            else:
                print("❌ Failed to create arbitrator account")
                return False
        
        # 2. Link wallet address
        print(f"🔗 Linking wallet address: {ARBITRATOR_WALLET}")
        
        wallet_response = requests.post(f"{API_BASE}/auth/link-wallet", 
            json={"wallet_address": ARBITRATOR_WALLET},
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if wallet_response.status_code == 200:
            print("✅ Wallet linked successfully!")
        else:
            print("⚠️  Wallet linking failed, but account exists")
        
        # 3. Verify setup
        me_response = requests.get(f"{API_BASE}/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if me_response.status_code == 200:
            user_data = me_response.json()
            print("")
            print("🎉 Arbitrator Setup Complete!")
            print("============================")
            print(f"Email: {user_data['email']}")
            print(f"Role: {user_data['role']}")
            print(f"Wallet: {user_data.get('wallet_address', 'Not linked')}")
            print("")
            print("🔑 Access Methods:")
            print("1. Login with email: devanshgoyal1234@gmail.com / test123")
            print(f"2. Connect wallet: {ARBITRATOR_WALLET}")
            print("")
            print("✅ Arbitrator can now access all portals!")
            return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Make sure it's running on http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    setup_arbitrator()