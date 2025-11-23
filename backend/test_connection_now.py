#!/usr/bin/env python3
"""
Quick test to verify MongoDB connection with current environment variables
"""
import os
from dotenv import load_dotenv
from pymongo import MongoClient
import sys

# Load environment variables
load_dotenv()

# Get connection details
mongo_uri = os.getenv('MONGO_URI', '')
database_name = os.getenv('DATABASE_NAME', 'receipt_scanner')

print("=" * 70)
print("MONGODB CONNECTION TEST")
print("=" * 70)
print(f"\n📋 Environment Variables:")
print(f"   MONGO_URI: {'✅ Set' if mongo_uri else '❌ Missing'}")
print(f"   DATABASE_NAME: {'✅ Set' if database_name else '❌ Missing'}")

if not mongo_uri:
    print("\n❌ ERROR: MONGO_URI not set in environment!")
    print("   Make sure you have a .env file with MONGO_URI set")
    sys.exit(1)

if not database_name:
    print("\n❌ ERROR: DATABASE_NAME not set in environment!")
    sys.exit(1)

# Show connection string (masked for security)
if mongo_uri:
    # Show first 30 chars and last 30 chars
    if len(mongo_uri) > 60:
        preview = mongo_uri[:30] + "..." + mongo_uri[-30:]
    else:
        preview = mongo_uri
    print(f"\n🔗 Connection String Preview:")
    print(f"   {preview}")

print(f"\n🔍 Testing Connection...")
print("   (This may take 10-30 seconds on first connection)")

try:
    # Prepare URI
    mongo_uri_clean = mongo_uri
    if 'ssl=true' not in mongo_uri_clean.lower() and 'tls=true' not in mongo_uri_clean.lower():
        separator = '&' if '?' in mongo_uri_clean else '?'
        mongo_uri_clean = f"{mongo_uri_clean}{separator}tls=true"
    
    # Try connection with certifi
    try:
        import ssl
        import certifi
        print("\n   Method 1: Trying TLS with certifi...")
        client = MongoClient(
            mongo_uri_clean,
            tls=True,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=30000,
            connectTimeoutMS=30000,
            socketTimeoutMS=30000
        )
        # Test connection
        client.admin.command('ping')
        print("   ✅ Connection successful with TLS + certifi!")
    except Exception as e1:
        print(f"   ⚠️  TLS with certifi failed: {str(e1)[:100]}")
        # Fallback: URI-only
        try:
            print("\n   Method 2: Trying URI-only (pymongo auto-SSL)...")
            client = MongoClient(
                mongo_uri_clean,
                serverSelectionTimeoutMS=30000,
                connectTimeoutMS=30000,
                socketTimeoutMS=30000
            )
            client.admin.command('ping')
            print("   ✅ Connection successful with URI-only!")
        except Exception as e2:
            print(f"   ❌ URI-only also failed: {str(e2)[:100]}")
            raise e2
    
    # Test database access
    print(f"\n📊 Testing Database Access...")
    db = client[database_name]
    
    # List collections
    collections = db.list_collection_names()
    print(f"   ✅ Connected to database: {database_name}")
    print(f"   📁 Collections found: {len(collections)}")
    if collections:
        print(f"      {', '.join(collections[:5])}")
        if len(collections) > 5:
            print(f"      ... and {len(collections) - 5} more")
    else:
        print("      (No collections yet - this is normal for a new database)")
    
    # Test users collection
    if 'users' in collections:
        users_count = db['users'].count_documents({})
        print(f"\n   👥 Users collection: {users_count} documents")
    else:
        print(f"\n   👥 Users collection: (doesn't exist yet - will be created on first use)")
    
    print("\n" + "=" * 70)
    print("✅ ALL TESTS PASSED!")
    print("=" * 70)
    print("\n🎉 Your MongoDB connection is working correctly!")
    print("   You can deploy to Render with the same credentials.")
    print("\n📝 Connection String (for reference):")
    print(f"   {mongo_uri}")
    print("\n" + "=" * 70)
    
    client.close()
    
except Exception as e:
    print("\n" + "=" * 70)
    print("❌ CONNECTION FAILED")
    print("=" * 70)
    print(f"\nError: {str(e)}")
    print("\n🔍 Troubleshooting:")
    print("   1. Check MONGO_URI format:")
    print("      - Should be: mongodb+srv://username:password@cluster...")
    print("      - Password with @ must be URL-encoded: @ → %40")
    print("   2. Check MongoDB Atlas Network Access:")
    print("      - Go to Network Access → Add IP Address")
    print("      - Add 0.0.0.0/0 to allow all IPs (or your IP)")
    print("   3. Check database user credentials:")
    print("      - Username: finlit")
    print("      - Password: Madhav@ (URL-encoded as Madhav%40 in URI)")
    print("   4. Check DATABASE_NAME:")
    print(f"      - Current: {database_name}")
    print("      - Should match your database name in Atlas")
    print("\n" + "=" * 70)
    sys.exit(1)

