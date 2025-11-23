// Comprehensive API service for all backend operations
// Normalize API base URL (remove trailing slash to prevent double slashes)
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '')

export interface PortfolioItem {
  ticker: string
  company: string
  quantity: number
  avgPrice: number
  currentPrice: number
  reason: string
}

export interface UserProfile {
  _id: string
  email: string
  name: string
  picture?: string
  investment_goal?: string
  language?: string
  lifestyle_brands?: string[]
  visa_status?: string
  home_country?: string
  portfolio?: PortfolioItem[]
  total_value?: number
  onboarding_completed?: boolean
}

export interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume?: number
  previousClose?: number
  high?: number
  low?: number
  open?: number
}

class APIService {
  // ===== USER PROFILE =====
  
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/user/${userId}`, {
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      return data.success ? data.user : null
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }
  
  async updateOnboarding(userId: string, onboardingData: {
    lifestyle_brands?: string[]
    investment_goal?: string
    language?: string
    visa_status?: string
    home_country?: string
    portfolio?: PortfolioItem[]
    total_value?: number
  }): Promise<boolean> {
    // Create AbortController for proper request cancellation
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout
    
    try {
      // Prefer email over Google ID for user lookup
      const userIdentifier = userId.includes('@') ? userId : userId;
      
      const response = await fetch(`${API_BASE_URL}/auth/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        signal: controller.signal, // Enable request cancellation
        body: JSON.stringify({
          user_id: userIdentifier,
          ...onboardingData
        })
      })
      
      clearTimeout(timeoutId) // Clear timeout if request succeeds
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        console.error('Onboarding error:', errorData);
        throw new Error(errorData.error || `Failed to save onboarding: ${response.status}`);
      }
      
      const data = await response.json()
      return data.success || false
    } catch (error: any) {
      clearTimeout(timeoutId) // Clear timeout on error
      
      // Handle abort errors gracefully
      if (error.name === 'AbortError' || error.message?.includes('aborted')) {
        throw new Error('Request timeout')
      }
      
      console.error('Error updating onboarding:', error)
      throw error
    }
  }
  
  // ===== PORTFOLIO MANAGEMENT =====
  
  async updatePortfolio(userId: string, portfolio: PortfolioItem[], totalValue: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          user_id: userId,
          portfolio,
          total_value: totalValue
        })
      })
      
      const data = await response.json()
      return data.success || false
    } catch (error) {
      console.error('Error updating portfolio:', error)
      return false
    }
  }
  
  // ===== STOCK QUOTES =====
  
  async getStockQuote(symbol: string): Promise<StockQuote | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/stock-quote/${symbol}`, {
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      return data.success ? data.quote : null
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error)
      return null
    }
  }
  
  async getStockDetails(symbol: string): Promise<any | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/stock-details/${symbol}`, {
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      return data.success ? data.details : null
    } catch (error) {
      console.error(`Error fetching stock details for ${symbol}:`, error)
      return null
    }
  }
  
  async getMultipleStockQuotes(symbols: string[]): Promise<StockQuote[]> {
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
      return data.success ? data.quotes : []
    } catch (error) {
      console.error('Error fetching multiple quotes:', error)
      return []
    }
  }
  
  // ===== PORTFOLIO SYNC =====
  
  /**
   * Sync portfolio with latest stock prices from the backend
   */
  async syncPortfolioWithRealPrices(portfolio: PortfolioItem[]): Promise<PortfolioItem[]> {
    if (!portfolio || portfolio.length === 0) {
      return []
    }
    
    try {
      const symbols = portfolio.map(item => item.ticker)
      const quotes = await this.getMultipleStockQuotes(symbols)
      
      // Create a map of symbol -> quote for quick lookup
      const quoteMap = new Map(quotes.map(q => [q.symbol, q]))
      
      // Update portfolio with real prices
      return portfolio.map(item => {
        const quote = quoteMap.get(item.ticker)
        if (quote && quote.price > 0) {
          return {
            ...item,
            currentPrice: quote.price
          }
        }
        return item
      })
    } catch (error) {
      console.error('Error syncing portfolio prices:', error)
      return portfolio
    }
  }
  
  /**
   * Calculate portfolio total value from synced prices
   */
  calculatePortfolioValue(portfolio: PortfolioItem[]): number {
    return portfolio.reduce((total, item) => {
      return total + (item.quantity * item.currentPrice)
    }, 0) 
  }
}

export const apiService = new APIService()
export default apiService

