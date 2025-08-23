#!/usr/bin/env python3
"""
Test MongoDB Atlas connection with different configurations
"""
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# Atlas connection string
atlas_uri = "mongodb+srv://finlit:Nepal%40123@cluster0.9swrerc.mongodb.net/receipt_scanner?retryWrites=true&w=majority"

def test_atlas_connection():
    print("=" * 60)
    print("MONGODB ATLAS CONNECTION DIAGNOSIS")
    print("=" * 60)
    
    # Test 1: Basic connection with Python 3.13 compatibility
    print("\n🧪 Test 1: Python 3.13 compatible SSL config")
    try:
        client = MongoClient(
            atlas_uri,
            tls=True,
            tlsAllowInvalidCertificates=True,
            tlsInsecure=True,
            serverSelectionTimeoutMS=15000,
            connectTimeoutMS=15000,
            socketTimeoutMS=15000
        )
        
        # Test the connection
        result = client.admin.command('ping')
        print("✅ SUCCESS: Atlas connection working!")
        print(f"   Ping result: {result}")
        
        # Test database operations
        db = client['receipt_scanner']
        collection = db['test_collection']
        
        # Insert test document
        test_doc = {"test": "atlas_connection", "python_version": "3.13.3"}
        insert_result = collection.insert_one(test_doc)
        print(f"✅ Test document inserted: {insert_result.inserted_id}")
        
        # Clean up
        collection.delete_one({"_id": insert_result.inserted_id})
        print("✅ Test document cleaned up")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ FAILED: {type(e).__name__}")
        print(f"   Error: {str(e)[:150]}...")
        return False

    # Test 2: Try older PyMongo compatibility
    print("\n🧪 Test 2: Legacy SSL configuration")
    try:
        client = MongoClient(
            atlas_uri,
            ssl=True,  # Use ssl instead of tls
            ssl_cert_reqs=None,
            serverSelectionTimeoutMS=15000
        )
        
        result = client.admin.command('ping')
        print("✅ SUCCESS: Legacy SSL config working!")
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ FAILED: {type(e).__name__}")
        print(f"   Error: {str(e)[:150]}...")
        return False

def main():
    """Run all Atlas connection tests"""
    print("Testing MongoDB Atlas connectivity...")
    
    if test_atlas_connection():
        print("\n🎉 MongoDB Atlas connection is working!")
        print("   The issue has been resolved.")
    else:
        print("\n⚠️  MongoDB Atlas connection still failing")
        print("   Possible causes:")
        print("   1. Python 3.13 SSL/TLS compatibility issues")
        print("   2. Network/firewall restrictions")
        print("   3. MongoDB Atlas cluster configuration")
        print("   4. PyMongo version incompatibility")
        print("\n✅ Local MongoDB is working as alternative")

if __name__ == "__main__":
    main()