import google.generativeai as genai
from datetime import datetime

class GeminiService:
    def __init__(self, api_key):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
    
    def generate_daily_brief(self, market_news):
        """Generate daily market brief from news"""
        
        # Prepare news summary
        news_text = "\n".join([
            f"- {item.get('headline', '')} (Source: {item.get('source', 'Unknown')})"
            for item in market_news[:10]
        ])
        
        prompt = f"""You are a financial analyst creating a brief market summary for international students investing in US stocks.

Today's Date: {datetime.now().strftime('%B %d, %Y')}

Recent Market News:
{news_text}

Create a concise, student-friendly market brief with:
1. Overall market sentiment (2-3 sentences)
2. Key events affecting markets today (3-4 bullet points, no actual bullets just numbered)
3. One practical tip for international student investors (1 sentence)

Keep it under 200 words. Use clear, simple language. No jargon. Be objective and factual.
"""
        
        try:
            response = self.model.generate_content(prompt)
            return {
                'summary': response.text,
                'generated_at': datetime.now().isoformat(),
                'news_count': len(market_news)
            }
        except Exception as e:
            print(f"Gemini API error: {str(e)}")
            return {
                'summary': 'Unable to generate market brief at this time. Please try again later.',
                'generated_at': datetime.now().isoformat(),
                'error': str(e)
            }
    
    def analyze_stock(self, ticker, news, quote):
        """Analyze a specific stock"""
        
        current_price = quote.get('c', 0)
        change = quote.get('d', 0)
        change_percent = quote.get('dp', 0)
        
        news_text = "\n".join([
            f"- {item.get('headline', '')}"
            for item in news[:5]
        ])
        
        prompt = f"""You are analyzing {ticker} stock for an international student investor.

Current Price: ${current_price:.2f}
Today's Change: {change:+.2f} ({change_percent:+.2f}%)

Recent News (past 7 days):
{news_text if news_text else "No significant news in past week"}

Provide:
1. Sentiment: (Positive/Neutral/Negative) based on news and price action
2. Brief Analysis: (3-4 sentences explaining what's happening)
3. Student Consideration: (1-2 sentences on what international students should know - like currency risk, dividend tax, or volatility)

Keep it under 150 words total. Be factual and balanced. No buy/sell recommendations.
"""
        
        try:
            response = self.model.generate_content(prompt)
            return {
                'ticker': ticker,
                'analysis': response.text,
                'price': current_price,
                'change': change,
                'change_percent': change_percent,
                'news_count': len(news),
                'generated_at': datetime.now().isoformat()
            }
        except Exception as e:
            print(f"Gemini API error: {str(e)}")
            return {
                'ticker': ticker,
                'analysis': f'Analysis unavailable for {ticker}. Please try again later.',
                'price': current_price,
                'change': change,
                'change_percent': change_percent,
                'error': str(e)
            }