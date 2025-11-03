import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';
import apiService from '../services/apiService';

// Popular stocks to screen
const POPULAR_SYMBOLS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'AMD',
  'NFLX', 'DIS', 'SBUX', 'NKE', 'WMT', 'JPM', 'V', 'MA'
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

const formatMarketCap = (value: number) => {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  return `$${value}`;
};

const formatVolume = (value: number) => {
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`;
  }
  return value.toString();
};

interface Stock {
  symbol: string;
  shortName: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  marketCap: number;
  volume: number;
  peRatio: number;
  sector: string;
}

export default function MarketScreener() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<keyof Stock>('marketCap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real stock data
  useEffect(() => {
    const fetchStocks = async () => {
      setIsLoading(true);
      try {
        console.log('📊 Fetching real stock data for screener...');
        const quotes = await apiService.getMultipleStockQuotes(POPULAR_SYMBOLS);
        
        // Transform quotes to stock data format with basic info
        const stockData: Stock[] = quotes.map(quote => ({
          symbol: quote.symbol,
          shortName: quote.symbol, // Will be enhanced if needed
          regularMarketPrice: quote.price,
          regularMarketChange: quote.change,
          regularMarketChangePercent: quote.changePercent,
          marketCap: 0, // Simplified - not fetching full details for performance
          volume: quote.volume || 0,
          peRatio: 0,
          sector: 'Technology' // Default sector
        }));
        
        setStocks(stockData.filter(s => s.regularMarketPrice > 0));
        console.log(`✅ Loaded ${stockData.length} stocks for screener`);
      } catch (error) {
        console.error('Error fetching screener data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStocks();
  }, []);

  const sortedData = [...stocks].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const handleSort = (column: keyof Stock) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading real-time market data...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">Market Screener</h2>
        <p className="text-sm text-gray-600">
          Live stock data - Click any row to view details
        </p>
      </div>
      
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th 
                  className="text-left p-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('symbol')}
                >
                  Symbol
                </th>
                <th 
                  className="text-left p-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('shortName')}
                >
                  Company
                </th>
                <th 
                  className="text-right p-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('regularMarketPrice')}
                >
                  Price
                </th>
                <th 
                  className="text-right p-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('regularMarketChangePercent')}
                >
                  Change %
                </th>
                <th 
                  className="text-right p-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('marketCap')}
                >
                  Market Cap
                </th>
                <th 
                  className="text-right p-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('volume')}
                >
                  Volume
                </th>
                <th 
                  className="text-right p-3 font-medium text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('peRatio')}
                >
                  P/E Ratio
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((stock) => (
                <tr 
                  key={stock.symbol} 
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/stock/${stock.symbol}`)}
                >
                  <td className="p-3">
                    <div className="font-semibold text-gray-900">{stock.symbol}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm text-gray-900">{stock.shortName}</div>
                    <div className="text-xs text-gray-500">{stock.sector}</div>
                  </td>
                  <td className="p-3 text-right font-medium text-gray-900">
                    {formatCurrency(stock.regularMarketPrice)}
                  </td>
                  <td className="p-3 text-right">
                    <span className={cn(
                      "font-medium",
                      stock.regularMarketChange >= 0 
                        ? "text-green-600" 
                        : "text-red-600"
                    )}>
                      {stock.regularMarketChange >= 0 ? '+' : ''}
                      {stock.regularMarketChangePercent.toFixed(2)}%
                    </span>
                  </td>
                  <td className="p-3 text-right text-sm text-gray-700">
                    {formatMarketCap(stock.marketCap)}
                  </td>
                  <td className="p-3 text-right text-sm text-gray-700">
                    {formatVolume(stock.volume)}
                  </td>
                  <td className="p-3 text-right text-sm text-gray-700">
                    {stock.peRatio.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}