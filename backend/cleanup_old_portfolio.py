#!/usr/bin/env python3
"""
Cleanup script to remove old portfolio data from users collection
Portfolio is now built from transactions only
"""
from database import ReceiptDatabase

def cleanup_old_portfolio():
    """Remove portfolio and total_value from all users"""
    db = ReceiptDatabase()
    
    if db.client is None:
        print("❌ Database not connected!")
        return
    
    users_collection = db.db['users']
    
    # Remove portfolio and total_value from all users
    result = users_collection.update_many(
        {},
        {
            '$unset': {
                'portfolio': '',
                'total_value': ''
            }
        }
    )
    
    print(f"✅ Cleaned up {result.modified_count} users")
    print("Portfolio is now built from transactions only!")

if __name__ == "__main__":
    cleanup_old_portfolio()
