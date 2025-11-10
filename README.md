# CryptoGig - Decentralized Freelance Platform

A blockchain-based freelance marketplace where clients and freelancers transact in cryptocurrency with smart contract escrow protection and professional arbitration.

## 🌟 Features

### For Clients
- **Post Jobs**: Create jobs and fund them with any ERC20 token
- **Auto-Conversion**: All payments automatically convert to USDC via Uniswap
- **Smart Escrow**: Funds locked in blockchain escrow until work completion
- **Dispute Resolution**: Raise disputes if work doesn't meet expectations

### For Freelancers
- **Browse Jobs**: Find and accept jobs that match your skills
- **Flexible Withdrawals**: Get paid in any crypto you prefer (USDC, ETH, MATIC, etc.)
- **Fair Protection**: Dispute mechanism protects your work
- **Instant Payments**: Funds released immediately after arbitrator approval

### For Arbitrators
- **Manage Disputes**: Review and resolve conflicts fairly
- **Release Funds**: Approve completed work for payment release
- **Earn Fees**: 5% fee on normal completions, 8% on dispute resolutions
- **Full Visibility**: Monitor all jobs and transactions

## 🏗️ Architecture

### Smart Contract
- **Blockchain**: Polygon (Amoy Testnet)
- **Escrow System**: Holds funds securely until release
- **Uniswap Integration**: Auto-swaps any token to USDC
- **Gas Optimized**: Minimal transaction costs
- **Security**: ReentrancyGuard, audited OpenZeppelin contracts

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB
- **Auth**: JWT tokens with bcrypt password hashing
- **Web3**: Integration with Polygon network

### Frontend
- **Framework**: React 19
- **Styling**: Tailwind CSS + Shadcn UI
- **Wallet**: RainbowKit (MetaMask, WalletConnect, etc.)
- **State**: React Query + Context API

## 🚀 Quick Start

### Prerequisites
1. **Node.js 18+** and npm/yarn
2. **Python 3.11+** with pip
3. **MongoDB** - Multiple options available:
   - **Quick Demo**: No installation needed (use `./run-demo.sh`)
   - **Docker**: `docker run --name cryptogig-mongodb -p 27017:27017 -d mongo:7.0`
   - **Homebrew**: See `MONGODB_SETUP.md` for detailed instructions
   - **Cloud**: MongoDB Atlas (free tier available)
4. **MetaMask wallet** (for testing)

### Automated Setup

#### Option 1: Full Setup (with MongoDB)
```bash
# Install MongoDB first, then:
./setup.sh
./run.sh
```

#### Option 2: Quick Demo (no MongoDB required)
```bash
# Just install frontend dependencies and run:
./fix-dependencies.sh
./run-demo.sh
```

### Manual Setup
```bash
# Backend
cd backend
pip install -r requirements.txt
python -m uvicorn server:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
npm start

# Access at http://localhost:3000
```

### Test Accounts
- **Client**: client@cryptogig.com / test123
- **Freelancer**: freelancer@cryptogig.com / test123  
- **Arbitrator**: devanshgoyal1234@gmail.com / test123

## 📝 Smart Contract Deployment

See `/app/contracts/README.md` for detailed deployment instructions.

## 🎮 User Guide

### Getting Started

1. **Visit the Landing Page** - http://localhost:3000
2. **Create Account** - Register with email and password  
3. **Connect Wallet** - Click "Connect Wallet" and approve MetaMask
4. **Switch Roles** - Use the role switcher to be both client and freelancer

### Complete Workflow

**Client → Freelancer → Arbitrator**

1. **Client**: Create job and fund with crypto (optional - works without blockchain)
2. **Freelancer**: Browse and accept jobs, complete work
3. **Arbitrator**: Review completed work and release funds
4. **Disputes**: Either party can raise disputes for fair resolution

### ✅ Fixed Issues

- **Role Switching**: No longer asks for login when switching between client/freelancer
- **Wallet Connection**: Improved error handling and user feedback
- **Environment Setup**: Automated setup scripts and comprehensive guides
- **Error Handling**: Better error messages and troubleshooting

## 🔒 Security Features

- Smart Contract Escrow with ReentrancyGuard
- JWT Authentication + Bcrypt
- Role-Based Access Control
- Gas-Optimized Transactions

## 💰 Fee Structure

- Normal Completion: 5% arbitrator fee
- Dispute Resolution: 8% arbitrator fee
- Optimized gas fees on Polygon

## 📊 Tech Stack

**Backend**: FastAPI + MongoDB + Web3.py
**Frontend**: React + RainbowKit + Shadcn UI
**Blockchain**: Solidity + Hardhat + Polygon
**Wallet**: RainbowKit (MetaMask, WalletConnect)

---

**CryptoGig** - Freelance with confidence, protected by blockchain.
