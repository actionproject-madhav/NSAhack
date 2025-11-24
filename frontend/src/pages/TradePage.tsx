import { useState, useEffect, useMemo } from 'react'
import { Search, TrendingUp, TrendingDown, Plus, ScanLine, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import Layout from '../components/Layout'
import { useRealTimeQuotes } from '../hooks/useRealTimeQuotes'
import tradingService from '../services/tradingService'
import ReceiptScanner from '../components/ReceiptScanner'
import Logo from '../components/Logo'

// Popular stocks for quick trading
const POPULAR_TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'AMD']

const TradePage = () => {
  const { user, refreshUserData } = useUser()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [cashBalance, setCashBalance] = useState<number | null>(null)
  const [isBuying, setIsBuying] = useState(false)
  const [showReceiptScanner, setShowReceiptScanner] = useState(false)
  const [scannedTicker, setScannedTicker] = useState<string | null>(null)

  // Get real-time quotes for popular stocks
  const { quotes, isLoading } = useRealTimeQuotes({
    symbols: POPULAR_TICKERS,
    refreshInterval: 60000,
    enabled: true
  })

  // Load cash balance on mount
  useEffect(() => {
    if (user) {
      loadCashBalance()
    }
  }, [user])

  const loadCashBalance = async () => {
    if (!user) return
    try {
      // ALWAYS prefer email over ID for API calls (more reliable)
      const userId = user.email || user.id
      if (!userId) {
        console.error('No user identifier available')
      return
    }
      // Use email if available, fallback to id
      const apiUserId = user.email || userId
      const balance = await tradingService.getCashBalance(apiUserId)
      setCashBalance(balance)
    } catch (error) {
      console.error('Failed to load cash balance:', error)
    }
  }

  const handleBuyStock = async (ticker: string, price: number) => {
    if (!user) {
      alert('Please log in to trade')
      navigate('/auth')
      return
    }

    const totalCost = price * quantity

    if (cashBalance !== null && cashBalance < totalCost) {
      alert(`Insufficient funds! You need $${totalCost.toFixed(2)} but only have $${cashBalance.toFixed(2)}`)
      return
    }

    setIsBuying(true)
    try {
      // ALWAYS prefer email over ID for API calls (more reliable)
      const userId = user.email || user.id
      if (!userId) {
        console.error('❌ User object:', user)
        alert('User ID not found. Please log in again.')
        navigate('/auth')
        return
      }
      // Use email if available, fallback to id
      const apiUserId = user.email || userId
      console.log('🔵 TradePage: Buying stock with user identifier:', apiUserId, 'User object:', { email: user.email, id: user.id })
      const result = await tradingService.buyStock(apiUserId, ticker, quantity)
      
      // Update local cash balance
      if (result.new_balance !== undefined) {
        setCashBalance(result.new_balance)
      }

      // Refresh all user data from trading API
      await refreshUserData()

      alert(result.message || `Successfully bought ${quantity} ${quantity === 1 ? 'share' : 'shares'} of ${ticker}!`)
      
      // Reset quantity
      setQuantity(1)
      setSelectedStock(null)
    } catch (error: any) {
      alert(error.message || 'Failed to complete purchase')
    } finally {
      setIsBuying(false)
    }
  }

  const filteredQuotes = useMemo(() => {
    if (!quotes) return []
    if (!searchQuery) return quotes
    const query = searchQuery.toLowerCase()
    return quotes.filter(q => q.symbol.toLowerCase().includes(query))
  }, [quotes, searchQuery])

  return (
    <Layout>
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 w-full overflow-x-hidden">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
          <div>
              <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Trade</h1>
              <p className="text-gray-600 dark:text-gray-400">Paper trading with real-time market prices</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowReceiptScanner(!showReceiptScanner)}
                className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                <ScanLine className="w-4 h-4" />
                {showReceiptScanner ? 'Hide Scanner' : 'Scan Receipt'}
              </button>
              {cashBalance !== null && (
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Available Cash</p>
                  <p className="text-2xl font-bold text-[#00C805]">
                    ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Receipt Scanner - Top Right Panel */}
        <ReceiptScanner 
          isOpen={showReceiptScanner}
          onClose={() => setShowReceiptScanner(false)}
          showButton={false}
          position="top-right"
        />

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stocks (e.g., AAPL, TSLA)..."
              className="w-full pl-12 pr-4 py-4 border border-black/20 dark:border-white/20 bg-white/60 dark:bg-black/60 backdrop-blur-md text-black dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-colors"
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
                  className="bg-white/60 dark:bg-black/60 backdrop-blur-md border border-black/20 dark:border-white/20 rounded-lg p-4 hover:border-black/40 dark:hover:border-white/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <Logo 
                        company={quote.symbol} 
                        fallback={quote.symbol.charAt(0)} 
                        size={40}
                      />
                      <div>
                        <h3 className="text-2xl font-bold text-black dark:text-white mb-1">
                          {quote.symbol}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {quote.symbol}
                        </p>
                      </div>
                    </div>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-medium text-black dark:text-white">
                          ${quote.price.toFixed(2)}
                        </span>
                        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-[#00C805]' : 'text-[#FF5000]'}`}>
                          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span>{isPositive ? '+' : ''}{quote.change.toFixed(2)}</span>
                          <span>({isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%)</span>
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
                        className="w-full px-3 py-2 border border-black/20 dark:border-white/20 bg-white/60 dark:bg-black/60 backdrop-blur-md text-black dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Total</label>
                      <div className="px-3 py-2 bg-white/40 dark:bg-black/40 backdrop-blur-sm rounded-lg font-bold text-black dark:text-white">
                        ${((selectedStock === quote.symbol ? quantity : 1) * quote.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <button
                      onClick={() => handleBuyStock(quote.symbol, quote.price)}
                      disabled={isBuying}
                      className="mt-5 px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isBuying ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white dark:border-black" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Buy
                        </>
                      )}
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
        <div className="mt-8 p-6 bg-white/60 dark:bg-black/60 backdrop-blur-md border border-black/20 dark:border-white/20 rounded-lg">
          <h3 className="font-bold text-black dark:text-white mb-2">Paper Trading Simulation</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Practice trading with real market data and no financial risk. You start with $10,000 in virtual cash.
          </p>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
            <li>All prices are real-time from Yahoo Finance</li>
            <li>Transactions are recorded in your portfolio</li>
            <li>Perfect for learning without financial risk</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}

export default TradePage
