import { useState, useEffect } from 'react'
import { Plus, Wallet as WalletIcon } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import tradingService from '../services/tradingService'
import { useRealTimeQuotes } from '../hooks/useRealTimeQuotes'

const WalletPage = () => {
  const { user, refreshUserData } = useUser()
  const navigate = useNavigate()
  const [cashBalance, setCashBalance] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  // Get user's portfolio symbols for real-time quotes
  const userSymbols = user?.portfolio?.map(p => p.ticker) || []
  
  // Get real-time quotes for user's portfolio
  const { quotes: userQuotes } = useRealTimeQuotes({
    symbols: userSymbols,
    refreshInterval: 60000, // Update every minute
    enabled: userSymbols.length > 0
  })

  useEffect(() => {
    if (user) {
      loadWalletData()
    }
  }, [user])

  const loadWalletData = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const balance = await tradingService.getCashBalance(user.id)
      setCashBalance(balance)
      // Refresh portfolio data to get latest prices
      await refreshUserData()
    } catch (error) {
      console.error('Failed to load wallet data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate total value using real-time quotes
  const totalValue = user?.portfolio?.reduce((total, stock) => {
    const quote = userQuotes?.find(q => q.symbol === stock.ticker)
    const currentPrice = quote?.price || stock.currentPrice
    return total + (stock.quantity * currentPrice)
  }, 0) || 0
  
  const totalAccountValue = totalValue + cashBalance

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Wallet</h1>
            <p className="text-gray-600 dark:text-gray-400">Your portfolio overview</p>
          </div>
          
          <button 
            onClick={() => navigate('/trade')}
            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 flex items-center gap-2 transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            Buy Stocks
          </button>
        </div>

        {/* Account Overview */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Account Value</span>
            <div className="text-3xl font-bold text-black dark:text-white mt-2">
              ${totalAccountValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Portfolio Value</span>
            <div className="text-3xl font-bold text-black dark:text-white mt-2">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {user?.portfolio?.length || 0} {user?.portfolio?.length === 1 ? 'position' : 'positions'}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Available Cash</span>
            <div className="text-3xl font-bold text-green-600 dark:text-green-500 mt-2">
              ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Holdings List */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold text-black dark:text-white">Holdings</h2>
          </div>
          
          {!user?.portfolio || user.portfolio.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <WalletIcon className="w-16 h-16 mx-auto stroke-1" />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">No Investments Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start building your portfolio
              </p>
              <button 
                onClick={() => navigate('/trade')}
                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 inline-flex items-center gap-2 font-semibold transition-colors"
              >
                <Plus className="w-5 h-5" />
                Start Investing
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {user.portfolio.map((stock) => {
                // Use real-time quote if available, otherwise fallback to stock.currentPrice
                const quote = userQuotes?.find(q => q.symbol === stock.ticker)
                const currentPrice = quote?.price || stock.currentPrice
                const priceChange = quote?.change || 0
                const priceChangePercent = quote?.changePercent || 0
                
                const currentValue = stock.quantity * currentPrice
                const originalValue = stock.quantity * stock.avgPrice
                const gainLoss = currentValue - originalValue
                const gainLossPercent = (gainLoss / originalValue) * 100
                const isProfit = gainLoss >= 0

                return (
                  <button
                    key={stock.ticker}
                    onClick={() => navigate(`/stock/${stock.ticker}`)}
                    className="w-full px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-black dark:text-white text-lg">{stock.ticker}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {stock.quantity} {stock.quantity === 1 ? 'share' : 'shares'} × ${currentPrice.toFixed(2)}
                          {quote && (
                            <span className={`ml-2 ${priceChange >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                              {priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-black dark:text-white text-lg">
                          ${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className={`text-sm font-medium mt-1 ${isProfit ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                          {isProfit ? '+' : ''}${Math.abs(gainLoss).toFixed(2)} ({isProfit ? '+' : ''}{gainLossPercent.toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default WalletPage
