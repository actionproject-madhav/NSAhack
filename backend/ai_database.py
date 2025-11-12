from database import ReceiptDatabase
from datetime import datetime, timedelta

class AIDatabase:
    def __init__(self):
        self.db = ReceiptDatabase()
        self.briefs_collection = self.db.db['ai_daily_briefs']
        self.stock_cache_collection = self.db.db['ai_stock_cache']
    
    def get_cached_brief(self):
        """Get today's cached brief if exists"""
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        
        brief = self.briefs_collection.find_one({
            'date': {'$gte': today}
        }, sort=[('created_at', -1)])
        
        if brief:
            brief['_id'] = str(brief['_id'])
            return brief
        return None
    
    def cache_brief(self, brief_data):
        """Cache daily brief"""
        document = {
            'date': datetime.now(),
            'summary': brief_data.get('summary'),
            'news_count': brief_data.get('news_count'),
            'generated_at': brief_data.get('generated_at'),
            'created_at': datetime.now()
        }
        
        self.briefs_collection.insert_one(document)
    
    def get_cached_stock_analysis(self, ticker):
        """Get cached stock analysis if recent (within 4 hours)"""
        cutoff = datetime.now() - timedelta(hours=4)
        
        analysis = self.stock_cache_collection.find_one({
            'ticker': ticker,
            'created_at': {'$gte': cutoff}
        }, sort=[('created_at', -1)])
        
        if analysis:
            analysis['_id'] = str(analysis['_id'])
            return analysis
        return None
    
    def cache_stock_analysis(self, ticker, analysis_data):
        """Cache stock analysis"""
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
        
        self.stock_cache_collection.insert_one(document)