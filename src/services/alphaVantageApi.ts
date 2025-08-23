const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || 'demo'
const BASE_URL = 'https://www.alphavantage.co/query'

// Rate limiting for production use
class RateLimiter {
  private lastRequestTime = 0
  private readonly requestInterval = 12000 // 12 seconds between requests for free tier

  async throttle(): Promise<void> {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    
    if (timeSinceLastRequest < this.requestInterval) {
      const waitTime = this.requestInterval - timeSinceLastRequest
      console.log(`Rate limiting: waiting ${waitTime}ms before next request`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
    
    this.lastRequestTime = Date.now()
  }
}

const rateLimiter = new RateLimiter()

export interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  previousClose: number
}

export interface SearchResult {
  symbol: string
  name: string
  type: string
  region: string
  marketOpen: string
  marketClose: string
  timezone: string
  currency: string
  matchScore: string
}

export interface TimeSeriesData {
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface IntradayResponse {
  'Meta Data': {
    '1. Information': string
    '2. Symbol': string
    '3. Last Refreshed': string
    '4. Interval': string
    '5. Output Size': string
    '6. Time Zone': string
  }
  [key: string]: any
}

export interface DailyResponse {
  'Meta Data': {
    '1. Information': string
    '2. Symbol': string
    '3. Last Refreshed': string
    '4. Output Size': string
    '5. Time Zone': string
  }
  'Time Series (Daily)': {
    [date: string]: {
      '1. open': string
      '2. high': string
      '3. low': string
      '4. close': string
      '5. volume': string
    }
  }
}

export interface GlobalQuoteResponse {
  'Global Quote': {
    '01. symbol': string
    '02. open': string
    '03. high': string
    '04. low': string
    '05. price': string
    '06. volume': string
    '07. latest trading day': string
    '08. previous close': string
    '09. change': string
    '10. change percent': string
  }
  'Error Message'?: string
}

// Helper function to make API requests with rate limiting
const makeRequest = async (params: Record<string, string>): Promise<any> => {
  await rateLimiter.throttle()
  
  const url = new URL(BASE_URL)
  url.searchParams.append('apikey', API_KEY)
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })

  console.log('Making API request to:', url.toString())

  try {
    const response = await fetch(url.toString())
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Check for API error messages
    if (data['Error Message']) {
      throw new Error(`Alpha Vantage API Error: ${data['Error Message']}`)
    }
    
    if (data['Note']) {
      console.warn('Alpha Vantage API Note:', data['Note'])
      // Don't throw on rate limit notes, just warn
      if (data['Note'].includes('rate limit')) {
        console.log('Rate limit hit, but continuing with available data')
      }
    }
    
    return data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

class AlphaVantageAPI {
  async searchSymbols(keywords: string): Promise<SearchResult[]> {
    try {
      const params = {
        function: 'SYMBOL_SEARCH',
        keywords: keywords.trim()
      }

      console.log('Searching for:', keywords)
      const data = await makeRequest(params)
      console.log('Search response:', data)
      
      if (data['Error Message']) {
        console.error('API Error:', data['Error Message'])
        throw new Error(data['Error Message'])
      }

      if (!data.bestMatches || data.bestMatches.length === 0) {
        console.log('No matches found for:', keywords)
        return []
      }

      const results = data.bestMatches.map((match: any) => ({
        symbol: match['1. symbol'] || '',
        name: match['2. name'] || '',
        type: match['3. type'] || 'Equity',
        region: match['4. region'] || 'United States',
        marketOpen: match['5. marketOpen'] || '09:30',
        marketClose: match['6. marketClose'] || '16:00',
        timezone: match['7. timezone'] || 'UTC-04',
        currency: match['8. currency'] || 'USD',
        matchScore: match['9. matchScore'] || '0.0000'
      }))

      console.log('Processed results:', results)
      return results
    } catch (error) {
      console.error('Search symbols error:', error)
      return []
    }
  }

  async getGlobalQuote(symbol: string): Promise<StockQuote> {
    const data = await makeRequest({
      function: 'GLOBAL_QUOTE',
      symbol: symbol
    });

    const quote = data['Global Quote'];
    if (!quote) {
      throw new Error('No quote data found');
    }

    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
      previousClose: parseFloat(quote['08. previous close'])
    };
  }

  async getIntradayData(symbol: string, interval: '1min' | '5min' | '15min' | '30min' | '60min' = '5min'): Promise<TimeSeriesData[]> {
    const data = await makeRequest({
      function: 'TIME_SERIES_INTRADAY',
      symbol: symbol,
      interval: interval,
      outputsize: 'compact'
    });

    const timeSeriesKey = `Time Series (${interval})`;
    if (!data[timeSeriesKey]) {
      throw new Error('No intraday data found');
    }

    return Object.entries(data[timeSeriesKey])
      .map(([timestamp, values]: [string, any]) => ({
        timestamp,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume'])
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async getDailyData(symbol: string): Promise<TimeSeriesData[]> {
    const params = {
      function: 'TIME_SERIES_DAILY',
      symbol: symbol,
      outputsize: 'compact'
    };

    const data = await makeRequest(params);
    
    if (!data['Time Series (Daily)']) {
      throw new Error('No daily data found');
    }

    return Object.entries(data['Time Series (Daily)'])
      .map(([timestamp, values]: [string, any]) => ({
        timestamp,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume'])
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async getMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
    const quotes: StockQuote[] = [];
    for (const symbol of symbols) {
      try {
        const quote = await this.getGlobalQuote(symbol);
        quotes.push(quote);
      } catch (error) {
        console.error(`Failed to fetch quote for ${symbol}:`, error);
        // Continue with other symbols even if one fails
      }
    }
    return quotes.filter(result => result !== null);
  }

  async getTopGainersLosers(): Promise<any> {
    const data = await makeRequest({
      function: 'TOP_GAINERS_LOSERS'
    });
    return data;
  }

  async getCompanyOverview(symbol: string): Promise<any> {
    const data = await makeRequest({
      function: 'OVERVIEW',
      symbol: symbol
    });
    return data;
  }

  async getNewsAndSentiment(tickers?: string, topics?: string, limit: number = 50): Promise<any> {
    const params: Record<string, string> = {
      function: 'NEWS_SENTIMENT',
      limit: limit.toString()
    };
    
    if (tickers) params.tickers = tickers;
    if (topics) params.topics = topics;
    
    const data = await makeRequest(params);
    return data;
  }
}

export const alphaVantageAPI = new AlphaVantageAPI();
