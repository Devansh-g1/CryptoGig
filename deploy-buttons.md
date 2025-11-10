# 🚀 One-Click Deploy CryptoGig

## **Deploy to Production in 1 Click**

### **Deploy Backend to Railway**
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/cryptogig-backend)

### **Deploy Frontend to Vercel**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/cryptogig&project-name=cryptogig&repository-name=cryptogig)

---

## **Quick Setup After Deploy**

### **1. Configure Environment Variables**

#### **Railway (Backend)**
```
MONGO_URL=your_mongodb_atlas_connection
JWT_SECRET=random_32_character_string
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@yourdomain.com
ARBITRATOR_WALLET=0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483
```

#### **Vercel (Frontend)**
```
REACT_APP_BACKEND_URL=https://your-backend.railway.app
REACT_APP_WALLETCONNECT_PROJECT_ID=your_walletconnect_id
REACT_APP_CONTRACT_ADDRESS=your_contract_address
```

### **2. Test Your Deployment**
1. Visit your Vercel URL
2. Register with real email address
3. Check email for verification link
4. Verify and login
5. Test creating jobs and switching roles

---

**🎉 Your CryptoGig platform is now live with real email verification!**