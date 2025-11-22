from flask import Blueprint, request, jsonify
from database import ReceiptDatabase
from datetime import datetime, timezone
import yfinance as yf
from bson import ObjectId
import os
from db_connection_helper import get_db_error_response, log_db_error

trading_bp = Blueprint('trading', __name__)
db = ReceiptDatabase()

STARTING_CASH = 10000.00  # Default starting cash for new users

def get_user_collection():
    return db.db['users']

def get_transactions_collection():
    return db.db['transactions']

def get_real_stock_price(ticker):
    """Fetch current stock price from Yahoo Finance"""
    try:
        stock = yf.Ticker(ticker)
        data = stock.history(period='1d')
        if not data.empty:
            return float(data['Close'].iloc[-1])
        return None
    except Exception as e:
        print(f"Error fetching price for {ticker}: {str(e)}")
        return None

@trading_bp.route('/balance', methods=['GET'])
def get_balance():
    """Get user's cash balance"""
    try:
        # Check if database is connected
        if db.client is None:
            log_db_error('get_balance')
            return jsonify(get_db_error_response()), 500
        
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({'error': 'user_id required'}), 400
        
        users = get_user_collection()
        
        # Try to find user by ObjectId, email, or google_id
        user = None
        try:
            # Try as ObjectId if it looks like one (24 hex characters)
            if len(user_id) == 24 and all(c in '0123456789abcdefABCDEF' for c in user_id):
                try:
                    user = users.find_one({'_id': ObjectId(user_id)})
                except:
                    pass
        except:
            pass
        
        # If not found, try as email
        if not user:
            user = users.find_one({'email': user_id})
        
        # If still not found, try as google_id
        if not user:
            user = users.find_one({'google_id': user_id})
        
        if not user:
            # Auto-create user if they don't exist (for frontend-only auth users)
            print(f"⚠️ User not found for user_id: {user_id}, auto-creating user...")
            if '@' in user_id:  # If it's an email, create user
                new_user = {
                    'email': user_id,
                    'cash_balance': STARTING_CASH,
                    'created_at': datetime.now(timezone.utc),
                    'updated_at': datetime.now(timezone.utc),
                    'onboarding_completed': False
                }
                result = users.insert_one(new_user)
                user = users.find_one({'_id': result.inserted_id})
                print(f"✅ Auto-created user: {user_id}")
            else:
                print(f"❌ User not found for user_id: {user_id}")
                return jsonify({'error': 'User not found', 'user_id_received': str(user_id)}), 404
        
        # Initialize cash balance if not exists
        if 'cash_balance' not in user:
            users.update_one(
                {'_id': user['_id']},
                {'$set': {'cash_balance': STARTING_CASH}}
            )
            cash_balance = STARTING_CASH
        else:
            cash_balance = user.get('cash_balance', STARTING_CASH)
        
        return jsonify({
            'success': True,
            'cash_balance': cash_balance
        })
        
    except Exception as e:
        print(f"Error in get_balance: {str(e)}")
        return jsonify({'error': str(e)}), 500

