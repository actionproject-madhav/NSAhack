"""Helper function for database connection error messages"""
import os

def get_db_error_response():
    """Get a standardized error response for database connection failures"""
    return {
        'error': 'Database not connected',
        'message': 'MongoDB connection failed. Please check backend logs and ensure MONGO_URI and DATABASE_NAME environment variables are set correctly.',
        'check': [
            'MONGO_URI environment variable is set',
            'DATABASE_NAME environment variable is set',
            'MongoDB Atlas network access allows Render IPs (0.0.0.0/0)',
            'MongoDB credentials are correct'
        ],
        'env_check': {
            'MONGO_URI': 'Set' if os.getenv('MONGO_URI') else 'Missing',
            'DATABASE_NAME': 'Set' if os.getenv('DATABASE_NAME') else 'Missing'
        }
    }

def log_db_error(endpoint_name):
    """Log database connection error for debugging"""
    print(f" {endpoint_name} endpoint called but database is not connected!")
    print(f"   MONGO_URI set: {'Yes' if os.getenv('MONGO_URI') else 'No'}")
    print(f"   DATABASE_NAME set: {'Yes' if os.getenv('DATABASE_NAME') else 'No'}")
    if os.getenv('MONGO_URI'):
        mongo_uri = os.getenv('MONGO_URI')
        print(f"   MONGO_URI preview: {mongo_uri[:50]}...")

