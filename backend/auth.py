from flask import Blueprint, request, jsonify, redirect, session, url_for
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from google_auth_oauthlib.flow import Flow
import os
from dotenv import load_dotenv
from database import ReceiptDatabase
from datetime import datetime, timezone
import json
import yfinance as yf
from db_connection_helper import get_db_error_response, log_db_error

load_dotenv()

auth_bp = Blueprint('auth', __name__)
db = ReceiptDatabase()

# Google OAuth configuration
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI')
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')

# Validate required environment variables
if not GOOGLE_CLIENT_ID:
    print("❌ ERROR: GOOGLE_CLIENT_ID environment variable is not set!")
    print("   Please set it in Render Dashboard → Environment Variables")
if not GOOGLE_CLIENT_SECRET:
    print("❌ ERROR: GOOGLE_CLIENT_SECRET environment variable is not set!")
    print("   Please set it in Render Dashboard → Environment Variables")
if not GOOGLE_REDIRECT_URI:
    print("❌ ERROR: GOOGLE_REDIRECT_URI environment variable is not set!")
    print("   Should be: https://finlit-nsa.onrender.com/auth/google/callback")

# Debug output
print("=" * 60)
print("Google OAuth Configuration Check:")
print("=" * 60)
print(f"GOOGLE_CLIENT_ID: {'✅ Set' if GOOGLE_CLIENT_ID else '❌ Missing'}")
if GOOGLE_CLIENT_ID:
    print(f"  Value: {GOOGLE_CLIENT_ID[:30]}...{GOOGLE_CLIENT_ID[-10:]}")
print(f"GOOGLE_CLIENT_SECRET: {'✅ Set' if GOOGLE_CLIENT_SECRET else '❌ Missing'}")
print(f"GOOGLE_REDIRECT_URI: {'✅ Set' if GOOGLE_REDIRECT_URI else '❌ Missing'}")
if GOOGLE_REDIRECT_URI:
    print(f"  Value: {GOOGLE_REDIRECT_URI}")
print(f"FRONTEND_URL: {FRONTEND_URL}")
print("=" * 60)

# Create OAuth flow
def create_flow():
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET or not GOOGLE_REDIRECT_URI:
        raise ValueError("Missing required Google OAuth environment variables. Check Render Dashboard → Environment Variables")
    
    return Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [GOOGLE_REDIRECT_URI]
            }
        },
        scopes=['openid', 'email', 'profile'],
        redirect_uri=GOOGLE_REDIRECT_URI
    )

@auth_bp.route('/google', methods=['GET'])
def google_auth():
    """Initiate Google OAuth flow"""
    try:
        flow = create_flow()
        authorization_url, state = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true'
        )
        
        # Store state in session for verification
        session['state'] = state
        
        return jsonify({
            'success': True,
            'authorization_url': authorization_url,
            'state': state
        })
        
    except Exception as e:
        print(f"Error initiating Google auth: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to initiate Google authentication'
        }), 500

@auth_bp.route('/google/callback', methods=['GET'])
def google_callback():
    """Handle Google OAuth callback"""
    try:
        # Verify state parameter
        state = request.args.get('state')
        if not state or state != session.get('state'):
            return jsonify({'error': 'Invalid state parameter'}), 400
        
        # Get authorization code
        code = request.args.get('code')
        if not code:
            return jsonify({'error': 'Missing authorization code'}), 400
        
        # Exchange code for tokens
        flow = create_flow()
        flow.fetch_token(code=code)
        
        # Get user info from ID token
        credentials = flow.credentials
        id_info = id_token.verify_oauth2_token(
            credentials.id_token,
            google_requests.Request(),
            GOOGLE_CLIENT_ID
        )
        
        # Extract user information
        user_data = {
            'google_id': id_info['sub'],
            'email': id_info['email'],
            'name': id_info.get('name', ''),
            'picture': id_info.get('picture', ''),
            'verified_email': id_info.get('email_verified', False)
        }
        
        # Save or update user in database
        user_id = save_or_update_user(user_data)
        
        # Store user session
        session['user_id'] = user_id
        session['user_email'] = user_data['email']
        session['user_name'] = user_data['name']
        
        # Redirect to frontend onboarding page
        frontend_url = f"{FRONTEND_URL}/onboarding?user_id={user_id}&email={user_data['email']}&name={user_data['name']}"

        return redirect(f"{FRONTEND_URL}/auth?error=authentication_failed")
        
    except Exception as e:
        print(f"Error in Google callback: {e}")
        # Redirect to frontend with error
        return redirect(f"{FRONTEND_URL}/auth?error=authentication_failed")