@trading_bp.route('/buy', methods=['POST'])
def buy_stock():
    """Execute a buy order"""
    try:
        # Check if database is connected
        if db.client is None:
            log_db_error('buy_stock')
            return jsonify(get_db_error_response()), 500
        data = request.get_json()
        user_id = data.get('user_id')
        ticker = data.get('ticker', '').upper()
        quantity = int(data.get('quantity', 0))
        
        print(f"🔵 buy_stock: Received request - user_id: {user_id}, ticker: {ticker}, quantity: {quantity}")
        
        if not user_id or not ticker or quantity <= 0:
            return jsonify({'error': 'Invalid request data'}), 400
        
        users = get_user_collection()
        transactions = get_transactions_collection()
        
        # Find user (try ObjectId, email, or google_id)
        user = None
        try:
            # Try as ObjectId if it looks like one (24 hex characters)
            if len(user_id) == 24 and all(c in '0123456789abcdefABCDEF' for c in user_id):
                try:
                    user = users.find_one({'_id': ObjectId(user_id)})
                    if user:
                        print(f"✅ Found user by ObjectId: {user_id}")
                except:
                    pass
        except:
            pass
        
        # If not found, try as email
        if not user:
            user = users.find_one({'email': user_id})
            if user:
                print(f"✅ Found user by email: {user_id}")
        
        # If still not found, try as google_id
        if not user:
            user = users.find_one({'google_id': user_id})
            if user:
                print(f"✅ Found user by google_id: {user_id}")
        
        if not user:
            # Auto-create user if they don't exist (for frontend-only auth users)
            if '@' in user_id:  # If it's an email, create user
                print(f"⚠️ User not found for user_id: {user_id}, auto-creating user...")
                new_user = {
                    'email': user_id,
                    'cash_balance': STARTING_CASH,
                    'created_at': datetime.now(timezone.utc),
                    'updated_at': datetime.now(timezone.utc),
                    'onboarding_completed': False
                }
                result = users.insert_one(new_user)
                user = users.find_one({'_id': result.inserted_id})
                print(f"✅ Auto-created user: {user_id}")
            else:
                print(f"❌ User not found for user_id: {user_id} (type: {type(user_id).__name__})")
                # Debug: List all users in database
                all_users = list(users.find({}, {'email': 1, 'google_id': 1, '_id': 1}).limit(5))
                print(f"📋 Sample users in database: {[{'email': u.get('email'), 'google_id': u.get('google_id'), '_id': str(u.get('_id'))} for u in all_users]}")
                return jsonify({'error': 'User not found', 'user_id_received': str(user_id)}), 404
        
        # Initialize cash balance if needed
        if 'cash_balance' not in user:
            users.update_one(
                {'_id': user['_id']},
                {'$set': {'cash_balance': STARTING_CASH}}
            )
            user['cash_balance'] = STARTING_CASH
        
        # Get real-time stock price
        current_price = get_real_stock_price(ticker)
        if current_price is None:
            return jsonify({'error': f'Could not fetch price for {ticker}'}), 400
        
        # Calculate total cost
        total_cost = current_price * quantity
        
        # Check if user has enough cash
        if user['cash_balance'] < total_cost:
            return jsonify({
                'error': 'Insufficient funds',
                'required': total_cost,
                'available': user['cash_balance']
            }), 400
        
        # Calculate new cash balance
        new_cash_balance = user['cash_balance'] - total_cost
        
        # Update user cash balance (portfolio is calculated from transactions, not stored)
        users.update_one(
            {'_id': user['_id']},
            {'$set': {
                'cash_balance': new_cash_balance,
                'updated_at': datetime.now(timezone.utc)
            }}
        )
        
        # Note: Portfolio is now built from transactions, not stored in user document
        
        # Record transaction
        transaction = {
            'user_id': str(user['_id']),
            'type': 'buy',
            'ticker': ticker,
            'quantity': quantity,
            'price': current_price,
            'total': total_cost,
            'timestamp': datetime.now(timezone.utc)
        }
        transactions.insert_one(transaction)
        
        # Calculate portfolio value after purchase (for response)
        user_obj_id = str(user['_id'])
        all_transactions_after = list(transactions.find({'user_id': user_obj_id}).sort('timestamp', 1))
        
        holdings_after = {}
        for tx in all_transactions_after:
            ticker_tx = tx['ticker']
            if ticker_tx not in holdings_after:
                holdings_after[ticker_tx] = {'quantity': 0}
            
            if tx['type'] == 'buy':
                holdings_after[ticker_tx]['quantity'] += tx['quantity']
            elif tx['type'] == 'sell':
                holdings_after[ticker_tx]['quantity'] -= tx['quantity']
        
        portfolio_value = sum(
            h['quantity'] * (get_real_stock_price(t) or 0)
            for t, h in holdings_after.items() 
            if h['quantity'] > 0
        )
        
        return jsonify({
            'success': True,
            'message': f'Successfully bought {quantity} shares of {ticker}',
            'transaction': {
                'ticker': ticker,
                'quantity': quantity,
                'price': current_price,
                'total': total_cost
            },
            'new_balance': new_cash_balance,
            'portfolio_value': portfolio_value
        })
        
    except Exception as e:
        print(f"Error in buy_stock: {str(e)}")
        return jsonify({'error': str(e)}), 500

