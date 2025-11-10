# 🎉 Web App Testing Guide

## ✅ Your App is Running!

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## What to Test

### 1. User Registration & Login (No Email Verification!)

#### Test Registration
1. Open http://localhost:3000
2. Click **"Get Started"** or **"Register"**
3. Fill in the form:
   - **Email**: your-email@example.com
   - **Password**: test123
   - **Name**: Your Name
4. Click **"Create Account"**
5. ✅ **You should be logged in immediately** (no email verification!)
6. You'll be redirected to the dashboard

#### Test Login
1. If you're logged in, logout first
2. Click **"Login"**
3. Enter your credentials
4. Click **"Sign In"**
5. ✅ **You should be logged in immediately**

### 2. Role Switching

#### Switch Between Client and Freelancer
1. After logging in, look for the **Role Switcher** (usually in the header/navbar)
2. Click to switch between:
   - **Client** - Can post jobs
   - **Freelancer** - Can browse and accept jobs
3. ✅ **The dashboard should change based on your role**

### 3. Job Posting (As Client)

#### Create a Job
1. Make sure you're in **Client** role
2. Go to **"Post Job"** or **"Create Job"**
3. Fill in the job details:
   - **Title**: "Build a React App"
   - **Description**: "Need a developer to build a React application"
   - **Budget**: 500 (USDC)
   - **Skills**: Python, React, etc.
   - **Deadline**: Select a date
4. Click **"Post Job"** or **"Create Job"**
5. ✅ **Job should be created and appear in your jobs list**

#### View Your Jobs
1. Go to **"My Jobs"** or **"Dashboard"**
2. ✅ **You should see the job you just created**
3. Check the job details, status, and budget

### 4. Job Browsing (As Freelancer)

#### Browse Available Jobs
1. Switch to **Freelancer** role
2. Go to **"Browse Jobs"** or **"Find Work"**
3. ✅ **You should see available jobs** (including the one you created as client)
4. Click on a job to view details

#### Apply to a Job
1. Click on a job
2. Click **"Apply"** or **"Accept Job"**
3. Fill in your proposal (if required)
4. Submit application
5. ✅ **Application should be submitted successfully**

### 5. Community Channels

#### Create a Channel
1. Go to **"Community"** or **"Channels"**
2. Click **"Create Channel"**
3. Fill in:
   - **Name**: "Python Developers"
   - **Skill**: python
   - **Description**: "Channel for Python developers"
4. Click **"Create"**
5. ✅ **Channel should be created**

#### Join a Channel
1. Browse available channels
2. Click **"Join"** on a channel
3. ✅ **You should be added to the channel**

