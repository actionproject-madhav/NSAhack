// Normalize API base URL (remove trailing slash to prevent double slashes)
const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');

export interface DailyBrief {
  summary: string;
  generated_at: string;
  news_count: number;
}

export interface StockAnalysis {
  ticker: string;
  analysis: string;
  price: number;
  change: number;
  change_percent: number;
  news_count: number;
  generated_at: string;
}

export interface TrendingStock {
  ticker: string;
  price: number;
  change_percent: number;
  news_count: number;
  trending_score: number;
}

export interface InternationalStock {
  ticker: string;
  price: number;
  change: number;
  change_percent: number;
}

export const aiHubApi = {
  getDailyBrief: async (): Promise<DailyBrief> => {
    const response = await fetch(`${API_BASE}/api/ai/daily-brief`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  getStockIntelligence: async (ticker: string): Promise<StockAnalysis> => {
    const response = await fetch(`${API_BASE}/api/ai/stock-intelligence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticker })
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  getTrendingStocks: async (): Promise<TrendingStock[]> => {
    const response = await fetch(`${API_BASE}/api/ai/trending-stocks`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  getInternationalStocks: async (): Promise<InternationalStock[]> => {
    const response = await fetch(`${API_BASE}/api/ai/international-stocks`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  }
};
