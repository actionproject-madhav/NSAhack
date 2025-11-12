#!/usr/bin/env python3
"""
Test script to verify all API endpoints and database connections
"""

import requests
import json

# Configuration
BASE_URL = 'http://localhost:5000'

def test_stock_quotes():
    """Test stock quote endpoints"""
    print("\n📊 Testing Stock Quote Endpoints...")
    
    # Test single stock quote
    try:
        response = requests.get(f'{BASE_URL}/auth/stock-quote/AAPL')
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                quote = data.get('quote', {})
                print(f" Single quote (AAPL): ${quote.get('price', 0):.2f}")
            else:
                print(" Single quote failed:", data.get('error'))
        else:
            print(f"Single quote HTTP error: {response.status_code}")
    except Exception as e:
        print(f" Single quote error: {e}")
    
    # Test multiple stock quotes
    try:
        response = requests.post(
            f'{BASE_URL}/auth/stock-quotes',
            json={'symbols': ['AAPL', 'MSFT', 'GOOGL']},
            headers={'Content-Type': 'application/json'}
        )
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                quotes = data.get('quotes', [])
                print(f" Multiple quotes: Got {len(quotes)} quotes")
                for q in quotes[:3]:
                    print(f"   - {q['symbol']}: ${q['price']:.2f}")
            else:
                print(" Multiple quotes failed:", data.get('error'))
        else:
            print(f" Multiple quotes HTTP error: {response.status_code}")
    except Exception as e:
        print(f" Multiple quotes error: {e}")

def test_database_connection():
    """Test database connection"""
    print("\n Testing Database Connection...")
    
    try:
        from database import ReceiptDatabase
        db = ReceiptDatabase()
        
        if db.client:
            print(" Database connected")
            print(f"   Database: {db.database_name}")
            collections = db.db.list_collection_names()
            print(f"   Collections: {', '.join(collections)}")
            
            # Test users collection
            users_collection = db.db['users']
            user_count = users_collection.count_documents({})
            print(f"   Users in database: {user_count}")
        else:
            print(" Database not connected")
    except Exception as e:
        print(f" Database error: {e}")

def test_server_health():
    """Test if server is running"""
    print("\n🏥 Testing Server Health...")
    
    try:
        response = requests.get(f'{BASE_URL}/', timeout=5)
        print(f" Server is running (status: {response.status_code})")
    except requests.exceptions.ConnectionError:
        print(" Server is NOT running. Start it with:")
        print("   cd backend && python3 -m flask --app auth run --port 5000")
    except Exception as e:
        print(f" Server health check error: {e}")

def main():
    print("=" * 60)
    print("🧪 API & Database Testing Suite")
    print("=" * 60)
    
    test_server_health()
    test_database_connection()
    test_stock_quotes()
    
    print("\n" + "=" * 60)
    print(" Testing Complete!")
    print("=" * 60)

if __name__ == '__main__':
    main()

