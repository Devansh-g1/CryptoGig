#!/usr/bin/env python3
"""
Direct MongoDB connection test with SSL workaround
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import ssl

async def test_connection():
    # Connection string
    mongo_url = "mongodb+srv://CryptoUser:Devansh%401234@cluster0.go4i2sx.mongodb.net/cryptogig_db?retryWrites=true&w=majority"
    
    print("🧪 Testing MongoDB Connection")
    print("=" * 60)
    
    try:
        # Create SSL context that's more permissive
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        
        # Try connection with custom SSL context
        print("📡 Attempting connection with custom SSL context...")
        client = AsyncIOMotorClient(
            mongo_url,
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=10000
        )
        
        # Test connection
        await client.admin.command('ping')
        print("✅ Successfully connected to MongoDB!")
        
        # Test database access
        db = client['cryptogig_db']
        print(f"✅ Database 'cryptogig_db' is accessible")
        
        # Test collection operations
        test_doc = {'test': 'connection', 'timestamp': 'now'}
        result = await db.test_collection.insert_one(test_doc)
        print(f"✅ Can insert documents (ID: {result.inserted_id})")
        
        # Clean up test
        await db.test_collection.delete_one({'_id': result.inserted_id})
        print("✅ Can delete documents")
        
        client.close()
        print("\n🎉 MongoDB connection is working!")
        return True
        
    except Exception as e:
        print(f"\n❌ Connection failed: {e}")
        print("\nPossible issues:")
        print("1. IP address not whitelisted in MongoDB Atlas")
        print("2. Wrong username or password")
        print("3. Cluster not ready or paused")
        print("4. Network/firewall blocking connection")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_connection())
    exit(0 if success else 1)