@trading_bp.route('/sell', methods=['POST'])
def sell_stock():
    """Execute a sell order"""
    try:
        # Check if database is connected
        if db.client is None:
            log_db_error('sell_stock')
            return jsonify(get_db_error_response()), 500
        data = request.get_json()
        user_id = data.get('user_id')
        ticker = data.get('ticker', '').upper()
        quantity = int(data.get('quantity', 0))
        
        if not user_id or not ticker or quantity <= 0:
            return jsonify({'error': 'Invalid request data'}), 400
        
        users = get_user_collection()
        transactions = get_transactions_collection()
        
        # Find user (try ObjectId, email, or google_id)
        user = None
        try:
            # Try as ObjectId if it looks like one (24 hex characters)
            if len(user_id) == 24 and all(c in '0123456789abcdefABCDEF' for c in user_id):
                try:
                    user = users.find_one({'_id': ObjectId(user_id)})
                except:
                    pass
        except:
            pass
        
        # If not found, try as email
        if not user:
            user = users.find_one({'email': user_id})
        
        # If still not found, try as google_id
        if not user:
            user = users.find_one({'google_id': user_id})
        
        if not user:
            print(f" User not found for user_id: {user_id} (type: {type(user_id).__name__})")
            return jsonify({'error': 'User not found', 'user_id_received': str(user_id)}), 404
        
        # Build current portfolio from transactions to check holdings
        user_obj_id = str(user['_id'])
        all_transactions = list(transactions.find({'user_id': user_obj_id}).sort('timestamp', 1))
        
        # Calculate current holdings from transactions
        holdings = {}
        for tx in all_transactions:
            ticker_tx = tx['ticker']
            if ticker_tx not in holdings:
                holdings[ticker_tx] = {'quantity': 0, 'total_cost': 0}
            
            if tx['type'] == 'buy':
                holdings[ticker_tx]['quantity'] += tx['quantity']
                holdings[ticker_tx]['total_cost'] += tx['total']
            elif tx['type'] == 'sell':
                sold_qty = tx['quantity']
                remaining_qty = holdings[ticker_tx]['quantity']
                if remaining_qty > 0:
                    avg_cost_per_share = holdings[ticker_tx]['total_cost'] / remaining_qty
                    holdings[ticker_tx]['quantity'] -= sold_qty
                    holdings[ticker_tx]['total_cost'] -= (avg_cost_per_share * sold_qty)
        
        # Check if user owns enough shares
        current_quantity = holdings.get(ticker, {}).get('quantity', 0)
        if current_quantity < quantity:
            return jsonify({
                'error': 'Insufficient shares',
                'owned': current_quantity,
                'requested': quantity
            }), 400
        
        # Get real-time stock price
        current_price = get_real_stock_price(ticker)
        if current_price is None:
            return jsonify({'error': f'Could not fetch price for {ticker}'}), 400
        
        # Calculate total proceeds
        total_proceeds = current_price * quantity
        
        # Update cash balance (portfolio is calculated from transactions, not stored)
        new_cash_balance = user.get('cash_balance', STARTING_CASH) + total_proceeds
        
        users.update_one(
            {'_id': user['_id']},
            {'$set': {
                'cash_balance': new_cash_balance,
                'updated_at': datetime.now(timezone.utc)
            }}
        )
        
        # Record transaction
        transaction = {
            'user_id': user_obj_id,
            'type': 'sell',
            'ticker': ticker,
            'quantity': quantity,
            'price': current_price,
            'total': total_proceeds,
            'timestamp': datetime.now(timezone.utc)
        }
        transactions.insert_one(transaction)
        
        # Calculate portfolio value after sale (for response)
        holdings_after_sale = holdings.copy()
        if ticker in holdings_after_sale:
            holdings_after_sale[ticker]['quantity'] -= quantity
            if holdings_after_sale[ticker]['quantity'] > 0:
                avg_cost = holdings_after_sale[ticker]['total_cost'] / holdings_after_sale[ticker]['quantity']
                holdings_after_sale[ticker]['total_cost'] -= (avg_cost * quantity)
        
        portfolio_value = sum(
            h['quantity'] * (get_real_stock_price(t) or 0)
            for t, h in holdings_after_sale.items() 
            if h['quantity'] > 0
        )
        
        return jsonify({
            'success': True,
            'message': f'Successfully sold {quantity} shares of {ticker}',
            'transaction': {
                'ticker': ticker,
                'quantity': quantity,
                'price': current_price,
                'total': total_proceeds
            },
            'new_balance': new_cash_balance,
            'portfolio_value': portfolio_value
        })
        
    except Exception as e:
        print(f"Error in sell_stock: {str(e)}")
        return jsonify({'error': str(e)}), 500

