// Normalize API base URL (remove trailing slash to prevent double slashes)
const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');

export interface Transaction {
  type: 'buy' | 'sell';
  ticker: string;
  quantity: number;
  price: number;
  total: number;
  timestamp: string;
}

export interface TradeResult {
  success: boolean;
  message: string;
  transaction?: {
    ticker: string;
    quantity: number;
    price: number;
    total: number;
  };
  new_balance?: number;
  portfolio_value?: number;
  error?: string;
}

export interface BalanceResponse {
  success: boolean;
  cash_balance: number;
}

export interface PortfolioResponse {
  success: boolean;
  portfolio: any[];
  cash_balance: number;
  portfolio_value: number;
  total_account_value: number;
}

class TradingService {
  async getCashBalance(userId: string): Promise<number> {
    try {
      // Prefer email over Google ID for user lookup
      const userIdentifier = userId.includes('@') ? userId : userId;
      
      const response = await fetch(`${API_BASE}/api/trading/balance?user_id=${encodeURIComponent(userIdentifier)}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(errorData.error || `Failed to fetch balance: ${response.status}`);
      }
      
      const data: BalanceResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch balance');
      }
      
      return data.cash_balance;
    } catch (error: any) {
      console.error('Error fetching cash balance:', error);
      throw new Error(error.message || 'Failed to fetch balance');
    }
  }

  async buyStock(userId: string, ticker: string, quantity: number): Promise<TradeResult> {
    try {
      // Use email if userId is an ObjectId, or use userId directly if it's already an email
      const userIdentifier = userId.includes('@') ? userId : userId;
      console.log('🔵 TradingService.buyStock: Using user identifier:', userIdentifier, 'for ticker:', ticker, 'quantity:', quantity)
      
      const response = await fetch(`${API_BASE}/api/trading/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          user_id: userIdentifier,
          ticker: ticker.toUpperCase(),
          quantity: quantity
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        console.error('❌ TradingService.buyStock error:', response.status, errorData)
        throw new Error(errorData.error || `Failed to buy stock: ${response.status}`);
      }
      
      const data: TradeResult = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to buy stock');
      }
      
      return data;
    } catch (error: any) {
      console.error('Error buying stock:', error);
      throw error;
    }
  }

  async sellStock(userId: string, ticker: string, quantity: number): Promise<TradeResult> {
    try {
      // Use email if userId is an email, or use userId directly
      const userIdentifier = userId.includes('@') ? userId : userId;
      
      const response = await fetch(`${API_BASE}/api/trading/sell`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          user_id: userIdentifier,
          ticker: ticker.toUpperCase(),
          quantity: quantity
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(errorData.error || `Failed to sell stock: ${response.status}`);
      }
      
      const data: TradeResult = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to sell stock');
      }
      
      return data;
    } catch (error) {
      console.error('Error selling stock:', error);
      throw error;
    }
  }

  async getTransactionHistory(userId: string, limit: number = 50): Promise<Transaction[]> {
    try {
      // Prefer email over Google ID for user lookup
      const userIdentifier = userId.includes('@') ? userId : userId;
      
      const response = await fetch(`${API_BASE}/api/trading/transactions?user_id=${encodeURIComponent(userIdentifier)}&limit=${limit}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(errorData.error || `Failed to fetch transactions: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch transactions');
      }
      
      return data.transactions || [];
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  async getPortfolio(userId: string): Promise<PortfolioResponse> {
    try {
      // Prefer email over Google ID for user lookup
      const userIdentifier = userId.includes('@') ? userId : userId;
      
      const response = await fetch(`${API_BASE}/api/trading/portfolio?user_id=${encodeURIComponent(userIdentifier)}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(errorData.error || `Failed to fetch portfolio: ${response.status}`);
      }
      
      const data: PortfolioResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch portfolio');
      }
      
      return data;
    } catch (error: any) {
      console.error('Error fetching portfolio:', error);
      throw error;
    }
  }
}

export default new TradingService();

