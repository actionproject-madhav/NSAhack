import requests
from datetime import datetime, timedelta

class FinnhubService:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://finnhub.io/api/v1"
    
    def _make_request(self, endpoint, params=None):
        """Make API request to Finnhub"""
        if params is None:
            params = {}
        params['token'] = self.api_key
        
        try:
            response = requests.get(f"{self.base_url}/{endpoint}", params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Finnhub API error: {str(e)}")
            return None
    
    def get_market_news(self, category='general', limit=20):
        """Get general market news"""
        data = self._make_request('news', {'category': category})
        if data:
            return data[:limit]
        return []
    
    def get_company_news(self, ticker, days=7):
        """Get company-specific news"""
        to_date = datetime.now().strftime('%Y-%m-%d')
        from_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
        
        data = self._make_request(
            f'company-news',
            {
                'symbol': ticker,
                'from': from_date,
                'to': to_date
            }
        )
        return data if data else []
    
    def get_quote(self, ticker):
        """Get real-time quote for a stock"""
        data = self._make_request('quote', {'symbol': ticker})
        return data
    
    def get_company_profile(self, ticker):
        """Get company profile information"""
        data = self._make_request('stock/profile2', {'symbol': ticker})
        return data

