#!/bin/bash

echo "🔄 Renaming .js files with JSX to .jsx"
echo "======================================"

cd frontend/src

# Find all .js files that contain JSX syntax and rename them
for file in $(find . -name "*.js" -type f); do
    if grep -q "return.*<" "$file" || grep -q "React" "$file" || grep -q "jsx" "$file" || grep -q "<.*>" "$file"; then
        newfile="${file%.js}.jsx"
        if [ "$file" != "$newfile" ]; then
            mv "$file" "$newfile"
            echo "Renamed: $file → $newfile"
        fi
    fi
done

echo ""
echo "✅ JSX files renamed!"
echo ""
echo "Now updating imports..."

# Update all import statements to use .jsx
find . -type f \( -name "*.js" -o -name "*.jsx" \) -exec sed -i.bak "s/from '\(.*\)\.js'/from '\1.jsx'/g" {} \;
find . -type f \( -name "*.js" -o -name "*.jsx" \) -exec sed -i.bak 's/from "\(.*\)\.js"/from "\1.jsx"/g' {} \;

# Remove backup files
find . -name "*.bak" -delete

echo "✅ Imports updated!"