@trading_bp.route('/transactions', methods=['GET'])
def get_transactions():
    """Get user's transaction history"""
    try:
        # Check if database is connected
        if db.client is None:
            log_db_error('get_transactions')
            return jsonify(get_db_error_response()), 500
        user_id = request.args.get('user_id')
        limit = int(request.args.get('limit', 50))
        
        if not user_id:
            return jsonify({'error': 'user_id required'}), 400
        
        users = get_user_collection()
        transactions = get_transactions_collection()
        
        # Find user (by ObjectId or email) to get correct user_id string
        try:
            user = users.find_one({'_id': ObjectId(user_id)})
        except:
            user = users.find_one({'email': user_id})
        
        # Auto-create user if they don't exist (for frontend-only auth users)
        if not user and '@' in user_id:
            print(f"⚠️ User not found in get_transactions, auto-creating: {user_id}")
            new_user = {
                'email': user_id,
                'cash_balance': STARTING_CASH,
                'created_at': datetime.now(timezone.utc),
                'updated_at': datetime.now(timezone.utc),
                'onboarding_completed': False
            }
            result = users.insert_one(new_user)
            user = users.find_one({'_id': result.inserted_id})
            print(f"✅ Auto-created user: {user_id}")
        
        # Auto-create user if they don't exist (for frontend-only auth users)
        if not user and '@' in user_id:
            print(f"⚠️ User not found in get_transactions, auto-creating: {user_id}")
            new_user = {
                'email': user_id,
                'cash_balance': STARTING_CASH,
                'created_at': datetime.now(timezone.utc),
                'updated_at': datetime.now(timezone.utc),
                'onboarding_completed': False
            }
            result = users.insert_one(new_user)
            user = users.find_one({'_id': result.inserted_id})
            print(f"✅ Auto-created user: {user_id}")
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Use the string version of user _id for transaction lookup
        user_id_str = str(user['_id'])
        
        # Get transactions for user
        user_transactions = list(transactions.find(
            {'user_id': user_id_str},
            {'_id': 0}
        ).sort('timestamp', -1).limit(limit))
        
        # Convert datetime to string
        for txn in user_transactions:
            if 'timestamp' in txn:
                txn['timestamp'] = txn['timestamp'].isoformat()
        
        return jsonify({
            'success': True,
            'transactions': user_transactions
        })
        
    except Exception as e:
        print(f"Error in get_transactions: {str(e)}")
        return jsonify({'error': str(e)}), 500

