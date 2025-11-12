from flask import Blueprint, request, jsonify
from database import ReceiptDatabase
from datetime import datetime, timezone
import yfinance as yf
from bson import ObjectId

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
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({'error': 'user_id required'}), 400
        
        users = get_user_collection()
        
        # Try to find user by ObjectId or email
        try:
            user = users.find_one({'_id': ObjectId(user_id)})
        except:
            user = users.find_one({'email': user_id})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
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
        data = request.get_json()
        user_id = data.get('user_id')
        ticker = data.get('ticker', '').upper()
        quantity = int(data.get('quantity', 0))
        
        if not user_id or not ticker or quantity <= 0:
            return jsonify({'error': 'Invalid request data'}), 400
        
        users = get_user_collection()
        transactions = get_transactions_collection()
        
        # Find user
        try:
            user = users.find_one({'_id': ObjectId(user_id)})
        except:
            user = users.find_one({'email': user_id})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
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
        
        # Get current portfolio
        portfolio = user.get('portfolio', [])
        
        # Update or add to portfolio
        existing_position = None
        for i, position in enumerate(portfolio):
            if position['ticker'] == ticker:
                existing_position = i
                break
        
        if existing_position is not None:
            # Update existing position
            old_qty = portfolio[existing_position]['quantity']
            old_avg = portfolio[existing_position]['avgPrice']
            new_qty = old_qty + quantity
            new_avg = ((old_qty * old_avg) + (quantity * current_price)) / new_qty
            
            portfolio[existing_position]['quantity'] = new_qty
            portfolio[existing_position]['avgPrice'] = new_avg
            portfolio[existing_position]['currentPrice'] = current_price
        else:
            # Add new position
            portfolio.append({
                'ticker': ticker,
                'company': ticker,
                'quantity': quantity,
                'avgPrice': current_price,
                'currentPrice': current_price,
                'reason': 'Paper trading purchase',
                'logo': ''
            })
        
        # Calculate new cash balance
        new_cash_balance = user['cash_balance'] - total_cost
        
        # Calculate total portfolio value
        total_value = sum(p['quantity'] * p['currentPrice'] for p in portfolio)
        
        # Update user in database
        users.update_one(
            {'_id': user['_id']},
            {'$set': {
                'cash_balance': new_cash_balance,
                'portfolio': portfolio,
                'total_value': total_value,
                'updated_at': datetime.now(timezone.utc)
            }}
        )
        
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
            'portfolio_value': total_value
        })
        
    except Exception as e:
        print(f"Error in buy_stock: {str(e)}")
        return jsonify({'error': str(e)}), 500

@trading_bp.route('/sell', methods=['POST'])
def sell_stock():
    """Execute a sell order"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        ticker = data.get('ticker', '').upper()
        quantity = int(data.get('quantity', 0))
        
        if not user_id or not ticker or quantity <= 0:
            return jsonify({'error': 'Invalid request data'}), 400
        
        users = get_user_collection()
        transactions = get_transactions_collection()
        
        # Find user
        try:
            user = users.find_one({'_id': ObjectId(user_id)})
        except:
            user = users.find_one({'email': user_id})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get portfolio
        portfolio = user.get('portfolio', [])
        
        # Find position
        position_index = None
        for i, position in enumerate(portfolio):
            if position['ticker'] == ticker:
                position_index = i
                break
        
        if position_index is None:
            return jsonify({'error': f'You do not own any {ticker} shares'}), 400
        
        # Check if user has enough shares
        if portfolio[position_index]['quantity'] < quantity:
            return jsonify({
                'error': 'Insufficient shares',
                'owned': portfolio[position_index]['quantity'],
                'requested': quantity
            }), 400
        
        # Get real-time stock price
        current_price = get_real_stock_price(ticker)
        if current_price is None:
            return jsonify({'error': f'Could not fetch price for {ticker}'}), 400
        
        # Calculate total proceeds
        total_proceeds = current_price * quantity
        
        # Update position
        portfolio[position_index]['quantity'] -= quantity
        portfolio[position_index]['currentPrice'] = current_price
        
        # Remove position if quantity is zero
        if portfolio[position_index]['quantity'] == 0:
            portfolio.pop(position_index)
        
        # Update cash balance
        new_cash_balance = user.get('cash_balance', STARTING_CASH) + total_proceeds
        
        # Calculate total portfolio value
        total_value = sum(p['quantity'] * p['currentPrice'] for p in portfolio)
        
        # Update user in database
        users.update_one(
            {'_id': user['_id']},
            {'$set': {
                'cash_balance': new_cash_balance,
                'portfolio': portfolio,
                'total_value': total_value,
                'updated_at': datetime.now(timezone.utc)
            }}
        )
        
        # Record transaction
        transaction = {
            'user_id': str(user['_id']),
            'type': 'sell',
            'ticker': ticker,
            'quantity': quantity,
            'price': current_price,
            'total': total_proceeds,
            'timestamp': datetime.now(timezone.utc)
        }
        transactions.insert_one(transaction)
        
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
            'portfolio_value': total_value
        })
        
    except Exception as e:
        print(f"Error in sell_stock: {str(e)}")
        return jsonify({'error': str(e)}), 500

@trading_bp.route('/transactions', methods=['GET'])
def get_transactions():
    """Get user's transaction history"""
    try:
        user_id = request.args.get('user_id')
        limit = int(request.args.get('limit', 50))
        
        if not user_id:
            return jsonify({'error': 'user_id required'}), 400
        
        transactions = get_transactions_collection()
        
        # Get transactions for user
        user_transactions = list(transactions.find(
            {'user_id': user_id},
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
    """Get user's current portfolio with real-time prices"""
    try:
        user_id = request.args.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'user_id required'}), 400
        
        users = get_user_collection()
        
        # Find user
        try:
            user = users.find_one({'_id': ObjectId(user_id)})
        except:
            user = users.find_one({'email': user_id})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        portfolio = user.get('portfolio', [])
        
        # Update current prices
        for position in portfolio:
            current_price = get_real_stock_price(position['ticker'])
            if current_price:
                position['currentPrice'] = current_price
        
        # Calculate total value
        total_value = sum(p['quantity'] * p['currentPrice'] for p in portfolio)
        cash_balance = user.get('cash_balance', STARTING_CASH)
        
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

