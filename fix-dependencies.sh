#!/bin/bash

echo "🔧 Fixing Frontend Dependencies"
echo "==============================="

cd frontend

echo "📦 Clearing existing dependencies..."
rm -rf node_modules package-lock.json

echo "📦 Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps

echo "✅ Dependencies fixed!"
echo ""
echo "🚀 You can now run:"
echo "   ./run.sh"
echo "   or"
echo "   cd frontend && npm start"