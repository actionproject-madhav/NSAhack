#!/usr/bin/env python3
"""
Diagnostic script to test MongoDB connection on Render
Run this to diagnose database connection issues
"""
import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

def test_connection():
    print("=" * 60)
    print("MONGODB CONNECTION DIAGNOSTIC")
    print("=" * 60)
    
    # Check environment variables
    mongo_uri = os.getenv('MONGO_URI')
    database_name = os.getenv('DATABASE_NAME')
    
    print(f"\n1. Environment Variables:")
    print(f"   MONGO_URI: {'✅ Set' if mongo_uri else '❌ Missing'}")
    if mongo_uri:
        # Show first 30 and last 10 chars for security
        preview = mongo_uri[:30] + "..." + mongo_uri[-10:] if len(mongo_uri) > 40 else mongo_uri
        print(f"   Preview: {preview}")
        # Check format
        if not mongo_uri.startswith('mongodb'):
            print(f"   ⚠️  WARNING: URI doesn't start with 'mongodb'")
        if 'mongodb+srv://' not in mongo_uri and 'mongodb://' not in mongo_uri:
            print(f"   ⚠️  WARNING: URI format may be incorrect")
    else:
        print("   ❌ MONGO_URI is not set!")
        print("   Set it in Render Dashboard → Environment Variables")
        return False
    
    print(f"   DATABASE_NAME: {'✅ Set' if database_name else '❌ Missing'}")
    if database_name:
        print(f"   Value: {database_name}")
    else:
        print("   ❌ DATABASE_NAME is not set!")
        print("   Set it in Render Dashboard → Environment Variables")
        return False
    
    # Test connection
    print(f"\n2. Testing Connection...")
    try:
        # Prepare URI
        connection_uri = mongo_uri
        
        # Try connection with timeout
        print("   Attempting connection...")
        client = MongoClient(
            connection_uri,
            serverSelectionTimeoutMS=10000,  # 10 second timeout
            connectTimeoutMS=10000,
            socketTimeoutMS=10000
        )
        
        # Test ping
        print("   Testing ping...")
        result = client.admin.command('ping')
        print(f"   ✅ Ping successful: {result}")
        
        # Test database access
        print(f"   Testing database access...")
        db = client[database_name]
        collections = db.list_collection_names()
        print(f"   ✅ Database accessible: {database_name}")
        print(f"   Collections found: {len(collections)}")
        if collections:
            print(f"   Collections: {', '.join(collections[:5])}")
        
        # Test write (optional - just check if we can access)
        print(f"   ✅ Connection test PASSED!")
        client.close()
        return True
        
    except Exception as e:
        error_msg = str(e)
        print(f"   ❌ Connection FAILED!")
        print(f"   Error: {error_msg}")
        
        # Provide specific guidance based on error
        if "authentication failed" in error_msg.lower():
            print("\n   🔍 DIAGNOSIS: Authentication failed")
            print("   → Check your MongoDB username and password in MONGO_URI")
            print("   → Make sure password is URL-encoded (special chars like @, #, etc.)")
        elif "timeout" in error_msg.lower() or "timed out" in error_msg.lower():
            print("\n   🔍 DIAGNOSIS: Connection timeout")
            print("   → Check MongoDB Atlas Network Access settings")
            print("   → Allow connections from 0.0.0.0/0 (all IPs) or Render's IP ranges")
        elif "name resolution" in error_msg.lower() or "dns" in error_msg.lower():
            print("\n   🔍 DIAGNOSIS: DNS/Network issue")
            print("   → Check MONGO_URI format (should be mongodb+srv://...)")
            print("   → Verify cluster name in URI matches your Atlas cluster")
        elif "ssl" in error_msg.lower() or "tls" in error_msg.lower():
            print("\n   🔍 DIAGNOSIS: SSL/TLS issue")
            print("   → MongoDB Atlas requires SSL - this should be automatic")
            print("   → Check if your Python version supports SSL")
        else:
            print("\n   🔍 DIAGNOSIS: Unknown error")
            print("   → Check Render logs for full error details")
            print("   → Verify MONGO_URI format matches MongoDB Atlas connection string")
        
        return False

if __name__ == "__main__":
    success = test_connection()
    print("\n" + "=" * 60)
    if success:
        print("✅ All checks passed! Database should be working.")
    else:
        print("❌ Connection failed. Fix the issues above and try again.")
    print("=" * 60)

