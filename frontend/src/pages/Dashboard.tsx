import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useRealTimeQuotes } from '../hooks/useRealTimeQuotes'
import TradingViewMiniWidget from '../components/TradingViewMiniWidget'

const Dashboard = () => {
  const { user, isLoading } = useUser()
  const navigate = useNavigate()
  const [darkMode] = useState(() => localStorage.getItem('darkMode') === 'true')
  
  // Get user's portfolio symbols
  const userSymbols = user?.portfolio?.map(p => p.ticker) || []
  
  // Get quotes for user's portfolio
  const { quotes: userQuotes } = useRealTimeQuotes({
    symbols: userSymbols,
    refreshInterval: 60000,
    enabled: userSymbols.length > 0
  })

  // Calculate portfolio total change
  const portfolioChange = user?.portfolio?.reduce((total, stock) => {
    const quote = userQuotes?.find(q => q.symbol === stock.ticker)
    const currentPrice = quote?.price || stock.currentPrice
    const currentValue = stock.quantity * currentPrice
    const originalValue = stock.quantity * stock.avgPrice
    return total + (currentValue - originalValue)
  }, 0) || 0

  const portfolioChangePercent = user?.totalValue 
    ? ((portfolioChange / (user.totalValue - portfolioChange)) * 100) 
    : 0

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/')
    }
  }, [user, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Portfolio Value */}
        <div className="mb-8">
          <div className="text-5xl font-medium text-black dark:text-white mb-2">
            ${user?.totalValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
          </div>
          {portfolioChange !== 0 && (
            <div className={`flex items-center gap-2 text-base font-medium ${portfolioChange >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
              {portfolioChange >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              <span>{portfolioChange >= 0 ? '+' : ''}${Math.abs(portfolioChange).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span>({portfolioChange >= 0 ? '+' : ''}{portfolioChangePercent.toFixed(2)}%)</span>
              <span className="text-gray-500 dark:text-gray-400 font-normal">Today</span>
            </div>
          )}
        </div>

        {/* Chart - Real TradingView Data */}
        <div className="mb-8">
          <div className="bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden" style={{ height: '400px' }}>
            <TradingViewMiniWidget 
              symbol={user?.portfolio?.[0]?.ticker || 'AAPL'} 
              height="400px"
              theme={darkMode ? 'dark' : 'light'}
            />
          </div>
        </div>

        {/* Stocks List - Real Prices from Yahoo Finance */}
        {user?.portfolio && user.portfolio.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Stocks</h2>
            <div className="space-y-1">
              {user.portfolio.map((stock) => {
                const quote = userQuotes?.find(q => q.symbol === stock.ticker)
                const currentPrice = quote?.price || stock.currentPrice
                const currentValue = stock.quantity * currentPrice
                const totalGain = currentValue - (stock.quantity * stock.avgPrice)
                const totalGainPercent = ((totalGain / (stock.quantity * stock.avgPrice)) * 100)

                return (
                  <button
                    key={stock.ticker}
                    onClick={() => navigate(`/stock/${stock.ticker}`)}
                    className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-left flex-1">
                        <div className="font-medium text-black dark:text-white">{stock.ticker}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {stock.quantity} {stock.quantity === 1 ? 'Share' : 'Shares'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium text-black dark:text-white">
                        ${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className={`text-sm font-medium ${totalGain >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                        {totalGain >= 0 ? '+' : ''}${Math.abs(totalGain).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        {' '}({totalGain >= 0 ? '+' : ''}{totalGainPercent.toFixed(2)}%)
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          // Empty State - No Stocks Yet
          <div className="text-center py-16">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <BarChart3 className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg font-medium">No stocks in your portfolio yet</p>
              <p className="text-sm mt-2">Start investing to see your portfolio grow</p>
            </div>
            <button 
              onClick={() => navigate('/trade')}
              className="mt-6 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
            >
              Start Investing
            </button>
          </div>
        )}

      </div>
    </Layout>
  )
}

export default Dashboard
