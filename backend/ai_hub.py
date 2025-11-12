from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import os
from finhub_service import FinnhubService
from gemini_service import GeminiService
from ai_database import AIDatabase

ai_hub_bp = Blueprint('ai_hub', __name__)

# Initialize services
finnhub = FinnhubService(os.getenv('FINNHUB_API_KEY'))
gemini = GeminiService(os.getenv('GEMINI_API_KEY'))
ai_db = AIDatabase()

@ai_hub_bp.route('/daily-brief', methods=['GET'])
def get_daily_brief():
    """Get cached daily market brief or generate new one"""
    try:
        # Check cache first
        cached_brief = ai_db.get_cached_brief()
        if cached_brief:
            return jsonify({
                'success': True,
                'data': cached_brief,
                'cached': True
            })
        
        # Generate new brief
        market_news = finnhub.get_market_news(limit=10)
        
        if not market_news:
            return jsonify({
                'success': False,
                'error': 'Unable to fetch market news'
            }), 500
        
        # Generate AI summary
        brief = gemini.generate_daily_brief(market_news)
        
        # Cache it
        ai_db.cache_brief(brief)
        
        return jsonify({
            'success': True,
            'data': brief,
            'cached': False
        })
        
    except Exception as e:
        print(f"Error in daily brief: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@ai_hub_bp.route('/stock-intelligence', methods=['POST'])
def get_stock_intelligence():
    """Get AI analysis for a specific stock"""
    try:
        data = request.get_json()
        ticker = data.get('ticker', '').upper()
        
        if not ticker:
            return jsonify({
                'success': False,
                'error': 'Ticker symbol required'
            }), 400
        
        # Check cache
        cached = ai_db.get_cached_stock_analysis(ticker)
        if cached:
            return jsonify({
                'success': True,
                'data': cached,
                'cached': True
            })
        
        # Fetch fresh data
        stock_news = finnhub.get_company_news(ticker, days=7)
        stock_quote = finnhub.get_quote(ticker)
        
        if not stock_quote:
            return jsonify({
                'success': False,
                'error': 'Invalid ticker or no data available'
            }), 404
        
        # Generate AI analysis
        analysis = gemini.analyze_stock(ticker, stock_news, stock_quote)
        
        # Cache it
        ai_db.cache_stock_analysis(ticker, analysis)
        
        return jsonify({
            'success': True,
            'data': analysis,
            'cached': False
        })
        
    except Exception as e:
        print(f"Error in stock intelligence: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@ai_hub_bp.route('/international-stocks', methods=['GET'])
def get_international_stocks():
    """Get popular international stocks analysis"""
    try:
        # Popular international stocks
        intl_tickers = ['BABA', 'TSM', 'NIO', 'SE', 'BIDU', 'JD']
        
        stocks_data = []
        for ticker in intl_tickers:
            quote = finnhub.get_quote(ticker)
            if quote:
                stocks_data.append({
                    'ticker': ticker,
                    'price': quote.get('c', 0),
                    'change': quote.get('d', 0),
                    'change_percent': quote.get('dp', 0)
                })
        
        return jsonify({
            'success': True,
            'data': stocks_data
        })
        
    except Exception as e:
        print(f"Error in international stocks: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@ai_hub_bp.route('/watchlist-monitor', methods=['POST'])
def monitor_watchlist():
    """Monitor user's watchlist for alerts"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        tickers = data.get('tickers', [])
        
        if not user_id or not tickers:
            return jsonify({
                'success': False,
                'error': 'user_id and tickers required'
            }), 400
        
        alerts = []
        for ticker in tickers:
            # Check for recent news
            news = finnhub.get_company_news(ticker, days=1)
            if len(news) >= 3:  # Multiple news items = something significant
                quote = finnhub.get_quote(ticker)
                alert = {
                    'ticker': ticker,
                    'news_count': len(news),
                    'price': quote.get('c', 0),
                    'change_percent': quote.get('dp', 0),
                    'latest_headline': news[0].get('headline', '') if news else ''
                }
                alerts.append(alert)
        
        return jsonify({
            'success': True,
            'data': alerts
        })
        
    except Exception as e:
        print(f"Error in watchlist monitor: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@ai_hub_bp.route('/trending-stocks', methods=['GET'])
def get_trending_stocks():
    """Get trending stocks based on news volume"""
    try:
        # Popular tickers for students
        popular_tickers = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META']
        
        trending = []
        for ticker in popular_tickers:
            news = finnhub.get_company_news(ticker, days=1)
            quote = finnhub.get_quote(ticker)
            
            if quote and news:
                trending.append({
                    'ticker': ticker,
                    'price': quote.get('c', 0),
                    'change_percent': quote.get('dp', 0),
                    'news_count': len(news),
                    'trending_score': len(news) * abs(quote.get('dp', 0))
                })
        
        # Sort by trending score
        trending.sort(key=lambda x: x['trending_score'], reverse=True)
        
        return jsonify({
            'success': True,
            'data': trending[:5]  # Top 5
        })
        
    except Exception as e:
        print(f"Error in trending stocks: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500