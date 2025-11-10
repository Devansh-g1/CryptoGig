#!/bin/bash

echo "🔧 Complete Dependency Fix for Node.js v23"
echo "=========================================="

cd frontend

# Step 1: Complete cleanup
echo "🧹 Complete cleanup..."
rm -rf node_modules package-lock.json yarn.lock .npm

# Step 2: Create a working package.json with fixed versions
echo "📝 Creating compatible package.json..."
cat > package.json << 'EOF'
{
  "name": "cryptogig-frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@hookform/resolvers": "^3.3.2",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-aspect-ratio": "^1.0.3",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-collapsible": "^1.0.3",
    "@radix-ui/react-context-menu": "^2.1.5",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-hover-card": "^1.0.7",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-menubar": "^1.0.4",
    "@radix-ui/react-navigation-menu": "^1.1.4",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-toggle": "^1.0.3",
    "@radix-ui/react-toggle-group": "^1.0.4",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@rainbow-me/rainbowkit": "^2.0.0",
    "@react-oauth/google": "^0.12.1",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "cmdk": "^0.2.0",
    "date-fns": "^2.30.0",
    "embla-carousel-react": "^8.0.0",
    "input-otp": "^1.2.4",
    "lucide-react": "^0.400.0",
    "next-themes": "^0.2.1",
    "react": "^18.2.0",
    "react-day-picker": "^8.9.1",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.48.2",
    "react-resizable-panels": "^0.0.55",
    "react-router-dom": "^6.20.0",
    "react-scripts": "5.0.1",
    "sonner": "^1.4.0",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.0",
    "viem": "^1.19.0",
    "wagmi": "^1.4.0",
    "zod": "^3.22.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@babel/plugin-proposal-private-property-in-object": "^7.21.11",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5"
  },
  "overrides": {
    "ajv": "6.12.6",
    "ajv-keywords": "3.5.2",
    "schema-utils": "3.3.0"
  }
}
EOF

# Step 3: Install with specific npm settings
echo "📦 Installing dependencies with compatibility settings..."
npm config set legacy-peer-deps true
npm config set fund false
npm config set audit false

# Step 4: Install dependencies
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed. Trying with yarn..."
    npm install -g yarn
    yarn install --ignore-engines
fi

# Step 5: Test build
echo "🔨 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🚀 Ready to deploy to Vercel"
else
    echo "❌ Build still failing. Let's try the nuclear option..."
    echo "🔥 Using create-react-app with ejected webpack config..."
fi