#### Send Messages
1. Open a channel you've joined
2. Type a message in the chat box
3. Click **"Send"**
4. ✅ **Message should appear in the chat**
5. ✅ **Message persists** (refresh page and it's still there)

### 6. Profile Management

#### Update Your Profile
1. Go to **"Profile"** or **"Settings"**
2. Update your information:
   - **Bio**: Add a description
   - **Skills**: Add your skills
   - **Hourly Rate**: Set your rate (for freelancers)
   - **Portfolio Link**: Add your portfolio URL
   - **GitHub Link**: Add your GitHub profile
3. Click **"Save"** or **"Update"**
4. ✅ **Profile should be updated**

### 7. Wallet Connection (Optional)

#### Connect MetaMask
1. Look for **"Connect Wallet"** button
2. Click it
3. Select MetaMask
4. Approve the connection
5. ✅ **Wallet should be connected**
6. Your wallet address should be displayed

## Key Features to Verify

### ✅ No Email Verification
- Register → Immediate login
- No "check your email" message
- No verification link needed

### ✅ Data Persistence
- Create a job → Refresh page → Job still there
- Send a message → Refresh page → Message still there
- Update profile → Refresh page → Changes saved

### ✅ Role Switching
- Switch from Client to Freelancer
- Dashboard changes accordingly
- Can perform role-specific actions

### ✅ Job Management
- Clients can create jobs
- Freelancers can browse jobs
- Freelancers can apply to jobs
- Job status updates correctly

### ✅ Community Features
- Create channels
- Join channels
- Send messages
- View members
- Messages persist

## Test Scenarios

### Scenario 1: Complete Job Flow
1. Register as Client
2. Create a job
3. Switch to Freelancer role
4. Browse and find your job
5. Apply to the job
6. Switch back to Client
7. View applications
8. Accept a freelancer

### Scenario 2: Community Interaction
1. Create a channel for a skill (e.g., "React Developers")
2. Join the channel
3. Send some messages
4. Refresh the page
5. Verify messages are still there
6. Create another user account
7. Join the same channel with the new user
8. Send messages from both accounts

### Scenario 3: Profile Setup
1. Register as Freelancer
2. Update your profile with bio, skills, rates
3. Add portfolio and GitHub links
4. Switch to Client role
5. Browse freelancers
6. Find your profile
7. Verify all information is displayed

## Common Issues & Solutions

### Issue: "Connection refused" or "Network Error"
**Solution**: Make sure backend is running
```bash
# Check if backend is running
curl http://localhost:8000/api/health

# If not, start it
cd backend
python3 -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

### Issue: "Cannot read property of undefined"
**Solution**: Clear browser cache and refresh
- Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)
- Or clear browser cache in settings

### Issue: Changes not appearing
**Solution**: 
1. Check browser console for errors (F12)
2. Verify backend is running
3. Check MongoDB connection
4. Refresh the page

### Issue: Wallet connection fails
**Solution**: 
1. Make sure MetaMask is installed
2. Switch to Polygon Amoy testnet
3. Try reconnecting

## MongoDB Data Verification

You can verify data is being saved by:

1. **MongoDB Atlas Dashboard**
   - Go to https://cloud.mongodb.com
   - Click on your cluster
   - Browse Collections
   - Check: users, jobs, channels, messages

2. **Backend API**
   - Visit http://localhost:8000/docs
   - Try API endpoints directly
   - View responses

## Browser Console

Open browser console (F12) to see:
- API requests
- Responses
- Any errors
- Network activity

## Testing Checklist

- [ ] Register new user (no email verification)
- [ ] Login with credentials
- [ ] Switch between Client and Freelancer roles
- [ ] Create a job as Client
- [ ] Browse jobs as Freelancer
- [ ] Apply to a job
- [ ] Create a community channel
- [ ] Join a channel
- [ ] Send messages in channel
- [ ] Update profile information
- [ ] Connect wallet (optional)
- [ ] Refresh page and verify data persists
- [ ] Logout and login again
- [ ] Create second user and test interactions

## What Should Work

✅ Instant registration (no email verification)
✅ Immediate login
✅ Job creation and listing
✅ Community channels and messaging
✅ Role switching
✅ Profile updates
✅ Data persistence in MongoDB
✅ No unexpected logouts
✅ Real-time updates

## What to Look For

### Good Signs ✅
- Smooth registration and login
- Jobs appear immediately after creation
- Messages appear in channels
- Data persists after refresh
- No error messages in console
- Fast page loads

### Red Flags ❌
- "Email not verified" errors (shouldn't happen)
- Jobs not appearing
- Messages not saving
- Getting logged out randomly
- Network errors
- Blank pages

## Need Help?

If you encounter issues:

1. **Check Backend Logs**
   - Look at the terminal where backend is running
   - Check for error messages

2. **Check Frontend Console**
   - Press F12 in browser
   - Look for errors in Console tab
   - Check Network tab for failed requests

3. **Check MongoDB**
   - Go to MongoDB Atlas dashboard
   - Verify data is being saved
   - Check collections

4. **Restart Services**
   ```bash
   # Stop backend (Ctrl+C)
   # Restart backend
   cd backend
   python3 -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload
   
   # Frontend should auto-reload
   # If not, stop (Ctrl+C) and restart
   cd frontend
   npm run dev
   ```

## Enjoy Testing! 🎉

Your CryptoGig platform is fully functional with:
- MongoDB Atlas for data persistence
- No email verification hassle
- Full job management
- Community features
- Role switching

Have fun testing all the features!
