#!/usr/bin/env python3
"""
Synchronous MongoDB connection test
"""
from pymongo import MongoClient
from pymongo.server_api import ServerApi

def test_connection():
    print("🧪 Testing MongoDB Connection (Synchronous)")
    print("=" * 60)
    
    # Connection string
    mongo_url = "mongodb+srv://CryptoUser:Devansh%401234@cluster0.go4i2sx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    
    try:
        print("📡 Connecting to MongoDB Atlas...")
        
        # Create client with server API
        client = MongoClient(
            mongo_url,
            server_api=ServerApi('1'),
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=10000
        )
        
        # Test connection
        print("🔍 Testing connection...")
        client.admin.command('ping')
        print("✅ Successfully connected to MongoDB!")
        
        # Test database
        db = client['cryptogig_db']
        print(f"✅ Database 'cryptogig_db' is accessible")
        
        # Test collection operations
        test_collection = db['test_collection']
        test_doc = {'test': 'connection', 'status': 'working'}
        
        result = test_collection.insert_one(test_doc)
        print(f"✅ Can insert documents (ID: {result.inserted_id})")
        
        # Query
        found = test_collection.find_one({'_id': result.inserted_id})
        print(f"✅ Can query documents: {found}")
        
        # Delete
        test_collection.delete_one({'_id': result.inserted_id})
        print("✅ Can delete documents")
        
        # List collections
        collections = db.list_collection_names()
        print(f"✅ Collections in database: {collections}")
        
        client.close()
        
        print("\n" + "=" * 60)
        print("🎉 MongoDB connection is WORKING!")
        print("=" * 60)
        print("\nYour MongoDB Atlas is properly configured.")
        print("The backend should work fine.")
        return True
        
    except Exception as e:
        print(f"\n❌ Connection failed: {e}")
        print("\n" + "=" * 60)
        print("Troubleshooting Steps:")
        print("=" * 60)
        print("\n1. Check MongoDB Atlas Network Access:")
        print("   → Go to: https://cloud.mongodb.com")
        print("   → Click 'Network Access' in left sidebar")
        print("   → Ensure '0.0.0.0/0' is in the IP Access List")
        print("   → If not, click 'Add IP Address' → 'Allow Access from Anywhere'")
        print("\n2. Verify Database User:")
        print("   → Click 'Database Access' in left sidebar")
        print("   → Ensure user 'CryptoUser' exists")
        print("   → Password should be: Devansh@1234")
        print("\n3. Check Cluster Status:")
        print("   → Click 'Database' in left sidebar")
        print("   → Cluster0 should show as 'Active' (not Paused)")
        print("\n4. Wait a few minutes:")
        print("   → If you just created the cluster, wait 2-3 minutes")
        print("   → Network access changes take 1-2 minutes to apply")
        return False

if __name__ == "__main__":
    success = test_connection()
    exit(0 if success else 1)
