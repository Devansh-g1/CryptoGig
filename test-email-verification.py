#!/usr/bin/env python3
"""
Test script for email verification flow
"""
import requests
import time

API_BASE = "http://localhost:8000/api"

def test_registration():
    """Test user registration"""
    print("\n=== Testing Registration ===")
    
    response = requests.post(f"{API_BASE}/auth/register", json={
        "email": "testuser@example.com",
        "password": "test123",
        "name": "Test User"
    })
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        data = response.json()
        if not data.get('email_verified', True):
            print("✅ Registration successful - email verification required")
            return True
        else:
            print("❌ User was auto-verified (should require verification)")
            return False
    else:
        print(f"❌ Registration failed: {response.json()}")
        return False

def test_login_unverified():
    """Test login with unverified email"""
    print("\n=== Testing Login (Unverified) ===")
    
    response = requests.post(f"{API_BASE}/auth/login", json={
        "email": "testuser@example.com",
        "password": "test123"
    })
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 403:
        print("✅ Login blocked - email verification required")
        return True
    else:
        print("❌ Login should be blocked for unverified users")
        return False

def test_resend_verification():
    """Test resending verification email"""
    print("\n=== Testing Resend Verification ===")
    
    response = requests.post(f"{API_BASE}/auth/resend-verification", json={
        "email": "testuser@example.com",
        "password": "test123"
    })
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        print("✅ Verification email resent")
        return True
    else:
        print(f"❌ Failed to resend: {response.json()}")
        return False

def main():
    print("=" * 60)
    print("Email Verification Test Suite")
    print("=" * 60)
    print("\nMake sure the backend is running on http://localhost:8000")
    print("\nNote: Check backend console for verification links")
    print("      (if SMTP is not configured)")
    
    input("\nPress Enter to start tests...")
    
    results = []
    
    # Test 1: Registration
    results.append(("Registration", test_registration()))
    time.sleep(1)
    
    # Test 2: Login without verification
    results.append(("Login Blocked", test_login_unverified()))
    time.sleep(1)
    
    # Test 3: Resend verification
    results.append(("Resend Verification", test_resend_verification()))
    
    # Summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    total = len(results)
    passed = sum(1 for _, p in results if p)
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed!")
        print("\nNext steps:")
        print("1. Check backend console for verification link")
        print("2. Copy the token from the link")
        print("3. Test verification endpoint:")
        print("   curl -X POST http://localhost:8000/api/auth/verify-email \\")
        print("     -H 'Content-Type: application/json' \\")
        print("     -d '{\"token\": \"<your-token>\"}'")
    else:
        print("\n⚠️  Some tests failed. Check the output above.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nTests interrupted by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
