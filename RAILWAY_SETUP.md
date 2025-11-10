# 🚂 Railway Setup Guide

## 🎯 **Current Issue**
You can't see project details on Railway because you need to login and set up the project properly.

## 🔧 **Step-by-Step Fix**

### **Step 1: Login to Railway**
```bash
railway login
```
This will open your browser and ask you to login with GitHub or email.

### **Step 2: Check Your Account**
```bash
railway whoami
```
This should show your Railway username.

### **Step 3: List Your Projects**
```bash
railway projects
```
This will show all your Railway projects.

### **Step 4: Create New Project (if needed)**
```bash
cd backend
railway init
```
Choose "Create new project" and name it "cryptogig-backend"

### **Step 5: Link to Existing Project (if you have one)**
```bash
cd backend
railway link
```
Select your existing project from the list.

### **Step 6: Check Project Status**
```bash
railway status
```
This will show your project details and deployment status.

---

## 🚀 **Deploy Backend to Railway**

### **Method 1: Quick Deploy**
```bash
cd backend
railway up
```

### **Method 2: With Environment Variables**
```bash
cd backend

# Set environment variables
railway variables set MONGO_URL="your_mongodb_connection_string"
railway variables set JWT_SECRET="$(openssl rand -base64 32)"
railway variables set SENDGRID_API_KEY="your_sendgrid_key"
railway variables set ARBITRATOR_WALLET="0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483"

# Deploy
railway up
```

---

## 🔍 **Troubleshooting**

### **Problem: "Unauthorized" Error**
**Solution**: Run `railway login` and authenticate with GitHub

### **Problem: "No projects found"**
**Solution**: Run `railway init` to create a new project

### **Problem: "Can't see project details"**
**Solution**: 
1. Make sure you're in the `backend` folder
2. Run `railway link` to connect to your project
3. Run `railway status` to see details

### **Problem: "Deployment failed"**
**Solution**: Check logs with `railway logs`

---

## 📊 **Railway Dashboard**

After successful setup, you can view your project at:
- **Dashboard**: https://railway.app/dashboard
- **Project URL**: https://railway.app/project/your-project-id

---

## 🌐 **Get Your Backend URL**

After deployment, get your backend URL:
```bash
railway status
```

Look for the "Deployments" section to find your live URL.

---

## ⚙️ **Environment Variables**

Set these in Railway dashboard or via CLI:

```bash
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/cryptogig_db
JWT_SECRET=your_32_character_secret
SENDGRID_API_KEY=SG.your_sendgrid_key
FROM_EMAIL=noreply@yourdomain.com
CORS_ORIGINS=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
ARBITRATOR_WALLET=0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483
```

---

## 🎉 **Success Indicators**

You'll know it's working when:
- ✅ `railway whoami` shows your username
- ✅ `railway status` shows project details
- ✅ `railway logs` shows server running
- ✅ Your backend URL responds with API data