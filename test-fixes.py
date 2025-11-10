#!/usr/bin/env python3
"""
Test script to verify all fixes are working
"""
import requests
import time

API_BASE = "http://localhost:8000/api"

def test_registration_and_login():
    """Test that registration works and returns token"""
    print("\n=== Testing Registration (No Email Verification) ===")
    
    email = f"testuser{int(time.time())}@example.com"
    
    response = requests.post(f"{API_BASE}/auth/register", json={
        "email": email,
        "password": "test123",
        "name": "Test User",
        "role": "client"
    })
    
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Response: {data}")
    
    if response.status_code == 200 and 'token' in data:
        print("✅ Registration successful - got token immediately")
        return data['token'], email
    else:
        print("❌ Registration failed or no token returned")
        return None, None

def test_job_creation(token):
    """Test job creation with client role"""
    print("\n=== Testing Job Creation ===")
    
    response = requests.post(f"{API_BASE}/jobs", 
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Test Job",
            "description": "This is a test job",
            "budget_usdc": 100.0,
            "required_skills": ["Python", "FastAPI"]
        }
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        print("✅ Job created successfully")
        return True
    else:
        print("❌ Job creation failed")
        return False

def test_channel_creation(token):
    """Test community channel creation"""
    print("\n=== Testing Channel Creation ===")
    
    response = requests.post(f"{API_BASE}/channels",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Test Channel",
            "skill": "testing",
            "description": "A test channel"
        }
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        print("✅ Channel created successfully")
        return True
    else:
        print("❌ Channel creation failed")
        return False

def test_role_switch(token):
    """Test role switching"""
    print("\n=== Testing Role Switch ===")
    
    response = requests.post(f"{API_BASE}/auth/switch-role",
        headers={"Authorization": f"Bearer {token}"},
        json={"new_role": "freelancer"}
    )
    
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Response: {data}")
    
    if response.status_code == 200:
        print("✅ Role switched successfully")
        return True
    else:
        print("❌ Role switch failed")
        return False

def test_get_me(token):
    """Test getting current user"""
    print("\n=== Testing Get Current User ===")
    
    response = requests.get(f"{API_BASE}/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        print("✅ User data retrieved successfully")
        return True
    else:
        print("❌ Failed to get user data")
        return False

def main():
    print("=" * 60)
    print("Testing All Fixes")
    print("=" * 60)
    print("\nMake sure the backend is running on http://localhost:8000")
    print("And MongoDB is connected")
    
    input("\nPress Enter to start tests...")
    
    results = []
    
    # Test 1: Registration
    token, email = test_registration_and_login()
    results.append(("Registration (No Verification)", token is not None))
    
    if not token:
        print("\n❌ Cannot continue without token")
        return
    
    time.sleep(1)
    
    # Test 2: Get current user
    results.append(("Get Current User", test_get_me(token)))
    time.sleep(1)
    
    # Test 3: Job creation
    results.append(("Job Creation", test_job_creation(token)))
    time.sleep(1)
    
    # Test 4: Channel creation
    results.append(("Channel Creation", test_channel_creation(token)))
    time.sleep(1)
    
    # Test 5: Role switch
    results.append(("Role Switch", test_role_switch(token)))
    
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
        print("\n🎉 All tests passed! Everything is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Check the output above for details.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nTests interrupted by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
