import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';

// Mock screener data - replace with real API data
const mockScreenerData = [
  {
    symbol: "AAPL",
    shortName: "Apple Inc.",
    regularMarketPrice: 175.84,
    regularMarketChange: 2.34,
    regularMarketChangePercent: 1.35,
    marketCap: 2800000000000,
    volume: 45000000,
    peRatio: 28.5,
    sector: "Technology"
  },
  {
    symbol: "MSFT",
    shortName: "Microsoft Corporation",
    regularMarketPrice: 338.11,
    regularMarketChange: -1.23,
    regularMarketChangePercent: -0.36,
    marketCap: 2500000000000,
    volume: 32000000,
    peRatio: 32.1,
    sector: "Technology"
  },
  {
    symbol: "GOOGL",
    shortName: "Alphabet Inc.",
    regularMarketPrice: 125.32,
    regularMarketChange: 0.87,
    regularMarketChangePercent: 0.70,
    marketCap: 1600000000000,
    volume: 28000000,
    peRatio: 24.8,
    sector: "Communication Services"
  },
  {
    symbol: "TSLA",
    shortName: "Tesla, Inc.",
    regularMarketPrice: 248.50,
    regularMarketChange: 12.45,
    regularMarketChangePercent: 5.27,
    marketCap: 790000000000,
    volume: 85000000,
    peRatio: 65.2,
    sector: "Consumer Cyclical"
  },
  {
    symbol: "NVDA",
    shortName: "NVIDIA Corporation",
    regularMarketPrice: 875.30,
    regularMarketChange: 15.20,
    regularMarketChangePercent: 1.77,
    marketCap: 2150000000000,
    volume: 42000000,
    peRatio: 68.5,
    sector: "Technology"
  }
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

  const sortedData = [...mockScreenerData].sort((a, b) => {
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

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">Market Screener</h2>
        <p className="text-sm text-gray-600">
          Top performing stocks by market cap
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