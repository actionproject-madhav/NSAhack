// Stock quotes via backend proxy (uses Yahoo Finance - FREE, no API key needed!)
// Normalize API base URL (remove trailing slash to prevent double slashes)
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '')

export interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  open: number
  previousClose: number
  timestamp: number
}

class StockAPI {
  async getQuote(symbol: string): Promise<StockQuote> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/stock-quote/${symbol}`, {
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success && data.quote) {
        return {
          symbol: data.quote.symbol,
          price: data.quote.price || 0,
          change: data.quote.change || 0,
          changePercent: data.quote.changePercent || 0,
          high: data.quote.high || 0,
          low: data.quote.low || 0,
          open: data.quote.open || 0,
          previousClose: data.quote.previousClose || 0,
          timestamp: Date.now()
        }
      }

      throw new Error('No quote data')
    } catch (error) {
      console.error(`Failed to fetch quote for ${symbol}:`, error)
      return {
        symbol,
        price: 0,
        change: 0,
        changePercent: 0,
        high: 0,
        low: 0,
        open: 0,
        previousClose: 0,
        timestamp: Date.now()
      }
    }
  }

  async getMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
    console.log(` Fetching ${symbols.length} quotes via backend proxy...`)
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/stock-quotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ symbols })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success && data.quotes) {
        const quotes: StockQuote[] = data.quotes.map((q: any) => ({
          symbol: q.symbol,
          price: q.price || 0,
          change: q.change || 0,
          changePercent: q.changePercent || 0,
          high: q.high || 0,
          low: q.low || 0,
          open: q.open || 0,
          previousClose: q.previousClose || 0,
          timestamp: Date.now()
        }))
        
        console.log(`Got ${quotes.length}/${symbols.length} valid quotes`)
        return quotes.filter(q => q.price > 0)
      }

      return []
    } catch (error) {
      console.error('Failed to fetch multiple quotes:', error)
      return []
    }
  }

  async getCompanyProfile(symbol: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/stock-profile/${symbol}`, {
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      return data.success ? data.profile : null
    } catch (error) {
      console.error(`Failed to fetch profile for ${symbol}:`, error)
      return null
    }
  }
}

export const finnhubAPI = new StockAPI()
export default finnhubAPI