@auth_bp.route('/verify-token', methods=['POST'])
def verify_google_token():
    """Verify Google ID token from frontend"""
    try:
        data = request.get_json()
        token = data.get('token')
        
        if not token:
            return jsonify({'error': 'Token is required'}), 400
        
        # Verify the token with clock skew tolerance
        try:
            id_info = id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
                GOOGLE_CLIENT_ID,
                clock_skew_in_seconds=60  # Allow 60 seconds of clock skew
            )
        except ValueError as e:
            # If clock skew error, try with more tolerance
            if 'Token used too early' in str(e) or 'too late' in str(e):
                print(f"Clock skew detected, retrying with more tolerance: {e}")
                id_info = id_token.verify_oauth2_token(
                    token,
                    google_requests.Request(),
                    GOOGLE_CLIENT_ID,
                    clock_skew_in_seconds=300  # Allow 5 minutes of clock skew
                )
            else:
                raise
        
        # Extract user information
        user_data = {
            'google_id': id_info['sub'],
            'email': id_info['email'],
            'name': id_info.get('name', ''),
            'picture': id_info.get('picture', ''),
            'verified_email': id_info.get('email_verified', False)
        }
        
        # Save or update user in database
        try:
            user_id = save_or_update_user(user_data)
            print(f"User saved successfully with ID: {user_id}")
        except Exception as db_error:
            print(f"Database error, using email as user_id: {db_error}")
            user_id = user_data['email']  # Fallback to email as ID
            print(f"Using fallback user_id: {user_id}")
        
        return jsonify({
            'success': True,
            'user': {
                'id': user_id,
                'email': user_data['email'],
                'name': user_data['name'],
                'picture': user_data['picture']
            }
        })
        
    except Exception as e:
        print(f"Error verifying token: {e}")
        print(f"Token received: {token[:50]}..." if token else "No token received")
        print(f"Using Client ID: {GOOGLE_CLIENT_ID[:50]}..." if GOOGLE_CLIENT_ID else "No Client ID")
        return jsonify({'error': f'Invalid token: {str(e)}'}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout user"""
    session.clear()
    return jsonify({'success': True, 'message': 'Logged out successfully'})

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """Get current authenticated user"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401
    
    return jsonify({
        'success': True,
        'user': {
            'id': user_id,
            'email': session.get('user_email'),
            'name': session.get('user_name')
        }
    })

@auth_bp.route('/user/<user_id>', methods=['GET'])
def get_user_profile(user_id):
    """Get full user profile including onboarding data"""
    if db.client is None:
        from db_connection_helper import get_db_error_response, log_db_error
        log_db_error('get_user_profile')
        return jsonify(get_db_error_response()), 500
    
    try:
        users_collection = db.db['users']
        
        # Find user by ID or email
        from bson import ObjectId
        try:
            user = users_collection.find_one({'_id': ObjectId(user_id)})
        except:
            # If not valid ObjectId, try email
            user = users_collection.find_one({'email': user_id})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Convert ObjectId to string
        user['_id'] = str(user['_id'])
        
        # Remove sensitive data
        user.pop('google_id', None)
        
        return jsonify({
            'success': True,
            'user': user
        })
        
    except Exception as e:
        print(f"Error getting user profile: {e}")
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/onboarding', methods=['POST'])
def save_onboarding_data():
    """Save user onboarding data - auto-creates user if not found"""
    if db.client is None:
        from db_connection_helper import get_db_error_response, log_db_error
        log_db_error('save_onboarding_data')
        return jsonify(get_db_error_response()), 500
    
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
        
        # Extract onboarding data (NO portfolio - users start with empty portfolio)
        onboarding_data = {
            'lifestyle_brands': data.get('lifestyle_brands', []),
            'investment_goal': data.get('investment_goal', ''),
            'language': data.get('language', 'en'),
            'visa_status': data.get('visa_status', ''),
            'home_country': data.get('home_country', ''),
            # DO NOT save portfolio or total_value - users start with empty portfolio
            # Portfolio is ONLY built from actual trades in the transactions collection
            'onboarding_completed': True,
            'updated_at': datetime.now(timezone.utc)
        }
        
        users_collection = db.db['users']
        
        # Update user with onboarding data and remove old portfolio (cleanup mock data)
        from bson import ObjectId
        update_operation = {
            '$set': onboarding_data,
            '$unset': {
                'portfolio': '',
                'total_value': ''
            }
        }
        
        # Try to find user by ObjectId, email, or google_id
        user = None
        try:
            # Try as ObjectId if it looks like one (24 hex characters)
            if len(user_id) == 24 and all(c in '0123456789abcdefABCDEF' for c in user_id):
                try:
                    user = users_collection.find_one({'_id': ObjectId(user_id)})
                except:
                    pass
        except:
            pass
        
        # If not found, try as email
        if not user:
            user = users_collection.find_one({'email': user_id})
        
        # If still not found, try as google_id
        if not user:
            user = users_collection.find_one({'google_id': user_id})
        
        if not user:
            # Auto-create user if not found (similar to trading endpoints)
            print(f"⚠️ User not found for onboarding: {user_id}, attempting auto-create...")
            # Assume user_id is an email for auto-creation
            from trading import STARTING_CASH
            new_user_data = {
                'email': user_id if '@' in user_id else f'{user_id}@unknown.com',
                'name': user_id.split('@')[0] if '@' in user_id else user_id,
                'cash_balance': STARTING_CASH,
                'onboarding_completed': False,
                'created_at': datetime.now(timezone.utc),
                'updated_at': datetime.now(timezone.utc),
                'last_login': datetime.now(timezone.utc)
            }
            result = users_collection.insert_one(new_user_data)
            user = users_collection.find_one({'_id': result.inserted_id})
            print(f"✅ Auto-created user: {user.get('email')} with ID: {str(user.get('_id'))}")
        
        # Update the found user
        result = users_collection.update_one(
            {'_id': user['_id']},
            update_operation
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Failed to update user'}), 500
        
        print(f" Onboarding data saved for user: {user_id}")
        
        return jsonify({
            'success': True,
            'message': 'Onboarding data saved successfully'
        })
        
    except Exception as e:
        print(f"❌ Error saving onboarding data: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/cleanup-portfolio', methods=['POST'])
def cleanup_mock_portfolio():
    """Remove mock portfolio data from all users (one-time cleanup)"""
    if db.client is None:
        return jsonify({'error': 'Database not connected'}), 500
    
    try:
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
        
        print(f"✅ Cleaned up mock portfolio data from {result.modified_count} users")
        
        return jsonify({
            'success': True,
            'message': f'Removed mock portfolio data from {result.modified_count} users',
            'users_updated': result.modified_count
        })
        
    except Exception as e:
        print(f"❌ Error cleaning up portfolio: {e}")
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/portfolio', methods=['POST'])
def update_portfolio():
    """DEPRECATED: Portfolio is now only built from transactions. This endpoint is kept for backward compatibility but does nothing."""
    return jsonify({
        'success': False,
        'message': 'Portfolio is now only built from actual trades. Use /api/trading/portfolio instead.'
    }), 400

@auth_bp.route('/stock-quote/<symbol>', methods=['GET'])
def get_stock_quote(symbol):
    """Get real-time stock quote using yfinance"""
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        
        if not info or 'regularMarketPrice' not in info:
            # Try fast_info as fallback
            fast_info = ticker.fast_info
            quote = {
                'symbol': symbol,
                'price': fast_info.get('lastPrice', 0) or fast_info.get('last_price', 0),
                'change': 0,
                'changePercent': 0,
                'volume': fast_info.get('lastVolume', 0),
                'previousClose': fast_info.get('previousClose', 0) or fast_info.get('previous_close', 0),
                'high': fast_info.get('dayHigh', 0),
                'low': fast_info.get('dayLow', 0),
                'open': fast_info.get('open', 0)
            }
        else:
            quote = {
                'symbol': symbol,
                'price': info.get('regularMarketPrice', 0) or info.get('currentPrice', 0),
                'change': info.get('regularMarketChange', 0),
                'changePercent': info.get('regularMarketChangePercent', 0),
                'volume': info.get('regularMarketVolume', 0) or info.get('volume', 0),
                'previousClose': info.get('previousClose', 0) or info.get('regularMarketPreviousClose', 0),
                'high': info.get('dayHigh', 0) or info.get('regularMarketDayHigh', 0),
                'low': info.get('dayLow', 0) or info.get('regularMarketDayLow', 0),
                'open': info.get('open', 0) or info.get('regularMarketOpen', 0)
            }
        
        # Calculate change if not provided
        if quote['change'] == 0 and quote['previousClose'] > 0:
            quote['change'] = quote['price'] - quote['previousClose']
            quote['changePercent'] = (quote['change'] / quote['previousClose']) * 100
        
        return jsonify({
            'success': True,
            'quote': quote
        })
            
    except Exception as e:
        print(f"Error fetching quote for {symbol}: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@auth_bp.route('/stock-details/<symbol>', methods=['GET'])
def get_stock_details(symbol):
    """Get detailed stock information using yfinance"""
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        
        if not info:
            return jsonify({
                'success': False,
                'error': 'Stock not found'
            }), 404
        
        # Extract comprehensive stock details
        details = {
            'symbol': symbol,
            'shortName': info.get('shortName', symbol),
            'longName': info.get('longName', info.get('shortName', symbol)),
            'fullExchangeName': info.get('fullExchangeName', info.get('exchange', 'N/A')),
            'regularMarketPrice': info.get('regularMarketPrice', info.get('currentPrice', 0)),
            'regularMarketChange': info.get('regularMarketChange', 0),
            'regularMarketChangePercent': info.get('regularMarketChangePercent', 0),
            'currency': info.get('currency', 'USD'),
            'marketCap': info.get('marketCap', 0),
            'volume': info.get('volume', info.get('regularMarketVolume', 0)),
            'averageVolume': info.get('averageVolume', 0),
            'peRatio': info.get('trailingPE', info.get('forwardPE', 0)),
            'open': info.get('regularMarketOpen', info.get('open', 0)),
            'high': info.get('dayHigh', info.get('regularMarketDayHigh', 0)),
            'low': info.get('dayLow', info.get('regularMarketDayLow', 0)),
            'previousClose': info.get('previousClose', info.get('regularMarketPreviousClose', 0)),
            'divYield': info.get('dividendYield', 0),
            'beta': info.get('beta', 0),
            'eps': info.get('trailingEps', info.get('forwardEps', 0)),
            'description': info.get('longBusinessSummary', info.get('description', '')),
            'sector': info.get('sector', 'N/A'),
            'industry': info.get('industry', 'N/A'),
            'employees': info.get('fullTimeEmployees', 0),
            'website': info.get('website', ''),
            'fiftyTwoWeekHigh': info.get('fiftyTwoWeekHigh', 0),
            'fiftyTwoWeekLow': info.get('fiftyTwoWeekLow', 0),
            'priceToBook': info.get('priceToBook', 0),
            'profitMargins': info.get('profitMargins', 0),
            'debtToEquity': info.get('debtToEquity', 0)
        }
        
        return jsonify({
            'success': True,
            'details': details
        })
            
    except Exception as e:
        print(f"Error fetching details for {symbol}: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@auth_bp.route('/stock-quotes', methods=['POST'])
def get_multiple_quotes():
    """Get multiple stock quotes at once using yfinance"""
    try:
        data = request.get_json()
        symbols = data.get('symbols', [])
        
        if not symbols:
            return jsonify({'success': False, 'error': 'No symbols provided'}), 400
        
        print(f"📊 Fetching {len(symbols)} quotes: {symbols}")
        
        quotes = []
        for symbol in symbols[:15]:  # Limit to 15 symbols
            try:
                ticker = yf.Ticker(symbol)
                
                # Try fast_info first (faster)
                try:
                    fast_info = ticker.fast_info
                    price = fast_info.get('lastPrice', 0) or fast_info.get('last_price', 0)
                    prev_close = fast_info.get('previousClose', 0) or fast_info.get('previous_close', 0)
                    
                    if price > 0:
                        change = price - prev_close if prev_close > 0 else 0
                        change_percent = (change / prev_close * 100) if prev_close > 0 else 0
                        
                        quote = {
                            'symbol': symbol,
                            'price': price,
                            'change': change,
                            'changePercent': change_percent,
                            'volume': fast_info.get('lastVolume', 0),
                            'previousClose': prev_close
                        }
                        quotes.append(quote)
                        print(f"   {symbol}: ${price:.2f}")
                        continue
                except Exception as fast_error:
                    print(f"   Fast info failed for {symbol}, trying regular info...")
                
                # Fallback to regular info
                info = ticker.info
                if info and 'regularMarketPrice' in info:
                    quote = {
                        'symbol': symbol,
                        'price': info.get('regularMarketPrice', 0) or info.get('currentPrice', 0),
                        'change': info.get('regularMarketChange', 0),
                        'changePercent': info.get('regularMarketChangePercent', 0),
                        'volume': info.get('regularMarketVolume', 0),
                        'previousClose': info.get('previousClose', 0)
                    }
                    quotes.append(quote)
                    print(f"   {symbol}: ${quote['price']:.2f}")
                    
            except Exception as e:
                print(f"   Failed to get quote for {symbol}: {e}")
                continue
        
        print(f" Successfully fetched {len(quotes)}/{len(symbols)} quotes")
        
        return jsonify({
            'success': True,
            'quotes': quotes
        })
        
    except Exception as e:
        print(f" Error fetching multiple quotes: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def save_or_update_user(user_data):
    """Save or update user in database"""
    if db.client is None:
        raise Exception("Database not connected")
    
    try:
        users_collection = db.db['users']
        print(f"Attempting to save/update user: {user_data['email']}")
        
        # Check if user exists by Google ID
        existing_user = users_collection.find_one({'google_id': user_data['google_id']})
        print(f"Existing user found: {existing_user is not None}")
        
        if existing_user:
            # Update existing user
            users_collection.update_one(
                {'google_id': user_data['google_id']},
                {
                    '$set': {
                        'email': user_data['email'],
                        'name': user_data['name'],
                        'picture': user_data['picture'],
                        'verified_email': user_data['verified_email'],
                        'last_login': datetime.now(timezone.utc),
                        'updated_at': datetime.now(timezone.utc)
                    }
                }
            )
            return str(existing_user['_id'])
        else:
            # Create new user
            user_doc = {
                'google_id': user_data['google_id'],
                'email': user_data['email'],
                'name': user_data['name'],
                'picture': user_data['picture'],
                'verified_email': user_data['verified_email'],
                'created_at': datetime.now(timezone.utc),
                'updated_at': datetime.now(timezone.utc),
                'last_login': datetime.now(timezone.utc),
                'onboarding_completed': False
            }
            
            result = users_collection.insert_one(user_doc)
            print(f"New user created with ID: {result.inserted_id}")
            return str(result.inserted_id)
            
    except Exception as e:
        print(f"Error saving user: {e}")
        raise e