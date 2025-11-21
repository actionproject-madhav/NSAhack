from database import ReceiptDatabase
from datetime import datetime, timedelta

class AIDatabase:
    def __init__(self):
        self.receipt_db = ReceiptDatabase()
        # Access the database object from ReceiptDatabase
        if self.receipt_db.client is None or not hasattr(self.receipt_db, 'db') or self.receipt_db.db is None:
            print("⚠️  AIDatabase: MongoDB connection not available")
            self.briefs_collection = None
            self.stock_cache_collection = None
        else:
            self.briefs_collection = self.receipt_db.db['ai_daily_briefs']
            self.stock_cache_collection = self.receipt_db.db['ai_stock_cache']
    
    def get_cached_brief(self):
        """Get today's cached brief if exists"""
        if self.briefs_collection is None:
            return None
        
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        
        try:
        brief = self.briefs_collection.find_one({
            'date': {'$gte': today}
        }, sort=[('created_at', -1)])
        
        if brief:
            brief['_id'] = str(brief['_id'])
            return brief
        except Exception as e:
            print(f"Error getting cached brief: {e}")
        
        return None
    
    def cache_brief(self, brief_data):
        """Cache daily brief"""
        if self.briefs_collection is None:
            return
        
        document = {
            'date': datetime.now(),
            'summary': brief_data.get('summary'),
            'news_count': brief_data.get('news_count'),
            'generated_at': brief_data.get('generated_at'),
            'created_at': datetime.now()
        }
        
        try:
        self.briefs_collection.insert_one(document)
        except Exception as e:
            print(f"Error caching brief: {e}")
    
    def get_cached_stock_analysis(self, ticker):
        """Get cached stock analysis if recent (within 4 hours)"""
        if self.stock_cache_collection is None:
            return None
        
        cutoff = datetime.now() - timedelta(hours=4)
        
        try:
        analysis = self.stock_cache_collection.find_one({
            'ticker': ticker,
            'created_at': {'$gte': cutoff}
        }, sort=[('created_at', -1)])
        
        if analysis:
            analysis['_id'] = str(analysis['_id'])
            return analysis
        except Exception as e:
            print(f"Error getting cached stock analysis: {e}")
        
        return None
    
    def cache_stock_analysis(self, ticker, analysis_data):
        """Cache stock analysis"""
        if self.stock_cache_collection is None:
            return
        
        document = {
            'ticker': ticker,
            'analysis': analysis_data.get('analysis'),
            'price': analysis_data.get('price'),
            'change': analysis_data.get('change'),
            'change_percent': analysis_data.get('change_percent'),
            'news_count': analysis_data.get('news_count'),
            'generated_at': analysis_data.get('generated_at'),
            'created_at': datetime.now()
        }
        
        try:
        self.stock_cache_collection.insert_one(document)
        except Exception as e:
            print(f"Error caching stock analysis: {e}")