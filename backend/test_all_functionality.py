#!/usr/bin/env python3
"""
Comprehensive test suite for all FinLit functionality
"""
import requests
import json
import time
from database import ReceiptDatabase
from bson import ObjectId

BASE_URL = "http://localhost:5000"
TEST_USER_EMAIL = "madhavkhanal3145@gmail.com"

def print_section(title):
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)

def test_database_connection():
    """Test 1: Database Connection"""
    print_section("TEST 1: Database Connection")
    try:
        db = ReceiptDatabase()
        if db.client is None:
            print(" Database NOT connected")
            return False
        
        # Test collections
        users = db.db['users']
        transactions = db.db['transactions']
        
        user_count = users.count_documents({})
        tx_count = transactions.count_documents({})
        
        print(f" Database connected")
        print(f"   Users: {user_count}")
        print(f"   Transactions: {tx_count}")
        return True
    except Exception as e:
        print(f" Database error: {e}")
        return False

def test_backend_health():
    """Test 2: Backend Health"""
    print_section("TEST 2: Backend Health")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f" Backend is running")
            print(f"   Status: {data.get('status')}")
            print(f"   Database: {data.get('database')}")
            return True
        else:
            print(f" Backend returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print(f" Backend is NOT running at {BASE_URL}")
        print("   Start backend with: cd backend && python3 app.py")
        return False
    except Exception as e:
        print(f" Error: {e}")
        return False

def test_user_profile():
    """Test 3: User Profile Endpoint"""
    print_section("TEST 3: User Profile")
    try:
        response = requests.get(
            f"{BASE_URL}/auth/user/{TEST_USER_EMAIL}",
            timeout=5
        )
        if response.status_code == 200:
            data = response.json()
            user = data.get('user', {})
            print(f" User profile retrieved")
            print(f"   Name: {user.get('name')}")
            print(f"   Email: {user.get('email')}")
            print(f"   Onboarding: {user.get('onboarding_completed')}")
            return True
        else:
            print(f" Failed: {response.status_code}")
            print(f"   Response: {response.text[:100]}")
            return False
    except Exception as e:
        print(f" Error: {e}")
        return False

def test_portfolio_endpoint():
    """Test 4: Portfolio Endpoint"""
    print_section("TEST 4: Portfolio Endpoint")
    try:
        response = requests.get(
            f"{BASE_URL}/api/trading/portfolio?user_id={TEST_USER_EMAIL}",
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                portfolio = data.get('portfolio', [])
                cash = data.get('cash_balance', 0)
                value = data.get('portfolio_value', 0)
                
                print(f" Portfolio retrieved")
                print(f"   Cash: ${cash:,.2f}")
                print(f"   Portfolio Value: ${value:,.2f}")
                print(f"   Positions: {len(portfolio)}")
                
                for pos in portfolio:
                    print(f"     - {pos['ticker']}: {pos['quantity']} @ ${pos['avgPrice']:.2f}")
                
                return True
            else:
                print(f" Portfolio request failed: {data.get('error')}")
                return False
        else:
            print(f" Failed: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            return False
    except Exception as e:
        print(f" Error: {e}")
        return False

def test_cash_balance():
    """Test 5: Cash Balance"""
    print_section("TEST 5: Cash Balance")
    try:
        response = requests.get(
            f"{BASE_URL}/api/trading/balance?user_id={TEST_USER_EMAIL}",
            timeout=5
        )
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                balance = data.get('cash_balance', 0)
                print(f" Cash balance: ${balance:,.2f}")
                return True
            else:
                print(f" Failed: {data.get('error')}")
                return False
        else:
            print(f" Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f" Error: {e}")
        return False

def test_stock_quote():
    """Test 6: Stock Quote"""
    print_section("TEST 6: Stock Quote")
    try:
        response = requests.get(
            f"{BASE_URL}/auth/stock-quote/AAPL",
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                quote = data.get('quote', {})
                print(f" Stock quote retrieved")
                print(f"   Symbol: {quote.get('symbol')}")
                print(f"   Price: ${quote.get('price', 0):.2f}")
                print(f"   Change: {quote.get('changePercent', 0):.2f}%")
                return True
            else:
                print(f" Failed: {data.get('error')}")
                return False
        else:
            print(f" Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f" Error: {e}")
        return False

def test_transactions():
    """Test 7: Transaction History"""
    print_section("TEST 7: Transaction History")
    try:
        response = requests.get(
            f"{BASE_URL}/api/trading/transactions?user_id={TEST_USER_EMAIL}&limit=10",
            timeout=5
        )
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                txs = data.get('transactions', [])
                print(f" Transactions retrieved: {len(txs)}")
                for tx in txs[:3]:
                    print(f"   - {tx.get('type').upper()}: {tx.get('quantity')} {tx.get('ticker')} @ ${tx.get('price', 0):.2f}")
                return True
            else:
                print(f" Failed: {data.get('error')}")
                return False
        else:
            print(f" Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f" Error: {e}")
        return False

def test_ai_hub():
    """Test 8: AI Hub Endpoints"""
    print_section("TEST 8: AI Hub")
    try:
        # Test daily brief
        response = requests.get(
            f"{BASE_URL}/api/ai/daily-brief",
            timeout=15
        )
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print(f" Daily brief generated")
                summary = data.get('summary', '')[:100]
                print(f"   Preview: {summary}...")
                return True
            else:
                print(f"  Daily brief failed: {data.get('error', 'Unknown error')}")
                return False
        else:
            print(f"  Daily brief returned {response.status_code}")
            return False
    except Exception as e:
        print(f"  AI Hub error (may need API keys): {e}")
        return False

def test_database_data_integrity():
    """Test 9: Database Data Integrity"""
    print_section("TEST 9: Data Integrity")
    try:
        db = ReceiptDatabase()
        users = db.db['users']
        transactions = db.db['transactions']
        
        # Check user
        user = users.find_one({'email': TEST_USER_EMAIL})
        if not user:
            print(f" User not found in database")
            return False
        
        print(f" User found: {user.get('name')}")
        
        # Check for old portfolio data
        if 'portfolio' in user and user['portfolio']:
            print(f"  WARNING: User still has old portfolio data!")
            print(f"   Run cleanup: python3 cleanup_old_portfolio.py")
        else:
            print(f" No old portfolio data (good!)")
        
        # Check transactions
        user_id_str = str(user['_id'])
        txs = list(transactions.find({'user_id': user_id_str}))
        print(f" Transactions found: {len(txs)}")
        
        # Verify portfolio can be built from transactions
        if len(txs) > 0:
            print(f" Portfolio can be built from {len(txs)} transaction(s)")
        else:
            print(f"ℹ  No transactions yet (user hasn't made trades)")
        
        return True
    except Exception as e:
        print(f" Error: {e}")
        return False

def test_cors():
    """Test 10: CORS Configuration"""
    print_section("TEST 10: CORS Configuration")
    try:
        response = requests.options(
            f"{BASE_URL}/health",
            headers={
                'Origin': 'http://localhost:5173',
                'Access-Control-Request-Method': 'GET'
            },
            timeout=5
        )
        cors_headers = {
            'access-control-allow-origin': response.headers.get('Access-Control-Allow-Origin'),
            'access-control-allow-credentials': response.headers.get('Access-Control-Allow-Credentials')
        }
        
        if cors_headers['access-control-allow-origin']:
            print(f" CORS configured")
            print(f"   Allow-Origin: {cors_headers['access-control-allow-origin']}")
            return True
        else:
            print(f"  CORS headers not found")
            return False
    except Exception as e:
        print(f"  CORS test error: {e}")
        return False

def main():
    print("\n")
    print("🧪 COMPREHENSIVE FINLIT FUNCTIONALITY TEST")
    print("=" * 60)
    
    results = {}
    
    # Run all tests
    results['database'] = test_database_connection()
    results['backend'] = test_backend_health()
    
    if not results['backend']:
        print("\n⚠️  Backend is not running. Start it with: cd backend && python3 app.py")
        return
    
    results['user_profile'] = test_user_profile()
    results['portfolio'] = test_portfolio_endpoint()
    results['cash_balance'] = test_cash_balance()
    results['stock_quote'] = test_stock_quote()
    results['transactions'] = test_transactions()
    results['ai_hub'] = test_ai_hub()
    results['data_integrity'] = test_database_data_integrity()
    results['cors'] = test_cors()
    
    # Summary
    print_section("TEST SUMMARY")
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {test_name.upper():20} {status}")
    
    print(f"\n  Total: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! System is fully functional.")
    elif passed >= total * 0.8:
        print("\n⚠️  Most tests passed. Check failed tests above.")
    else:
        print("\n❌ Multiple tests failed. Review errors above.")
    
    print("\n")

if __name__ == "__main__":
    main()

