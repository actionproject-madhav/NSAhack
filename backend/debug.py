# debug_mongodb.py
import os
from dotenv import load_dotenv
from database import ReceiptDatabase

def debug_mongodb_connection():
    """Debug MongoDB connection and test saving data"""
    
    load_dotenv()
    
    print(" DEBUGGING MONGODB CONNECTION")
    print("=" * 40)
    
    # Check environment variables
    mongo_uri = os.getenv('MONGO_URI')
    db_name = os.getenv('DATABASE_NAME')
    
    print(f"📝 MONGO_URI: {mongo_uri[:50]}..." if mongo_uri else " MONGO_URI not found")
    print(f"📝 DATABASE_NAME: {db_name}")
    print()
    
    if not mongo_uri:
        print(" MONGO_URI is missing from .env file")
        return
    
    # Test connection
    print("🔗 Testing MongoDB connection...")
    db = ReceiptDatabase()
    
    if not db.client:
        print(" Failed to connect to MongoDB")
        return
    
    print(" MongoDB connection successful!")
    
    # List existing databases
    try:
        databases = db.client.list_database_names()
        print(f"📁 Existing databases: {databases}")
    except Exception as e:
        print(f" Error listing databases: {e}")
        return
    
    # Test inserting a receipt
    print("\n Testing receipt insertion...")
    
    try:
        receipt_id = db.save_receipt_scan(
            user_id="debug_test_123",
            company_name="Debug Test Store",
            total_amount=12.34,
            confidence="high",
            extracted_text="Debug Test Receipt\nTotal: $12.34"
        )
        
        if receipt_id:
            print(f" TEST RECEIPT SAVED! ID: {receipt_id}")
            
            # Verify it was saved
            count = db.collection.count_documents({})
            print(f"📄 Total receipts in database: {count}")
            
            # Try to retrieve it
            receipts = db.get_user_receipts("debug_test_123")
            if receipts:
                print(f" Successfully retrieved {len(receipts)} receipts")
                print(f"   First receipt: {receipts[0]['company_name']} - ${receipts[0]['total_amount']}")
            else:
                print(" Could not retrieve the receipt we just saved")
        else:
            print(" Failed to save test receipt")
            
    except Exception as e:
        print(f" Error during receipt insertion: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_mongodb_connection()