from pymongo import MongoClient
from datetime import datetime, timezone
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

class ReceiptDatabase:
    def __init__(self):
        self.mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
        self.database_name = os.getenv('DATABASE_NAME', 'receipt_scanner')
        self.collection_name = 'scanned_receipts'
        
        try:
            # Check if using local or Atlas MongoDB
            if 'localhost' in self.mongo_uri:
                # Local MongoDB connection (no SSL)
                self.client = MongoClient(
                    self.mongo_uri,
                    serverSelectionTimeoutMS=5000,
                    connectTimeoutMS=5000,
                    socketTimeoutMS=5000
                )
                print("Connecting to local MongoDB...")
            else:
                # MongoDB Atlas connection with SSL (Python 3.13 compatible)
                print("Attempting MongoDB Atlas connection...")
                try:
                    # Try with relaxed SSL config for Python 3.13 compatibility
                    self.client = MongoClient(
                        self.mongo_uri,
                        tls=True,
                        tlsAllowInvalidCertificates=True,
                        tlsInsecure=True,
                        serverSelectionTimeoutMS=15000,
                        connectTimeoutMS=15000,
                        socketTimeoutMS=15000
                    )
                    print("Using relaxed SSL configuration...")
                except Exception as ssl_error:
                    print(f"Relaxed SSL failed: {str(ssl_error)[:100]}...")
                    # Fallback to minimal configuration
                    try:
                        self.client = MongoClient(
                            self.mongo_uri,
                            serverSelectionTimeoutMS=10000
                        )
                        print("Using minimal Atlas configuration...")
                    except Exception as fallback_error:
                        print(f"All Atlas connection attempts failed: {str(fallback_error)[:100]}...")
                        raise fallback_error
            self.db = self.client[self.database_name]
            self.collection = self.db[self.collection_name]
            
            print("MongoDB client initialized (connection will be tested on first use)")
            
            # Create indexes for better performance (will be done on first use)
            # self.create_indexes()
            
        except Exception as e:
            print(f"MongoDB connection failed: {e}")
            print("Running without database functionality")
            self.client = None
    
    def create_indexes(self):
        """Create database indexes for better query performance"""
        try:
            self.collection.create_index([("user_id", 1)])
            self.collection.create_index([("scan_date", -1)])
            self.collection.create_index([("company_name", 1)])
            self.collection.create_index([("total_amount", 1)])
            self.collection.create_index([("confidence", 1)])
            print("Database indexes created")
        except Exception as e:
            print(f"Index creation failed: {e}")
    
    def save_receipt_scan(self, user_id, company_name, total_amount, confidence, extracted_text, scan_metadata=None):
        """Save a receipt scan to database"""
        if not self.client:
            return None
        
        try:
            receipt_document = {
                'user_id': user_id,
                'company_name': company_name,
                'total_amount': float(total_amount),
                'confidence': confidence,
                'extracted_text': extracted_text,
                'scan_date': datetime.now(timezone.utc),
                'metadata': scan_metadata or {},
                'created_at': datetime.now(timezone.utc),
                'updated_at': datetime.now(timezone.utc)
            }
            
            result = self.collection.insert_one(receipt_document)
            print(f" Receipt saved with ID: {result.inserted_id}")
            return str(result.inserted_id)
            
        except Exception as e:
            print(f" Failed to save receipt: {e}")
            return None
    
    def get_user_receipts(self, user_id, limit=50, skip=0):
        """Get all receipts for a user with pagination"""
        if not self.client:
            return []
        
        try:
            receipts = list(self.collection.find(
                {'user_id': user_id}
            ).sort('scan_date', -1).skip(skip).limit(limit))
            
            # Convert ObjectId to string for JSON serialization
            for receipt in receipts:
                receipt['_id'] = str(receipt['_id'])
            
            return receipts
            
        except Exception as e:
            print(f"Failed to get user receipts: {e}")
            return []
    
    def get_user_stats(self, user_id):
        """Get dashboard statistics for a user"""
        if not self.client:
            return None
        
        try:
            # Aggregation pipeline for user stats
            pipeline = [
                {'$match': {'user_id': user_id}},
                {'$group': {
                    '_id': None,
                    'total_receipts': {'$sum': 1},
                    'total_spent': {'$sum': '$total_amount'},
                    'avg_amount': {'$avg': '$total_amount'},
                    'max_amount': {'$max': '$total_amount'},
                    'min_amount': {'$min': '$total_amount'},
                    'high_confidence_count': {
                        '$sum': {'$cond': [{'$eq': ['$confidence', 'high']}, 1, 0]}
                    },
                    'medium_confidence_count': {
                        '$sum': {'$cond': [{'$eq': ['$confidence', 'medium']}, 1, 0]}
                    },
                    'low_confidence_count': {
                        '$sum': {'$cond': [{'$eq': ['$confidence', 'low']}, 1, 0]}
                    }
                }}
            ]
            
            result = list(self.collection.aggregate(pipeline))
            
            if result:
                stats = result[0]
                stats.pop('_id', None)  # Remove the _id field
                return stats
            else:
                return {
                    'total_receipts': 0,
                    'total_spent': 0.0,
                    'avg_amount': 0.0,
                    'max_amount': 0.0,
                    'min_amount': 0.0,
                    'high_confidence_count': 0,
                    'medium_confidence_count': 0,
                    'low_confidence_count': 0
                }
                
        except Exception as e:
            print(f" Failed to get user stats: {e}")
            return None
    
    def get_company_breakdown(self, user_id):
        """Get spending breakdown by company"""
        if not self.client:
            return []
        
        try:
            pipeline = [
                {'$match': {'user_id': user_id}},
                {'$group': {
                    '_id': '$company_name',
                    'total_spent': {'$sum': '$total_amount'},
                    'receipt_count': {'$sum': 1},
                    'avg_amount': {'$avg': '$total_amount'},
                    'last_visit': {'$max': '$scan_date'}
                }},
                {'$sort': {'total_spent': -1}},
                {'$limit': 20}
            ]
            
            result = list(self.collection.aggregate(pipeline))
            
            # Rename _id to company_name for clarity
            for item in result:
                item['company_name'] = item.pop('_id')
            
            return result
            
        except Exception as e:
            print(f" Failed to get company breakdown: {e}")
            return []
    
    def get_monthly_spending(self, user_id, months=12):
        """Get monthly spending trends"""
        if not self.client:
            return []
        
        try:
            pipeline = [
                {'$match': {'user_id': user_id}},
                {'$group': {
                    '_id': {
                        'year': {'$year': '$scan_date'},
                        'month': {'$month': '$scan_date'}
                    },
                    'total_spent': {'$sum': '$total_amount'},
                    'receipt_count': {'$sum': 1},
                    'avg_amount': {'$avg': '$total_amount'}
                }},
                {'$sort': {'_id.year': -1, '_id.month': -1}},
                {'$limit': months}
            ]
            
            result = list(self.collection.aggregate(pipeline))
            
            # Format the results
            formatted_results = []
            for item in result:
                formatted_results.append({
                    'year': item['_id']['year'],
                    'month': item['_id']['month'],
                    'total_spent': item['total_spent'],
                    'receipt_count': item['receipt_count'],
                    'avg_amount': item['avg_amount']
                })
            
            return formatted_results
            
        except Exception as e:
            print(f" Failed to get monthly spending: {e}")
            return []
    
    def delete_receipt(self, receipt_id, user_id):
        """Delete a specific receipt (with user verification)"""
        if not self.client:
            return False
        
        try:
            result = self.collection.delete_one({
                '_id': ObjectId(receipt_id),
                'user_id': user_id
            })
            
            return result.deleted_count > 0
            
        except Exception as e:
            print(f" Failed to delete receipt: {e}")
            return False
    
    def update_receipt(self, receipt_id, user_id, updates):
        """Update a receipt (user can manually correct OCR errors)"""
        if not self.client:
            return False
        
        try:
            updates['updated_at'] = datetime.now(timezone.utc)
            
            result = self.collection.update_one(
                {'_id': ObjectId(receipt_id), 'user_id': user_id},
                {'$set': updates}
            )
            
            return result.modified_count > 0
            
        except Exception as e:
            print(f" Failed to update receipt: {e}")
            return False