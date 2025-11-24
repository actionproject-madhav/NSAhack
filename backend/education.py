from flask import Blueprint, request, jsonify
from database import ReceiptDatabase
from datetime import datetime, timezone
from bson import ObjectId
from db_connection_helper import get_db_error_response, log_db_error

education_bp = Blueprint('education', __name__)
db = ReceiptDatabase()

@education_bp.route('/progress', methods=['GET'])
def get_education_progress():
    """Get user's education progress"""
    if not db.is_connected:
        log_db_error('get_education_progress')
        return jsonify(get_db_error_response()), 500
    
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
        
        users_collection = db.db['users']
        
        # Find user by ObjectId, email, or google_id
        user = None
        try:
            if len(user_id) == 24 and all(c in '0123456789abcdefABCDEF' for c in user_id):
                user = users_collection.find_one({'_id': ObjectId(user_id)})
        except:
            pass
        
        if not user:
            user = users_collection.find_one({'email': user_id})
        
        if not user:
            user = users_collection.find_one({'google_id': user_id})
        
        if not user:
            # Return default progress if user doesn't exist
            return jsonify({
                'success': True,
                'progress': {
                    'level': 1,
                    'xp': 0,
                    'streak': 0,
                    'hearts': 5,
                    'coins': 100,
                    'badges': [],
                    'unlockedIslands': ['unit-1'],
                    'completedLessons': [],
                    'powerups': {
                        'xpBoost': 0,
                        'streakFreeze': 0,
                        'heartRefill': 0
                    }
                }
            })
        
        # Get education progress from user document
        education_progress = user.get('education_progress', {})
        
        # Return progress with defaults if missing
        progress = {
            'level': education_progress.get('level', 1),
            'xp': education_progress.get('xp', 0),
            'streak': education_progress.get('streak', 0),
            'hearts': education_progress.get('hearts', 5),
            'coins': education_progress.get('coins', 100),
            'badges': education_progress.get('badges', []),
            'unlockedIslands': education_progress.get('unlockedIslands', ['unit-1']),
            'completedLessons': education_progress.get('completedLessons', []),
            'powerups': education_progress.get('powerups', {
                'xpBoost': 0,
                'streakFreeze': 0,
                'heartRefill': 0
            })
        }
        
        return jsonify({
            'success': True,
            'progress': progress
        })
        
    except Exception as e:
        print(f"❌ Error getting education progress: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@education_bp.route('/progress', methods=['POST'])
def save_education_progress():
    """Save user's education progress - non-blocking, auto-creates user if needed"""
    if not db.is_connected:
        log_db_error('save_education_progress')
        return jsonify(get_db_error_response()), 500
    
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
        
        # Extract education progress data
        progress_data = {
            'level': data.get('level', 1),
            'xp': data.get('xp', 0),
            'streak': data.get('streak', 0),
            'hearts': data.get('hearts', 5),
            'coins': data.get('coins', 100),
            'badges': data.get('badges', []),
            'unlockedIslands': data.get('unlockedIslands', ['unit-1']),
            'completedLessons': data.get('completedLessons', []),
            'powerups': data.get('powerups', {
                'xpBoost': 0,
                'streakFreeze': 0,
                'heartRefill': 0
            }),
            'updated_at': datetime.now(timezone.utc)
        }
        
        users_collection = db.db['users']
        
        # Find user by ObjectId, email, or google_id
        user = None
        try:
            if len(user_id) == 24 and all(c in '0123456789abcdefABCDEF' for c in user_id):
                user = users_collection.find_one({'_id': ObjectId(user_id)})
        except:
            pass
        
        if not user:
            user = users_collection.find_one({'email': user_id})
        
        if not user:
            user = users_collection.find_one({'google_id': user_id})
        
        if not user:
            # Auto-create user if they don't exist (similar to trading endpoints)
            print(f"⚠️ User not found for education progress: {user_id}, auto-creating user...")
            if '@' in user_id:  # If it's an email, create user
                from trading import STARTING_CASH
                new_user = {
                    'email': user_id,
                    'name': user_id.split('@')[0],
                    'cash_balance': STARTING_CASH,
                    'onboarding_completed': False,
                    'education_progress': progress_data,
                    'created_at': datetime.now(timezone.utc),
                    'updated_at': datetime.now(timezone.utc),
                    'last_login': datetime.now(timezone.utc)
                }
                result = users_collection.insert_one(new_user)
                user = users_collection.find_one({'_id': result.inserted_id})
                print(f"✅ Auto-created user for education progress: {user_id}")
            else:
                return jsonify({'error': 'User not found'}), 404
        
        # Update user's education progress
        result = users_collection.update_one(
            {'_id': user['_id']},
            {
                '$set': {
                    'education_progress': progress_data,
                    'updated_at': datetime.now(timezone.utc)
                }
            }
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Failed to update education progress'}), 500
        
        return jsonify({
            'success': True,
            'message': 'Education progress saved successfully'
        })
        
    except Exception as e:
        print(f"❌ Error saving education progress: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

