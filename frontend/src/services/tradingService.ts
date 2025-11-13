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
      const response = await fetch(`${API_BASE}/api/trading/balance?user_id=${encodeURIComponent(userId)}`);
      const data: BalanceResponse = await response.json();
      
      if (!data.success) {
        throw new Error('Failed to fetch balance');
      }
      
      return data.cash_balance;
    } catch (error) {
      console.error('Error fetching cash balance:', error);
      throw error;
    }
  }

  async buyStock(userId: string, ticker: string, quantity: number): Promise<TradeResult> {
    try {
      const response = await fetch(`${API_BASE}/api/trading/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          ticker: ticker.toUpperCase(),
          quantity: quantity
        })
      });
      
      const data: TradeResult = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to buy stock');
      }
      
      return data;
    } catch (error) {
      console.error('Error buying stock:', error);
      throw error;
    }
  }

  async sellStock(userId: string, ticker: string, quantity: number): Promise<TradeResult> {
    try {
      const response = await fetch(`${API_BASE}/api/trading/sell`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          ticker: ticker.toUpperCase(),
          quantity: quantity
        })
      });
      
      const data: TradeResult = await response.json();
      
      if (!response.ok) {
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
      const response = await fetch(`${API_BASE}/api/trading/transactions?user_id=${encodeURIComponent(userId)}&limit=${limit}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Failed to fetch transactions');
      }
      
      return data.transactions || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  async getPortfolio(userId: string): Promise<PortfolioResponse> {
    try {
      const response = await fetch(`${API_BASE}/api/trading/portfolio?user_id=${encodeURIComponent(userId)}`);
      const data: PortfolioResponse = await response.json();
      
      if (!data.success) {
        throw new Error('Failed to fetch portfolio');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      throw error;
    }
  }
}

export default new TradingService();

