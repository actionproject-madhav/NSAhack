from flask import Blueprint, request, jsonify, redirect, session, url_for
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from google_auth_oauthlib.flow import Flow
import os
from dotenv import load_dotenv
from database import ReceiptDatabase
from datetime import datetime, timezone
import json

load_dotenv()

auth_bp = Blueprint('auth', __name__)
db = ReceiptDatabase()

# Google OAuth configuration
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI')

print(f"Google Client ID loaded: {GOOGLE_CLIENT_ID[:50]}..." if GOOGLE_CLIENT_ID else "Google Client ID not found!")
print(f"Google Client Secret loaded: {'Yes' if GOOGLE_CLIENT_SECRET else 'No'}")

# Create OAuth flow
def create_flow():
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
        frontend_url = f"http://localhost:5173/onboarding?user_id={user_id}&email={user_data['email']}&name={user_data['name']}"
        return redirect(frontend_url)
        
    except Exception as e:
        print(f"Error in Google callback: {e}")
        # Redirect to frontend with error
        return redirect(f"http://localhost:5173/auth?error=authentication_failed")

@auth_bp.route('/verify-token', methods=['POST'])
def verify_google_token():
    """Verify Google ID token from frontend"""
    try:
        data = request.get_json()
        token = data.get('token')
        
        if not token:
            return jsonify({'error': 'Token is required'}), 400
        
        # Verify the token
        id_info = id_token.verify_oauth2_token(
            token,
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