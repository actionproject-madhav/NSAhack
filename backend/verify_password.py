#!/usr/bin/env python3
"""
Test different password combinations to find the correct one
"""
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from urllib.parse import quote

load_dotenv()

# Get current URI
current_uri = os.getenv('MONGO_URI', '')
print("=" * 70)
print("PASSWORD VERIFICATION TEST")
print("=" * 70)
print(f"\nCurrent MONGO_URI preview: {current_uri[:50]}...")

# Extract username and cluster from current URI
if 'mongodb+srv://' in current_uri:
    parts = current_uri.replace('mongodb+srv://', '').split('@')
    if len(parts) == 2:
        user_pass = parts[0]
        username = user_pass.split(':')[0]
        cluster_and_db = parts[1]
        cluster = cluster_and_db.split('/')[0]
        print(f"\nDetected:")
        print(f"  Username: {username}")
        print(f"  Cluster: {cluster}")
        print(f"  Database: receipt_scanner")
        
        # Test different passwords
        passwords_to_test = [
            "Madhav@",
            "Nepal@",
            "madhav@",
            "nepal@",
        ]
        
        print(f"\n🔍 Testing passwords...")
        print("=" * 70)
        
        for password in passwords_to_test:
            encoded = quote(password)
            test_uri = f"mongodb+srv://{username}:{encoded}@{cluster}/receipt_scanner?retryWrites=true&w=majority"
            
            print(f"\nTesting: {password} (encoded: {encoded})")
            try:
                client = MongoClient(
                    test_uri,
                    serverSelectionTimeoutMS=10000,
                    connectTimeoutMS=10000
                )
                client.admin.command('ping')
                print(f"✅ SUCCESS! Password is: {password}")
                print(f"\n✅ Correct MONGO_URI:")
                print(f"   {test_uri}")
                print("\n" + "=" * 70)
                client.close()
                exit(0)
            except Exception as e:
                error_msg = str(e)
                if "authentication failed" in error_msg.lower():
                    print(f"   ❌ Authentication failed")
                elif "timeout" in error_msg.lower():
                    print(f"   ⚠️  Timeout (might be network issue)")
                else:
                    print(f"   ❌ Error: {error_msg[:50]}")
        
        print("\n" + "=" * 70)
        print("❌ None of the tested passwords worked")
        print("\n💡 Next steps:")
        print("   1. Check MongoDB Atlas → Database Access")
        print("   2. Verify the password for user 'finlit'")
        print("   3. Reset the password if needed")
        print("   4. Update your .env file with the correct password (URL-encoded)")
        print("=" * 70)
    else:
        print("❌ Could not parse MONGO_URI")
else:
    print("❌ MONGO_URI format not recognized")

