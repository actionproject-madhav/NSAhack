import { useState } from 'react'
import { useParams } from 'react-router-dom'
import TradingViewWidget from '../components/TradingViewWidget'
import Navigation from '../components/Navigation'
import StockAnalysisChat from '../components/StockAnalysisChat'
import { cn } from '../utils/cn'

// Mock stock data - replace with real API calls
const mockStockData = {
  AAPL: {
    symbol: "AAPL",
    shortName: "Apple Inc.",
    fullExchangeName: "NASDAQ",
    regularMarketPrice: 190.40,
    regularMarketChange: 1.59,
    regularMarketChangePercent: 0.84,
    currency: "USD",
    marketCap: 2800000000000,
    volume: 45000000,
    peRatio: 28.5,
    open: 189.50,
    high: 191.20,
    low: 188.80,
    divYield: 0.52,
    beta: 1.2,
    eps: 6.16,
    description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
    sector: "Technology",
    industry: "Consumer Electronics",
    employees: 164000,
    website: "https://www.apple.com",
  },
  NVDA: {
    symbol: "NVDA",
    shortName: "NVIDIA Corporation",
    fullExchangeName: "NASDAQ",
    regularMarketPrice: 875.30,
    regularMarketChange: 15.20,
    regularMarketChangePercent: 1.77,
    currency: "USD",
    marketCap: 2150000000000,
    volume: 42000000,
    peRatio: 68.5,
    open: 865.00,
    high: 880.50,
    low: 862.50,
    divYield: 0.02,
    beta: 1.7,
    eps: 12.81,
    description: "NVIDIA Corporation provides graphics, and compute and networking solutions in the United States, Taiwan, China, and internationally.",
    sector: "Technology",
    industry: "Semiconductors",
    employees: 29600,
    website: "https://www.nvidia.com",
  },
  META: {
    symbol: "META",
    shortName: "Meta Platforms Inc.",
    fullExchangeName: "NASDAQ",
    regularMarketPrice: 485.20,
    regularMarketChange: 8.40,
    regularMarketChangePercent: 1.76,
    currency: "USD",
    marketCap: 1230000000000,
    volume: 18500000,
    peRatio: 24.8,
    open: 482.10,
    high: 487.90,
    low: 480.50,
    divYield: 0.41,
    beta: 1.3,
    eps: 19.56,
    description: "Meta Platforms, Inc. develops products that enable people to connect and share with friends and family through mobile devices, personal computers, virtual reality headsets, and wearables worldwide.",
    sector: "Technology",
    industry: "Internet Content & Information",
    employees: 77805,
    website: "https://www.meta.com",
  },
  TSLA: {
    symbol: "TSLA",
    shortName: "Tesla, Inc.",
    fullExchangeName: "NASDAQ",
    regularMarketPrice: 248.50,
    regularMarketChange: -2.30,
    regularMarketChangePercent: -0.92,
    currency: "USD",
    marketCap: 790000000000,
    volume: 89000000,
    peRatio: 62.3,
    open: 251.20,
    high: 253.80,
    low: 246.10,
    divYield: 0.00,
    beta: 2.3,
    eps: 3.99,
    description: "Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally.",
    sector: "Consumer Cyclical",
    industry: "Auto Manufacturers",
    employees: 140473,
    website: "https://www.tesla.com",
  },
  AMD: {
    symbol: "AMD",
    shortName: "Advanced Micro Devices, Inc.",
    fullExchangeName: "NASDAQ",
    regularMarketPrice: 142.75,
    regularMarketChange: 2.85,
    regularMarketChangePercent: 2.04,
    currency: "USD",
    marketCap: 230000000000,
    volume: 35000000,
    peRatio: 47.2,
    open: 140.50,
    high: 144.20,
    low: 139.80,
    divYield: 0.00,
    beta: 1.8,
    eps: 3.02,
    description: "Advanced Micro Devices, Inc. operates as a semiconductor company worldwide. It operates in two segments, Computing and Graphics; and Enterprise, Embedded and Semi-Custom.",
    sector: "Technology",
    industry: "Semiconductors",
    employees: 26000,
    website: "https://www.amd.com",
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

const formatLargeNumber = (value: number) => {
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  }
  return `${value}`;
};

export default function StockDetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const [isAnalysisChatOpen, setIsAnalysisChatOpen] = useState(false)
  
  if (!symbol || !mockStockData[symbol as keyof typeof mockStockData]) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Stock Not Found</h1>
            <p className="text-gray-600">The requested stock symbol could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const stock = mockStockData[symbol as keyof typeof mockStockData];
  const isPositive = stock.regularMarketChange >= 0;

  // Mock data for components
  const orderBookData = [
    { price: stock.regularMarketPrice + 0.10, amount: 500, total: (stock.regularMarketPrice + 0.10) * 500 },
    { price: stock.regularMarketPrice + 0.05, amount: 1200, total: (stock.regularMarketPrice + 0.05) * 1200 },
    { price: stock.regularMarketPrice, amount: 1800, total: stock.regularMarketPrice * 1800 },
    { price: stock.regularMarketPrice - 0.05, amount: 750, total: (stock.regularMarketPrice - 0.05) * 750 },
    { price: stock.regularMarketPrice - 0.10, amount: 1000, total: (stock.regularMarketPrice - 0.10) * 1000 },
    { price: stock.regularMarketPrice - 0.15, amount: 1500, total: (stock.regularMarketPrice - 0.15) * 1500 },
    { price: stock.regularMarketPrice - 0.20, amount: 2200, total: (stock.regularMarketPrice - 0.20) * 2200 },
  ];

  const newsData = [
    {
      source: "Financial Times",
      time: "2 hours ago",
      title: `${stock.symbol} Corporation Reports Strong Quarterly Earnings`,
      summary: "The company exceeded analyst expectations with strong revenue growth..."
    },
    {
      source: "Reuters", 
      time: "5 hours ago",
      title: `Market Analysis: ${stock.sector} Sector Outlook`,
      summary: `Industry experts weigh in on the future prospects of the ${stock.sector.toLowerCase()} sector...`
    },
    {
      source: "Bloomberg",
      time: "1 day ago", 
      title: `${stock.shortName} Announces New Strategic Initiative`,
      summary: "The company unveiled plans for expansion into new markets..."
    }
  ];

  const peerAnalysisData = [
    { symbol: 'TSLA', name: 'Tesla', growth: '+8.40%', change: '+1.24%', color: 'red' },
    { symbol: 'RIVN', name: 'Rivian', growth: '+12.30%', change: '+2.15%', color: 'orange' },
    { symbol: 'NVDA', name: 'NVIDIA', growth: '+4.85%', change: '+0.85%', color: 'green' },
    { symbol: 'AMD', name: 'AMD', growth: '+6.75%', change: '+0.95%', color: 'blue' }
  ];

  const handleAnalyzeClick = () => {
    setIsAnalysisChatOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs">
                    {stock.symbol === 'AAPL' ? '' : 
                     stock.symbol === 'NVDA' ? '' : 
                     stock.symbol === 'META' ? '' :
                     stock.symbol === 'TSLA' ? '' :
                     stock.symbol === 'AMD' ? '' : ''}
                  </span>
                </div>
                <span className="font-medium">{stock.symbol}</span>
                <span className="text-gray-500 text-sm">{formatCurrency(stock.regularMarketPrice)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <nav className="flex gap-6">
                <button className="text-sm font-medium text-black border-b-2 border-black pb-1">Chart</button>
                <button className="text-sm text-gray-400 hover:text-gray-600 pb-1">Statistics</button>
                <button className="text-sm text-gray-400 hover:text-gray-600 pb-1">Analyst</button>
                <button className="text-sm text-gray-400 hover:text-gray-600 pb-1">Earnings</button>
                <button className="text-sm text-gray-400 hover:text-gray-600 pb-1">Insider</button>
                <button className="text-sm text-gray-400 hover:text-gray-600 pb-1">Financials</button>
                <button className="text-sm text-gray-400 hover:text-gray-600 pb-1">Peer</button>
              </nav>
              <button 
                onClick={handleAnalyzeClick}
                className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analyze
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-md">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Stock Info & Chart */}
          <div className="col-span-8">
            {/* Stock Price Header */}
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-1">{stock.fullExchangeName} • {stock.shortName}</div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold">{formatCurrency(stock.regularMarketPrice)}</span>
                <span className={cn(
                  "text-lg font-medium",
                  isPositive ? "text-green-600" : "text-red-600"
                )}>
                  {isPositive ? '+' : ''}{stock.regularMarketChange.toFixed(2)} ({isPositive ? '+' : ''}{stock.regularMarketChangePercent.toFixed(2)}%)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                  Sell
                </button>
                <button className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Buy
                </button>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-0 mb-6 overflow-hidden">
              <TradingViewWidget 
                symbol={stock.symbol}
                height="400px"
                theme="light"
              />
              <div className="flex gap-2 px-4 py-3 border-t border-gray-100">
                {['1D', '5D', '1M', '1Y'].map((period) => (
                  <button
                    key={period}
                    className={cn(
                      "px-2 py-1 text-sm rounded transition-colors",
                      period === '1D' 
                        ? "bg-gray-100 text-gray-900 font-medium" 
                        : "text-gray-500 hover:bg-gray-50"
                    )}
                  >
                    {period}
                  </button>
                ))}
                <button className="ml-auto text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                  Share chart 
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Order Book */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Order Book</h3>
                <button className="text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b">
                      <th className="text-left py-2">Price</th>
                      <th className="text-right py-2">Amount</th>
                      <th className="text-right py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderBookData.map((order, index) => (
                      <tr key={index} className="border-b border-gray-50">
                        <td className="py-2 text-red-600">{order.price.toFixed(2)}</td>
                        <td className="py-2 text-right">{order.amount}</td>
                        <td className="py-2 text-right">{order.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-4 space-y-6">
            {/* Buy Stock Panel */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Buy Stock</h3>
                <button className="text-gray-400">×</button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Trading balance</span>
                    <span className="font-medium">$10,000.00</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '19%'}}></div>
                  </div>
                  <div className="text-right text-xs text-gray-500 mt-1">19%</div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Investment Total</span>
                    <span className="font-medium">{formatCurrency(stock.regularMarketPrice * 10)}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Buy Price</span>
                    <div className="flex items-center gap-2">
                      <button className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-500">−</button>
                      <span className="font-medium">{formatCurrency(stock.regularMarketPrice)}</span>
                      <button className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-500">+</button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">Quantity</span>
                    <div className="flex items-center gap-2">
                      <button className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-500">−</button>
                      <span className="font-medium">10</span>
                      <button className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-500">+</button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">{formatCurrency(stock.regularMarketPrice * 10)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span>Transaction Fee</span>
                    <span>$0</span>
                  </div>
                  
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Buy {stock.symbol}
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center mt-2">
                    By placing this order, you agree to our Terms and Conditions.
                  </p>
                </div>
              </div>
            </div>

            {/* Peer Analysis */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Peer Analysis</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">View all</button>
              </div>
              
              <div className="space-y-3">
                {peerAnalysisData.map((peer, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium",
                        peer.color === 'red' && "bg-red-500",
                        peer.color === 'orange' && "bg-orange-500", 
                        peer.color === 'green' && "bg-green-500",
                        peer.color === 'blue' && "bg-blue-500"
                      )}>
                        {peer.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{peer.symbol}</div>
                        <div className="text-xs text-gray-500">Est. revenue growth</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">{peer.growth}</div>
                      <div className="text-xs text-green-600">{peer.change}</div>
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-500">Reference asset</div>
                </div>
              </div>
            </div>

            {/* Capitalization Breakdown */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold mb-4">Capitalization Breakdown</h3>
              <div className="text-xs text-gray-500 mb-4">Currency in USD</div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">Net Liability</span>
                  </div>
                  <span className="font-medium">-{formatLargeNumber(stock.marketCap * 0.04)}</span>
                </div>
                
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-600">Market Cap</span>
                  </div>
                  <span className="font-medium">{formatLargeNumber(stock.marketCap)}</span>
                </div>
                
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>= Total Enterprise Value (TEV)</span>
                  <span>{formatLargeNumber(stock.marketCap * 0.96)}</span>
                </div>
                
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Common Equity</span>
                  </div>
                  <span className="font-medium">{formatLargeNumber(stock.marketCap * 0.02)}</span>
                </div>
                
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Total Liability</span>
                  </div>
                  <span className="font-medium">{formatLargeNumber(stock.marketCap * 0.04)}</span>
                </div>
                
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>= Total Capital</span>
                  <span>{formatLargeNumber(stock.marketCap * 0.06)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Analysis Chat Modal */}
      <StockAnalysisChat 
        isOpen={isAnalysisChatOpen}
        onClose={() => setIsAnalysisChatOpen(false)}
        stockData={stock}
      />
    </div>
  );
}