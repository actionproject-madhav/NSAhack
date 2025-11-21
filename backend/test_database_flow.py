#!/usr/bin/env python3
"""
Test script to verify database connection and data persistence
"""
from database import ReceiptDatabase
from datetime import datetime, timezone
import json

def test_database_connection():
    """Test if database is connected and working"""
    print("=" * 60)
    print("DATABASE CONNECTION TEST")
    print("=" * 60)
    
    db = ReceiptDatabase()
    
    if db.client is None:
        print(" Database NOT connected!")
        print("\nTo connect MongoDB:")
        print("1. Install MongoDB locally: brew install mongodb-community")
        print("2. Start MongoDB: brew services start mongodb-community")
        print("3. Or use MongoDB Atlas and set MONGO_URI env variable")
        return False
    else:
        print(" Database IS connected!")
        print(f"   Database: {db.database_name}")
        print(f"   URI: {db.mongo_uri[:30]}...")
        return True

def test_user_collection():
    """Test if we can read/write to users collection"""
    print("\n" + "=" * 60)
    print("USER COLLECTION TEST")
    print("=" * 60)
    
    db = ReceiptDatabase()
    
    if db.client is None:
        print(" Database not connected, skipping test")
        return
    
    try:
        users_collection = db.db['users']
        
        # Count users
        user_count = users_collection.count_documents({})
        print(f" Users in database: {user_count}")
        
        # Show sample users (without sensitive data)
        if user_count > 0:
            print("\n Sample users:")
            for user in users_collection.find().limit(3):
                print(f"\n  User: {user.get('name', 'Unknown')}")
                print(f"  Email: {user.get('email', 'N/A')}")
                print(f"  Onboarding completed: {user.get('onboarding_completed', False)}")
                
                if user.get('lifestyle_brands'):
                    print(f"  Brands: {', '.join(user['lifestyle_brands'])}")
                if user.get('investment_goal'):
                    print(f"  Goal: {user['investment_goal']}")
                if user.get('visa_status'):
                    print(f"  Visa: {user['visa_status']}")
                if user.get('home_country'):
                    print(f"  Country: {user['home_country']}")
                if user.get('portfolio'):
                    print(f"  Portfolio items: {len(user['portfolio'])}")
                    print(f"  Total value: ${user.get('total_value', 0):,.2f}")
        else:
            print("  No users found. Sign in with Google to create your first user!")
            
    except Exception as e:
        print(f" Error testing user collection: {e}")

def test_receipt_collection():
    """Test if we can read receipts"""
    print("\n" + "=" * 60)
    print("RECEIPT COLLECTION TEST")
    print("=" * 60)
    
    db = ReceiptDatabase()
    
    if db.client is None:
        print(" Database not connected, skipping test")
        return
    
    try:
        receipt_count = db.collection.count_documents({})
        print(f"Receipts in database: {receipt_count}")
        
        if receipt_count > 0:
            print("\n📋 Sample receipts:")
            for receipt in db.collection.find().limit(3):
                print(f"\n  Company: {receipt.get('company_name', 'Unknown')}")
                print(f"  Amount: ${receipt.get('total_amount', 0):.2f}")
                print(f"  Date: {receipt.get('scan_date', 'N/A')}")
                print(f"  Confidence: {receipt.get('confidence', 'N/A')}")
        else:
            print("  No receipts found. Use the receipt scanner to add some!")
            
    except Exception as e:
        print(f"❌ Error testing receipt collection: {e}")

def main():
    print("\n")
    print("🔍 FINLIT DATABASE HEALTH CHECK")
    print("\n")
    
    # Test 1: Connection
    is_connected = test_database_connection()
    
    if not is_connected:
        print("\n" + "=" * 60)
        print("  DATABASE NOT AVAILABLE")
        print("=" * 60)
        print("\nThe app will work with limited functionality:")
        print(" Google authentication will work")
        -print(" Stock data and portfolio will work (in-memory)")
        print(" User data won't persist after refresh")
        print(" Receipt scanner won't save data")
        print("\nTo enable full functionality, connect a MongoDB database.")
        return
    
    # Test 2: User Collection
    test_user_collection()
    
    # Test 3: Receipt Collection
    test_receipt_collection()
    
    print("\n" + "=" * 60)
    print(" DATABASE HEALTH CHECK COMPLETE")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Sign in with Google at http://localhost:5174/auth")
    print("2. Complete the onboarding flow")
    print("3. Run this script again to see your data saved!")
    print("\n")

if __name__ == "__main__":
    main()

