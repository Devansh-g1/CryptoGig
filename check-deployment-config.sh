#!/bin/bash

echo "🔍 CryptoGig Deployment Configuration Checker"
echo "============================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

ISSUES=0

echo "📋 Checking backend configuration..."

# Check backend .env file
if [ -f "backend/.env" ]; then
    print_status "Backend .env file exists"
    
    # Check MongoDB URL
    if grep -q "MONGO_URL=mongodb+srv://" backend/.env; then
        print_status "MongoDB Atlas connection string format looks correct"
    elif grep -q "MONGO_URL=your_new_mongodb_connection_string_here" backend/.env; then
        print_error "MongoDB URL is still using placeholder value"
        echo "  Please update MONGO_URL in backend/.env with your Atlas connection string"
        ISSUES=$((ISSUES + 1))
    else
        print_warning "MongoDB URL format might be incorrect"
        echo "  Please verify your MONGO_URL in backend/.env"
    fi
    
    # Check JWT Secret
    if grep -q "JWT_SECRET=your-super-secret-jwt-key-change-this-in-production" backend/.env; then
        print_warning "JWT_SECRET is using default value"
        echo "  Consider generating a secure random key: openssl rand -base64 32"
    else
        print_status "JWT_SECRET appears to be customized"
    fi
    
else
    print_error "Backend .env file not found"
    echo "  Please create backend/.env with required environment variables"
    ISSUES=$((ISSUES + 1))
fi

# Check backend requirements
if [ -f "backend/requirements.txt" ]; then
    print_status "Backend requirements.txt exists"
else
    print_error "Backend requirements.txt not found"
    ISSUES=$((ISSUES + 1))
fi

# Check Railway config
if [ -f "backend/railway.json" ]; then
    print_status "Railway configuration exists"
else
    print_error "Railway configuration not found"
    ISSUES=$((ISSUES + 1))
fi

echo ""
echo "📋 Checking frontend configuration..."

# Check frontend .env file
if [ -f "frontend/.env" ]; then
    print_status "Frontend .env file exists"
    
    # Check backend URL
    if grep -q "REACT_APP_BACKEND_URL=https://.*railway.app" frontend/.env; then
        print_status "Backend URL points to Railway"
    elif grep -q "REACT_APP_BACKEND_URL=http://localhost:8000" frontend/.env; then
        print_warning "Backend URL is still pointing to localhost"
        echo "  Update REACT_APP_BACKEND_URL after deploying backend to Railway"
    else
        print_warning "Backend URL format might be incorrect"
    fi
    
else
    print_error "Frontend .env file not found"
    echo "  Please create frontend/.env with required environment variables"
    ISSUES=$((ISSUES + 1))
fi

# Check frontend package.json
if [ -f "frontend/package.json" ]; then
    print_status "Frontend package.json exists"
else
    print_error "Frontend package.json not found"
    ISSUES=$((ISSUES + 1))
fi

# Check Vercel config
if [ -f "frontend/vercel.json" ]; then
    print_status "Vercel configuration exists"
else
    print_error "Vercel configuration not found"
    ISSUES=$((ISSUES + 1))
fi

echo ""
echo "📋 Checking deployment scripts..."

# Check deployment scripts
for script in "quick-deploy.sh" "deploy-to-railway.sh" "deploy-to-vercel.sh"; do
    if [ -f "$script" ]; then
        print_status "$script exists"
        if [ -x "$script" ]; then
            print_status "$script is executable"
        else
            print_warning "$script is not executable"
            echo "  Run: chmod +x $script"
        fi
    else
        print_error "$script not found"
        ISSUES=$((ISSUES + 1))
    fi
done

echo ""
echo "📋 Checking CLI tools..."

# Check CLI tools
if command -v railway &> /dev/null; then
    print_status "Railway CLI is installed"
else
    print_warning "Railway CLI not found"
    echo "  Install with: npm install -g @railway/cli"
fi

if command -v vercel &> /dev/null; then
    print_status "Vercel CLI is installed"
else
    print_warning "Vercel CLI not found"
    echo "  Install with: npm install -g vercel"
fi

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "Node.js is installed ($NODE_VERSION)"
else
    print_error "Node.js not found"
    ISSUES=$((ISSUES + 1))
fi

if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    print_status "Python 3 is installed ($PYTHON_VERSION)"
else
    print_error "Python 3 not found"
    ISSUES=$((ISSUES + 1))
fi

echo ""
echo "📋 Summary"
echo "=========="

if [ $ISSUES -eq 0 ]; then
    print_status "Configuration looks good! Ready for deployment."
    echo ""
    echo "🚀 Next steps:"
    echo "1. Set up MongoDB Atlas (see setup-mongodb-atlas.md)"
    echo "2. Run: ./quick-deploy.sh"
    echo "3. Configure environment variables in Railway and Vercel dashboards"
    echo "4. Deploy smart contracts"
    echo "5. Test the application"
else
    print_error "Found $ISSUES configuration issues"
    echo ""
    echo "🔧 Please fix the issues above before deploying"
    echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
fi

echo ""
echo "💡 Useful commands:"
echo "  Test MongoDB: cd backend && python3 test_mongodb.py"
echo "  Quick deploy: ./quick-deploy.sh"
echo "  Manual deploy: ./deploy-to-railway.sh && ./deploy-to-vercel.sh"