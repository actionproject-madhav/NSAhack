import { useState, useEffect } from 'react'
import { Search, TrendingUp, TrendingDown, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import Layout from '../components/Layout'
import { useRealTimeQuotes } from '../hooks/useRealTimeQuotes'

// Popular stocks for quick trading
const POPULAR_TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'AMD']

const TradePage = () => {
  const { user, updatePortfolio } = useUser()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  // Get real-time quotes for popular stocks
  const { quotes, isLoading } = useRealTimeQuotes({
    symbols: POPULAR_TICKERS,
    refreshInterval: 60000,
    enabled: true
  })

  const handleBuyStock = (ticker: string, price: number) => {
    if (!user) {
      alert('Please log in to trade')
      navigate('/auth')
      return
    }

    updatePortfolio({
      ticker: ticker,
      company: ticker,
      quantity: quantity,
      avgPrice: price,
      currentPrice: price,
      reason: 'Manual purchase',
      logo: '📈'
    })

    alert(`Successfully bought ${quantity} ${quantity === 1 ? 'share' : 'shares'} of ${ticker}!`)
    navigate('/portfolio')
  }

  const filteredQuotes = searchQuery
    ? quotes?.filter(q => 
        q.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : quotes

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Trade</h1>
          <p className="text-gray-600 dark:text-gray-400">Buy stocks with real-time market prices</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stocks (e.g., AAPL, TSLA)..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-colors"
            />
          </div>
        </div>

        {/* Stock List */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
            {searchQuery ? 'Search Results' : 'Popular Stocks'}
          </h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading real-time prices...</p>
            </div>
          ) : filteredQuotes && filteredQuotes.length > 0 ? (
            filteredQuotes.map((quote) => {
              const isPositive = quote.change >= 0

              return (
                <div
                  key={quote.symbol}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:border-black dark:hover:border-white transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-black dark:text-white mb-1">
                        {quote.symbol}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-medium text-black dark:text-white">
                          ${quote.price.toFixed(2)}
                        </span>
                        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span>{isPositive ? '+' : ''}{quote.change.toFixed(2)}</span>
                          <span>({isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trade Section */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Shares</label>
                      <input
                        type="number"
                        value={selectedStock === quote.symbol ? quantity : 1}
                        onChange={(e) => {
                          setSelectedStock(quote.symbol)
                          setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                        }}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Total</label>
                      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg font-bold text-black dark:text-white">
                        ${((selectedStock === quote.symbol ? quantity : 1) * quote.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <button
                      onClick={() => handleBuyStock(quote.symbol, quote.price)}
                      className="mt-5 px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Buy
                    </button>
                  </div>

                  {/* View Details Link */}
                  <button
                    onClick={() => navigate(`/stock/${quote.symbol}`)}
                    className="mt-3 w-full text-center text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    View Full Details & Chart →
                  </button>
                </div>
              )
            })
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery ? 'No stocks found' : 'Loading stocks...'}
              </p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
          <h3 className="font-bold text-black dark:text-white mb-2">Real-Time Trading</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            All prices are fetched in real-time from Yahoo Finance. Click "View Full Details" to see complete stock information and interactive charts before buying.
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default TradePage