@trading_bp.route('/portfolio', methods=['GET'])
def get_portfolio():
    """Get user's current portfolio built from actual transactions only (no mock/onboarding data)"""
    try:
        # Check if database is connected
        if db.client is None:
            log_db_error('get_portfolio')
            return jsonify(get_db_error_response()), 500
        user_id = request.args.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'user_id required'}), 400
        
        users = get_user_collection()
        transactions = get_transactions_collection()
        
        # Find user
        try:
            user = users.find_one({'_id': ObjectId(user_id)})
        except:
            user = users.find_one({'email': user_id})
        
        # Auto-create user if they don't exist (for frontend-only auth users)
        if not user and '@' in user_id:
            print(f"⚠️ User not found in get_portfolio, auto-creating: {user_id}")
            new_user = {
                'email': user_id,
                'cash_balance': STARTING_CASH,
                'created_at': datetime.now(timezone.utc),
                'updated_at': datetime.now(timezone.utc),
                'onboarding_completed': False
            }
            result = users.insert_one(new_user)
            user = users.find_one({'_id': result.inserted_id})
            print(f"✅ Auto-created user: {user_id}")
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Build portfolio from ACTUAL TRANSACTIONS ONLY (no onboarding/mock data)
        user_obj_id = str(user['_id'])
        all_transactions = list(transactions.find({'user_id': user_obj_id}).sort('timestamp', 1))
        
        # Calculate holdings from transactions
        holdings = {}  # {ticker: {quantity, total_cost, transactions}}
        
        for tx in all_transactions:
            ticker = tx['ticker']
            if ticker not in holdings:
                holdings[ticker] = {'quantity': 0, 'total_cost': 0, 'transactions': []}
            
            if tx['type'] == 'buy':
                holdings[ticker]['quantity'] += tx['quantity']
                holdings[ticker]['total_cost'] += tx['total']
                holdings[ticker]['transactions'].append(tx)
            elif tx['type'] == 'sell':
                # Calculate average cost for sold shares (FIFO)
                sold_qty = tx['quantity']
                remaining_qty = holdings[ticker]['quantity']
                
                if remaining_qty > 0:
                    avg_cost_per_share = holdings[ticker]['total_cost'] / remaining_qty
                    holdings[ticker]['quantity'] -= sold_qty
                    holdings[ticker]['total_cost'] -= (avg_cost_per_share * sold_qty)
                    holdings[ticker]['transactions'].append(tx)
        
        # Build portfolio array from holdings (only positions with quantity > 0)
        portfolio = []
        for ticker, holding in holdings.items():
            if holding['quantity'] > 0:
                avg_price = holding['total_cost'] / holding['quantity'] if holding['quantity'] > 0 else 0
                current_price = get_real_stock_price(ticker)
                
                portfolio.append({
                    'ticker': ticker,
                    'company': ticker,  # Can be enhanced with company name lookup
                    'quantity': holding['quantity'],
                    'avgPrice': avg_price,
                    'currentPrice': current_price or avg_price,
                    'reason': 'Paper trading purchase',
                    'logo': ''
                })
        
        # Update current prices for all positions
        for position in portfolio:
            current_price = get_real_stock_price(position['ticker'])
            if current_price:
                position['currentPrice'] = current_price
        
        # Calculate total value
        total_value = sum(p['quantity'] * p['currentPrice'] for p in portfolio)
        cash_balance = user.get('cash_balance', STARTING_CASH)
        
        print(f"Portfolio built from {len(all_transactions)} transactions: {len(portfolio)} positions")
        
        return jsonify({
            'success': True,
            'portfolio': portfolio,
            'cash_balance': cash_balance,
            'portfolio_value': total_value,
            'total_account_value': total_value + cash_balance
        })
        
    except Exception as e:
        print(f"Error in get_portfolio: {str(e)}")
        return jsonify({'error': str(e)}), 500

