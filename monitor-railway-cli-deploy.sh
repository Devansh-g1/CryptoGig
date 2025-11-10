#!/bin/bash

echo "🚀 Monitoring Railway CLI Deployment"
echo "======================================"
echo ""
echo "Deployment ID: b5120d96-61f0-465d-9105-bcaeb7d447a2"
echo "Build Logs: https://railway.com/project/6ce15398-15d7-4a70-ab90-c938d6245a00/service/af45884d-e319-4a9a-a24f-b32d4a6adf98?id=b5120d96-61f0-465d-9105-bcaeb7d447a2"
echo ""
echo "Checking deployment status every 10 seconds..."
echo ""

# Your Railway app URL
RAILWAY_URL="https://cryptogig-production.up.railway.app"

for i in {1..30}; do
    echo "[$i/30] Checking health endpoint..."
    
    RESPONSE=$(curl -s "$RAILWAY_URL/api/health" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo "Response: $RESPONSE"
        
        # Check if version 2.0.0 is in the response
        if echo "$RESPONSE" | grep -q "2.0.0-FIXED-NO-EMAIL-VERIFICATION"; then
            echo ""
            echo "✅ SUCCESS! New version deployed!"
            echo "Version: 2.0.0-FIXED-NO-EMAIL-VERIFICATION"
            echo ""
            echo "Now test registration:"
            echo "curl -X POST $RAILWAY_URL/api/auth/register \\"
            echo "  -H 'Content-Type: application/json' \\"
            echo "  -d '{\"email\":\"test@example.com\",\"password\":\"test123\",\"name\":\"Test\",\"role\":\"client\"}'"
            exit 0
        fi
    else
        echo "Service not responding yet..."
    fi
    
    echo ""
    sleep 10
done

echo "⏰ Timeout reached. Check Railway dashboard manually:"
echo "https://railway.com/project/6ce15398-15d7-4a70-ab90-c938d6245a00/service/af45884d-e319-4a9a-a24f-b32d4a6adf98"
