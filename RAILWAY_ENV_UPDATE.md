# Railway Environment Variable Setup

## Fix CORS Error - CRITICAL

The CORS error is blocking your frontend from communicating with the backend. Follow these steps:

### Required Steps:

1. **Go to Railway Dashboard:**
   - Visit: https://railway.app
   - Select your project: `clientarbitrator-production`
   - Click on your backend service

2. **Add/Update Environment Variables:**
   
   Go to the "Variables" tab and ensure these are set:

   ```
   CORS_ORIGINS=https://cryptogig-platform.netlify.app,http://localhost:5173
   FRONTEND_URL=https://cryptogig-platform.netlify.app
   ```

3. **Check Other Required Variables:**
   
   Make sure these are also set (should already be there):
   ```
   MONGO_URL=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   CONTRACT_ADDRESS=<your-deployed-contract-address>
   DEPLOYER_PRIVATE_KEY=<your-private-key>
   ARBITRATOR_WALLET=0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483
   POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
   ```

4. **Save and Wait for Redeploy:**
   - Railway will automatically redeploy after you save
   - Wait 1-2 minutes for the deployment to complete

5. **Verify in Logs:**
   
   After deployment, check the Railway logs. You should see:
   ```
   CORS Origins configured: ['https://cryptogig-platform.netlify.app', 'http://localhost:5173']
   ```

### Test the Fix:

After redeployment, test with curl:
```bash
curl -H "Origin: https://cryptogig-platform.netlify.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type,Authorization" \
     -X OPTIONS \
     https://clientarbitrator-production.up.railway.app/api/jobs -v
```

You should see `access-control-allow-origin` header in the response.

### If Still Not Working:

1. Check Railway logs for any startup errors
2. Verify the environment variables are actually set (not just saved)
3. Try a manual redeploy from Railway dashboard
4. Check if there's a Railway.toml file that might be overriding settings
