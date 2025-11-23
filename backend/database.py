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
        
        # Log environment check at startup
        print("=" * 60)
        print("DATABASE INITIALIZATION")
        print("=" * 60)
        print(f"MONGO_URI: {'✅ Set' if self.mongo_uri and self.mongo_uri != 'mongodb://localhost:27017/' else '❌ Missing or default'}")
        if self.mongo_uri and self.mongo_uri != 'mongodb://localhost:27017/':
            # Show preview (first 40 chars + last 20 chars for security)
            preview = self.mongo_uri[:40] + "..." + self.mongo_uri[-20:] if len(self.mongo_uri) > 60 else self.mongo_uri
            print(f"  Preview: {preview}")
        print(f"DATABASE_NAME: {'✅ Set' if self.database_name else '❌ Missing'}")
        if self.database_name:
            print(f"  Value: {self.database_name}")
        print("=" * 60)
        self.collection_name = 'scanned_receipts'
        
        # LAZY CONNECTION: Don't test during init (Render free tier cold starts are slow)
        # Connection will be tested on first actual use
        self.client = None
        self.db = None
        self._connection_attempted = False
        
        try:
            # Check if using local or Atlas MongoDB
            if 'localhost' in self.mongo_uri:
                # Local MongoDB connection (no SSL)
                print("Configuring local MongoDB connection...")
                self._mongo_uri = self.mongo_uri
                self._is_local = True
            else:
                # MongoDB Atlas connection with SSL
                print("Configuring MongoDB Atlas connection...")
                print(f"MongoDB URI: {self.mongo_uri[:50]}...")
                
                # Ensure URI has proper SSL parameters
                mongo_uri = self.mongo_uri
                if 'ssl=true' not in mongo_uri.lower() and 'tls=true' not in mongo_uri.lower():
                    # Add SSL parameters if not present
                    separator = '&' if '?' in mongo_uri else '?'
                    mongo_uri = f"{mongo_uri}{separator}tls=true"
                
                self._mongo_uri = mongo_uri
                self._is_local = False
            
            print("✅ MongoDB client configured (lazy connection - will connect on first use)")
            print("   This helps with Render free tier cold starts")
            
        except Exception as e:
            error_msg = str(e)
            print("=" * 60)
            print("❌ MONGODB CONFIGURATION FAILED")
            print("=" * 60)
            print(f"Error: {error_msg}")
            print(f"MONGO_URI set: {'Yes' if self.mongo_uri and self.mongo_uri != 'mongodb://localhost:27017/' else 'No'}")
            if self.mongo_uri:
                print(f"MONGO_URI preview: {self.mongo_uri[:50]}...")
            print(f"DATABASE_NAME: {self.database_name}")
            print("=" * 60)
            self.client = None
            self.db = None
    
    def _ensure_connection(self):
        """Lazy connection - connect on first use (better for Render free tier)"""
        if self.client is not None:
            return True
        
        if self._connection_attempted:
            return False
        
        self._connection_attempted = True
        
        try:
            if self._is_local:
                # Local MongoDB connection
                print("Connecting to local MongoDB...")
                self.client = MongoClient(
                    self._mongo_uri,
                    serverSelectionTimeoutMS=10000,
                    connectTimeoutMS=10000,
                    socketTimeoutMS=10000
                )
            else:
                # MongoDB Atlas connection - try multiple methods
                print("Attempting MongoDB Atlas connection (Render-friendly with long timeouts)...")
                
                # Method 1: Try with explicit TLS
                try:
                    import ssl
                    import certifi
                    print("Trying TLS with certifi...")
                    self.client = MongoClient(
                        self._mongo_uri,
                        tls=True,
                        tlsCAFile=certifi.where(),
                        serverSelectionTimeoutMS=60000,  # 60s for Render cold starts
                        connectTimeoutMS=60000,
                        socketTimeoutMS=60000,
                        retryWrites=True,
                        retryReads=True,
                        maxPoolSize=10
                    )
                    # Test connection (with timeout)
                    self.client.admin.command('ping')
                    print("✅ MongoDB Atlas connection successful (TLS with certifi)!")
                except Exception as ssl_error:
                    print(f"⚠️  TLS with certifi failed: {str(ssl_error)[:150]}...")
                    # Method 2: Try URI-only (pymongo handles SSL automatically)
                    try:
                        print("Trying URI-only connection (pymongo auto-SSL)...")
                        self.client = MongoClient(
                            self._mongo_uri,
                            serverSelectionTimeoutMS=60000,  # 60s for Render cold starts
                            connectTimeoutMS=60000,
                            socketTimeoutMS=60000,
                            retryWrites=True,
                            retryReads=True,
                            maxPoolSize=10
                        )
                        # Test connection
                        self.client.admin.command('ping')
                        print("✅ MongoDB Atlas connection successful (URI-only)!")
                    except Exception as fallback_error:
                        print(f"❌ All connection attempts failed: {str(fallback_error)[:200]}...")
                        print("⚠️  Will retry on next request")
                        self.client = None
                        self._connection_attempted = False  # Allow retry
                        return False
            
            if self.client:
                self.db = self.client[self.database_name]
                self.collection = self.db[self.collection_name]
                print(f"✅ Connected to database: {self.database_name}")
                return True
            else:
                return False
                
        except Exception as e:
            error_msg = str(e)
            print("=" * 60)
            print("❌ MONGODB CONNECTION ATTEMPT FAILED")
            print("=" * 60)
            print(f"Error: {error_msg}")
            print(f"MONGO_URI set: {'Yes' if self.mongo_uri and self.mongo_uri != 'mongodb://localhost:27017/' else 'No'}")
            if self.mongo_uri:
                print(f"MONGO_URI preview: {self.mongo_uri[:50]}...")
            print(f"DATABASE_NAME: {self.database_name}")
            print("=" * 60)
            print("⚠️  Will retry on next request (Render cold starts can be slow)")
            print("=" * 60)
            self.client = None
            self.db = None
            self._connection_attempted = False  # Allow retry
            return False
    
    @property
    def is_connected(self):
        """Check if database is connected, attempting connection if needed"""
        if self.client is not None:
            return True
        return self._ensure_connection()
    
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
        if not self._ensure_connection():
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
        if not self._ensure_connection():
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
        if not self._ensure_connection():
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
        if not self._ensure_connection():
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
        if not self._ensure_connection():
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
        if not self._ensure_connection():
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
        if not self._ensure_connection():
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