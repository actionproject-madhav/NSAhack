import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react'
import TradingViewWidget from '../components/TradingViewWidget'
import apiService from '../services/apiService'
import { useUser } from '../context/UserContext'

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

const formatLargeNumber = (value: number) => {
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  return `${value}`;
};

export default function StockDetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { user, updatePortfolio } = useUser();
  const [stock, setStock] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tradeQuantity, setTradeQuantity] = useState(1)
  const [darkMode] = useState(() => localStorage.getItem('darkMode') === 'true')

  useEffect(() => {
    const fetchStockDetails = async () => {
      if (!symbol) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        const details = await apiService.getStockDetails(symbol)
        
        if (details && details.regularMarketPrice > 0) {
          setStock(details)
        } else {
          setError('Stock not found')
        }
      } catch (err) {
        setError('Failed to load stock data')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchStockDetails()
  }, [symbol])

  const handleBuy = () => {
    if (!user) {
      alert('Please log in to trade')
      return
    }

    updatePortfolio({
      ticker: stock.symbol,
      company: stock.shortName,
      quantity: tradeQuantity,
      avgPrice: stock.regularMarketPrice,
      currentPrice: stock.regularMarketPrice,
      reason: 'Manual purchase',
      logo: '📈'
    })
    
    alert(`Successfully bought ${tradeQuantity} ${tradeQuantity === 1 ? 'share' : 'shares'} of ${stock.symbol}!`)
    navigate('/portfolio')
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading {symbol}...</p>
        </div>
      </div>
    )
  }

  if (error || !stock) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-4">Stock Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Invalid symbol'}</p>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isPositive = stock.regularMarketChange >= 0;

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors flex">
      {/* Left Sidebar - Stock Info */}
      <div className="hidden lg:block w-80 border-r border-gray-200 dark:border-gray-800 p-6 overflow-y-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-2xl font-bold text-black dark:text-white mb-2">{stock.shortName}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <span>{stock.symbol}</span>
          <span>•</span>
          <span>{stock.fullExchangeName?.split(' ')[0] || 'NYSE'}</span>
        </div>

        {/* Key Stats */}
        <div className="space-y-4">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Market Cap</div>
            <div className="text-sm font-medium text-black dark:text-white">{formatLargeNumber(stock.marketCap)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">P/E Ratio</div>
            <div className="text-sm font-medium text-black dark:text-white">{stock.peRatio?.toFixed(2) || 'N/A'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">52 Week High</div>
            <div className="text-sm font-medium text-black dark:text-white">{formatCurrency(stock.fiftyTwoWeekHigh || 0)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">52 Week Low</div>
            <div className="text-sm font-medium text-black dark:text-white">{formatCurrency(stock.fiftyTwoWeekLow || 0)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Volume</div>
            <div className="text-sm font-medium text-black dark:text-white">{formatLargeNumber(stock.volume)}</div>
          </div>
        </div>

        {/* About */}
        {stock.description && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-black dark:text-white mb-3">About</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {stock.description.slice(0, 300)}...
            </p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden border-b border-gray-200 dark:border-gray-800 p-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-xl font-bold text-black dark:text-white">{stock.shortName}</h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">{stock.symbol}</div>
        </div>

        {/* Price Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="text-4xl font-medium text-black dark:text-white mb-2">
            {formatCurrency(stock.regularMarketPrice)}
          </div>
          <div className={`flex items-center gap-2 text-base font-medium ${isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
            {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            <span>{isPositive ? '+' : ''}{stock.regularMarketChange?.toFixed(2)}</span>
            <span>({isPositive ? '+' : ''}{stock.regularMarketChangePercent?.toFixed(2)}%)</span>
            <span className="text-gray-500 dark:text-gray-400 font-normal text-sm">Today</span>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 p-6">
          <div className="h-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <TradingViewWidget 
              symbol={stock.symbol} 
              height="100%"
              theme={darkMode ? 'dark' : 'light'}
            />
          </div>
        </div>

        {/* Buy Panel */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-black">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Shares</label>
              <input
                type="number"
                value={tradeQuantity}
                onChange={(e) => setTradeQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>

            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Total</span>
                <span className="text-xl font-bold text-black dark:text-white">
                  {formatCurrency(stock.regularMarketPrice * tradeQuantity)}
                </span>
              </div>
            </div>

            <button
              onClick={handleBuy}
              className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Buy {stock.symbol}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
