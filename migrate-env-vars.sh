#!/bin/bash

echo "🔄 Migrating environment variables from REACT_APP_ to VITE_"
echo "=========================================================="

cd frontend/src

# Find and replace REACT_APP_ with VITE_ in all JS/JSX files
find . -type f \( -name "*.js" -o -name "*.jsx" \) -exec sed -i.bak 's/process\.env\.REACT_APP_/import.meta.env.VITE_/g' {} \;

# Remove backup files
find . -name "*.bak" -delete

echo "✅ Environment variables migrated!"
echo ""
echo "Changed:"
echo "  process.env.REACT_APP_* → import.meta.env.VITE_*"
echo ""
echo "Files updated in frontend/src/"