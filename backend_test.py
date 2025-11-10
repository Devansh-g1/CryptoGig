#!/usr/bin/env python3
"""
CryptoGig Backend API Testing Suite
Tests all backend endpoints according to test_result.md priorities
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL from environment
BACKEND_URL = "https://gig-blockchain.preview.emergentagent.com/api"

class CryptoGigTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.tokens = {}  # Store tokens for different users
        self.users = {}   # Store user data
        self.channels = {}  # Store channel data
        self.jobs = {}    # Store job data
        self.test_results = []
        
    def log_test(self, test_name, success, message, details=None):
        """Log test results"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'details': details
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def make_request(self, method, endpoint, data=None, headers=None, token=None):
        """Make HTTP request with proper error handling"""
        url = f"{self.base_url}{endpoint}"
        
        # Add authorization header if token provided
        if token:
            if headers is None:
                headers = {}
            headers['Authorization'] = f'Bearer {token}'
        
        try:
            if method.upper() == 'GET':
                response = self.session.get(url, headers=headers, params=data)
            elif method.upper() == 'POST':
                response = self.session.post(url, json=data, headers=headers)
            elif method.upper() == 'PUT':
                response = self.session.put(url, json=data, headers=headers)
            elif method.upper() == 'DELETE':
                response = self.session.delete(url, headers=headers)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            return response
        except requests.exceptions.RequestException as e:
            return None, str(e)
    
    def test_user_registration(self):
        """Test user registration endpoint"""
        print("\n=== Testing User Registration ===")
        
        # Test client registration
        client_data = {
            "email": "testclient@example.com",
            "password": "Test123!",
            "name": "Test Client",
            "role": "client"
        }
        
        response = self.make_request('POST', '/auth/register', client_data)
        if response and response.status_code == 200:
            data = response.json()
            if 'token' in data and 'user' in data:
                self.tokens['client'] = data['token']
                self.users['client'] = data['user']
                self.log_test("Client Registration", True, "Client registered successfully")
            else:
                self.log_test("Client Registration", False, "Missing token or user in response", data)
        else:
            error_msg = response.text if response else "Request failed"
            self.log_test("Client Registration", False, f"Registration failed: {response.status_code if response else 'No response'}", error_msg)
        
        # Test freelancer registration
        freelancer_data = {
            "email": "testfreelancer@example.com", 
            "password": "Test123!",
            "name": "Test Freelancer",
            "role": "freelancer"
        }
        
        response = self.make_request('POST', '/auth/register', freelancer_data)
        if response and response.status_code == 200:
            data = response.json()
            if 'token' in data and 'user' in data:
                self.tokens['freelancer'] = data['token']
                self.users['freelancer'] = data['user']
                self.log_test("Freelancer Registration", True, "Freelancer registered successfully")
            else:
                self.log_test("Freelancer Registration", False, "Missing token or user in response", data)
        else:
            error_msg = response.text if response else "Request failed"
            self.log_test("Freelancer Registration", False, f"Registration failed: {response.status_code if response else 'No response'}", error_msg)
    
    def test_user_login(self):
        """Test user login endpoint"""
        print("\n=== Testing User Login ===")
        
        # Test client login
        client_login = {
            "email": "testclient@example.com",
            "password": "Test123!"
        }
        
        response = self.make_request('POST', '/auth/login', client_login)
        if response and response.status_code == 200:
            data = response.json()
            if 'token' in data:
                self.tokens['client_login'] = data['token']
                self.log_test("Client Login", True, "Client login successful")
            else:
                self.log_test("Client Login", False, "Missing token in login response", data)
        else:
            error_msg = response.text if response else "Request failed"
            self.log_test("Client Login", False, f"Login failed: {response.status_code if response else 'No response'}", error_msg)
        
        # Test freelancer login
        freelancer_login = {
            "email": "testfreelancer@example.com",
            "password": "Test123!"
        }
        
        response = self.make_request('POST', '/auth/login', freelancer_login)
        if response and response.status_code == 200:
            data = response.json()
            if 'token' in data:
                self.tokens['freelancer_login'] = data['token']
                self.log_test("Freelancer Login", True, "Freelancer login successful")
            else:
                self.log_test("Freelancer Login", False, "Missing token in login response", data)
        else:
            error_msg = response.text if response else "Request failed"
            self.log_test("Freelancer Login", False, f"Login failed: {response.status_code if response else 'No response'}", error_msg)
    
    def test_auth_me(self):
        """Test auth/me endpoint"""
        print("\n=== Testing Auth Me Endpoint ===")
        
        # Test with client token
        if 'client' in self.tokens:
            response = self.make_request('GET', '/auth/me', token=self.tokens['client'])
            if response and response.status_code == 200:
                data = response.json()
                if 'id' in data and 'email' in data:
                    self.log_test("Auth Me (Client)", True, "Client auth/me successful")
                else:
                    self.log_test("Auth Me (Client)", False, "Missing user data in response", data)
            else:
                error_msg = response.text if response else "Request failed"
                self.log_test("Auth Me (Client)", False, f"Auth/me failed: {response.status_code if response else 'No response'}", error_msg)
        else:
            self.log_test("Auth Me (Client)", False, "No client token available", None)
        
        # Test with freelancer token
        if 'freelancer' in self.tokens:
            response = self.make_request('GET', '/auth/me', token=self.tokens['freelancer'])
            if response and response.status_code == 200:
                data = response.json()
                if 'id' in data and 'email' in data:
                    self.log_test("Auth Me (Freelancer)", True, "Freelancer auth/me successful")
                else:
                    self.log_test("Auth Me (Freelancer)", False, "Missing user data in response", data)
            else:
                error_msg = response.text if response else "Request failed"
                self.log_test("Auth Me (Freelancer)", False, f"Auth/me failed: {response.status_code if response else 'No response'}", error_msg)
        else:
            self.log_test("Auth Me (Freelancer)", False, "No freelancer token available", None)
    
    def test_channel_creation(self):
        """Test channel creation"""
        print("\n=== Testing Channel Creation ===")
        
        # Create React channel
        react_channel = {
            "name": "React Developers",
            "skill": "React",
            "description": "Channel for React developers"
        }
        
        if 'client' in self.tokens:
            response = self.make_request('POST', '/channels', react_channel, token=self.tokens['client'])
            if response and response.status_code == 200:
                data = response.json()
                if 'channel_id' in data:
                    self.channels['react'] = data['channel_id']
                    self.log_test("Create React Channel", True, "React channel created successfully")
                else:
                    self.log_test("Create React Channel", False, "Missing channel_id in response", data)
            else:
                error_msg = response.text if response else "Request failed"
                self.log_test("Create React Channel", False, f"Channel creation failed: {response.status_code if response else 'No response'}", error_msg)
        else:
            self.log_test("Create React Channel", False, "No client token available", None)
        
        # Create Python channel
        python_channel = {
            "name": "Python Experts",
            "skill": "Python",
            "description": "Channel for Python developers"
        }
        
        if 'freelancer' in self.tokens:
            response = self.make_request('POST', '/channels', python_channel, token=self.tokens['freelancer'])
            if response and response.status_code == 200:
                data = response.json()
                if 'channel_id' in data:
                    self.channels['python'] = data['channel_id']
                    self.log_test("Create Python Channel", True, "Python channel created successfully")
                else:
                    self.log_test("Create Python Channel", False, "Missing channel_id in response", data)
            else:
                error_msg = response.text if response else "Request failed"
                self.log_test("Create Python Channel", False, f"Channel creation failed: {response.status_code if response else 'No response'}", error_msg)
        else:
            self.log_test("Create Python Channel", False, "No freelancer token available", None)
    
    def test_channel_listing(self):
        """Test channel listing"""
        print("\n=== Testing Channel Listing ===")
        
        # Test list all channels
        response = self.make_request('GET', '/channels')
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log_test("List All Channels", True, f"Retrieved {len(data)} channels")
            else:
                self.log_test("List All Channels", False, "Response is not a list", data)
        else:
            error_msg = response.text if response else "Request failed"
            self.log_test("List All Channels", False, f"Channel listing failed: {response.status_code if response else 'No response'}", error_msg)
        
        # Test filter by skill
        response = self.make_request('GET', '/channels', {'skill': 'react'})
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log_test("Filter Channels by Skill", True, f"Retrieved {len(data)} React channels")
            else:
                self.log_test("Filter Channels by Skill", False, "Response is not a list", data)
        else:
            error_msg = response.text if response else "Request failed"
            self.log_test("Filter Channels by Skill", False, f"Channel filtering failed: {response.status_code if response else 'No response'}", error_msg)
    
    def test_channel_join(self):
        """Test channel join functionality"""
        print("\n=== Testing Channel Join ===")
        
        # Freelancer joins React channel (created by client)
        if 'react' in self.channels and 'freelancer' in self.tokens:
            response = self.make_request('POST', f'/channels/{self.channels["react"]}/join', token=self.tokens['freelancer'])
            if response and response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_test("Join React Channel", True, "Freelancer joined React channel successfully")
                else:
                    self.log_test("Join React Channel", False, "Join operation not successful", data)
            else:
                error_msg = response.text if response else "Request failed"
                self.log_test("Join React Channel", False, f"Channel join failed: {response.status_code if response else 'No response'}", error_msg)
        else:
            self.log_test("Join React Channel", False, "Missing channel ID or freelancer token", None)
        
        # Client joins Python channel (created by freelancer)
        if 'python' in self.channels and 'client' in self.tokens:
            response = self.make_request('POST', f'/channels/{self.channels["python"]}/join', token=self.tokens['client'])
            if response and response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_test("Join Python Channel", True, "Client joined Python channel successfully")
                else:
                    self.log_test("Join Python Channel", False, "Join operation not successful", data)
            else:
                error_msg = response.text if response else "Request failed"
                self.log_test("Join Python Channel", False, f"Channel join failed: {response.status_code if response else 'No response'}", error_msg)
        else:
            self.log_test("Join Python Channel", False, "Missing channel ID or client token", None)
    
    def test_messaging(self):
        """Test messaging functionality"""
        print("\n=== Testing Messaging ===")
        
        # Send message in React channel
        if 'react' in self.channels and 'freelancer' in self.tokens:
            message_data = {"content": "Hello React developers! Excited to collaborate on projects."}
            response = self.make_request('POST', f'/channels/{self.channels["react"]}/messages', message_data, token=self.tokens['freelancer'])
            if response and response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_test("Send Message (React)", True, "Message sent successfully in React channel")
                else:
                    self.log_test("Send Message (React)", False, "Message send not successful", data)
            else:
                error_msg = response.text if response else "Request failed"
                self.log_test("Send Message (React)", False, f"Message send failed: {response.status_code if response else 'No response'}", error_msg)
        
        # Send message in Python channel
        if 'python' in self.channels and 'client' in self.tokens:
            message_data = {"content": "Looking for Python experts for a new project!"}
            response = self.make_request('POST', f'/channels/{self.channels["python"]}/messages', message_data, token=self.tokens['client'])
            if response and response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_test("Send Message (Python)", True, "Message sent successfully in Python channel")
                else:
                    self.log_test("Send Message (Python)", False, "Message send not successful", data)
            else:
                error_msg = response.text if response else "Request failed"
                self.log_test("Send Message (Python)", False, f"Message send failed: {response.status_code if response else 'No response'}", error_msg)
        
        # Retrieve messages from React channel
        if 'react' in self.channels and 'client' in self.tokens:
            response = self.make_request('GET', f'/channels/{self.channels["react"]}/messages', token=self.tokens['client'])
            if response and response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Retrieve Messages (React)", True, f"Retrieved {len(data)} messages from React channel")
                else:
                    self.log_test("Retrieve Messages (React)", False, "Response is not a list", data)
            else:
                error_msg = response.text if response else "Request failed"
                self.log_test("Retrieve Messages (React)", False, f"Message retrieval failed: {response.status_code if response else 'No response'}", error_msg)
    
    def test_vote_to_kick(self):
        """Test vote-to-kick functionality"""
        print("\n=== Testing Vote to Kick ===")
        
        # Create a vote to kick in React channel (client votes to kick freelancer)
        if 'react' in self.channels and 'client' in self.tokens and 'freelancer' in self.users:
            vote_data = {
                "target_user_id": self.users['freelancer']['id'],
                "reason": "Testing vote-to-kick functionality"
            }
            response = self.make_request('POST', f'/channels/{self.channels["react"]}/vote-kick', vote_data, token=self.tokens['client'])
            if response and response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_test("Vote to Kick", True, f"Vote created: {data.get('message', 'Success')}")
                else:
                    self.log_test("Vote to Kick", False, "Vote creation not successful", data)
            else:
                error_msg = response.text if response else "Request failed"
                self.log_test("Vote to Kick", False, f"Vote creation failed: {response.status_code if response else 'No response'}", error_msg)
        else:
            self.log_test("Vote to Kick", False, "Missing required data for vote-to-kick test", None)
    
    def test_channel_leave(self):
        """Test channel leave functionality"""
        print("\n=== Testing Channel Leave ===")
        
        # Freelancer leaves React channel
        if 'react' in self.channels and 'freelancer' in self.tokens:
            response = self.make_request('POST', f'/channels/{self.channels["react"]}/leave', token=self.tokens['freelancer'])
            if response and response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_test("Leave Channel", True, "Freelancer left React channel successfully")
                else:
                    self.log_test("Leave Channel", False, "Leave operation not successful", data)
            else:
                error_msg = response.text if response else "Request failed"
                self.log_test("Leave Channel", False, f"Channel leave failed: {response.status_code if response else 'No response'}", error_msg)
        else:
            self.log_test("Leave Channel", False, "Missing channel ID or freelancer token", None)
    
    def test_profile_management(self):
        """Test profile view and update"""
        print("\n=== Testing Profile Management ===")
        
        # Test profile view
        if 'client' in self.users:
            response = self.make_request('GET', f'/profile/{self.users["client"]["id"]}')
            if response and response.status_code == 200:
                data = response.json()
                if 'id' in data and 'email' in data:
                    self.log_test("View Profile", True, "Profile retrieved successfully")
                else:
                    self.log_test("View Profile", False, "Missing profile data", data)
            else:
                error_msg = response.text if response else "Request failed"
                self.log_test("View Profile", False, f"Profile view failed: {response.status_code if response else 'No response'}", error_msg)
        
        # Test profile update
        if 'freelancer' in self.tokens:
            update_data = {
                "bio": "Experienced full-stack developer specializing in React and Python",
                "portfolio_link": "https://portfolio.example.com",
                "github_link": "https://github.com/testfreelancer",
                "skills": ["React", "Python", "Node.js", "MongoDB"]
            }
            response = self.make_request('PUT', '/profile', update_data, token=self.tokens['freelancer'])
            if response and response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_test("Update Profile", True, "Profile updated successfully")
                else:
                    self.log_test("Update Profile", False, "Profile update not successful", data)
            else:
                error_msg = response.text if response else "Request failed"
                self.log_test("Update Profile", False, f"Profile update failed: {response.status_code if response else 'No response'}", error_msg)
    
    def test_role_switching(self):
        """Test role switching functionality"""
        print("\n=== Testing Role Switching ===")
        
        # Switch client to freelancer
        if 'client' in self.tokens:
            switch_data = {"new_role": "freelancer"}
            response = self.make_request('POST', '/auth/switch-role', switch_data, token=self.tokens['client'])
            if response and response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_test("Switch Role (Client->Freelancer)", True, "Role switched successfully")
                else:
                    self.log_test("Switch Role (Client->Freelancer)", False, "Role switch not successful", data)
            else:
                error_msg = response.text if response else "Request failed"
                self.log_test("Switch Role (Client->Freelancer)", False, f"Role switch failed: {response.status_code if response else 'No response'}", error_msg)
        
        # Switch freelancer to client
        if 'freelancer' in self.tokens:
            switch_data = {"new_role": "client"}
            response = self.make_request('POST', '/auth/switch-role', switch_data, token=self.tokens['freelancer'])
            if response and response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_test("Switch Role (Freelancer->Client)", True, "Role switched successfully")
                else:
                    self.log_test("Switch Role (Freelancer->Client)", False, "Role switch not successful", data)
            else:
                error_msg = response.text if response else "Request failed"
                self.log_test("Switch Role (Freelancer->Client)", False, f"Role switch failed: {response.status_code if response else 'No response'}", error_msg)
    
    def test_job_management(self):
        """Test job creation, listing, and details"""
        print("\n=== Testing Job Management ===")
        
        # Create job (as client)
        if 'client' in self.tokens:
            job_data = {
                "title": "React Frontend Development",
                "description": "Need an experienced React developer to build a modern web application with responsive design and API integration.",
                "budget_usdc": 2500.0,
                "required_skills": ["React", "JavaScript", "CSS", "API Integration"]
            }
            response = self.make_request('POST', '/jobs', job_data, token=self.tokens['client'])
            if response and response.status_code == 200:
                data = response.json()
                if 'id' in data:
                    self.jobs['react_job'] = data['id']
                    self.log_test("Create Job", True, "Job created successfully")
                else:
                    self.log_test("Create Job", False, "Missing job ID in response", data)
            else:
                error_msg = response.text if response else "Request failed"
                self.log_test("Create Job", False, f"Job creation failed: {response.status_code if response else 'No response'}", error_msg)
        
        # List jobs
        if 'freelancer' in self.tokens:
            response = self.make_request('GET', '/jobs', token=self.tokens['freelancer'])
            if response and response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("List Jobs", True, f"Retrieved {len(data)} jobs")
                else:
                    self.log_test("List Jobs", False, "Response is not a list", data)
            else:
                error_msg = response.text if response else "Request failed"
                self.log_test("List Jobs", False, f"Job listing failed: {response.status_code if response else 'No response'}", error_msg)
        
        # Get job details
        if 'react_job' in self.jobs and 'freelancer' in self.tokens:
            response = self.make_request('GET', f'/jobs/{self.jobs["react_job"]}', token=self.tokens['freelancer'])
            if response and response.status_code == 200:
                data = response.json()
                if 'id' in data and 'title' in data:
                    self.log_test("Get Job Details", True, "Job details retrieved successfully")
                else:
                    self.log_test("Get Job Details", False, "Missing job data", data)
            else:
                error_msg = response.text if response else "Request failed"
                self.log_test("Get Job Details", False, f"Job details failed: {response.status_code if response else 'No response'}", error_msg)
    
    def run_all_tests(self):
        """Run all tests in priority order"""
        print("🚀 Starting CryptoGig Backend API Tests")
        print(f"Backend URL: {self.base_url}")
        print("=" * 60)
        
        # Priority 1: Authentication Flow
        self.test_user_registration()
        self.test_user_login()
        self.test_auth_me()
        
        # Priority 2: Community Channels (High Priority)
        self.test_channel_creation()
        self.test_channel_listing()
        self.test_channel_join()
        self.test_messaging()
        self.test_vote_to_kick()
        self.test_channel_leave()
        
        # Priority 3: Profile & Role Switching
        self.test_profile_management()
        self.test_role_switching()
        
        # Priority 4: Job Management
        self.test_job_management()
        
        # Summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("🏁 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n✅ PASSED TESTS:")
        for result in self.test_results:
            if result['success']:
                print(f"  - {result['test']}")

if __name__ == "__main__":
    tester = CryptoGigTester()
    tester.run_all_tests()