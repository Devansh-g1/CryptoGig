#!/bin/bash

echo "🐳 Building Frontend with Docker (Node 18)"
echo "=========================================="

cd frontend

# Create a temporary Dockerfile for building
cat > Dockerfile.build << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build
RUN npm run build

# Output will be in /app/build
CMD ["echo", "Build complete"]
EOF

echo "🔨 Building with Docker..."
docker build -f Dockerfile.build -t cryptogig-builder .

echo "📦 Extracting build files..."
# Create a container and copy the build directory
CONTAINER_ID=$(docker create cryptogig-builder)
docker cp $CONTAINER_ID:/app/build ./build-new
docker rm $CONTAINER_ID

# Replace old build with new build
if [ -d "build-new" ]; then
    rm -rf build
    mv build-new build
    echo "✅ Build successful!"
else
    echo "❌ Build failed"
    exit 1
fi

# Cleanup
rm Dockerfile.build

echo ""
echo "🚀 Deploying to Netlify..."
netlify deploy --prod --dir=build

echo ""
echo "✅ All done! Your changes are now live!"