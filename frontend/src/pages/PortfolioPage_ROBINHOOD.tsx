import { useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Plus, TrendingUp, TrendingDown } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Logo from '../components/Logo'

const PortfolioPage = () => {
  const { user, refreshPortfolioPrices } = useUser()
  const navigate = useNavigate()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await refreshPortfolioPrices()
    setRefreshing(false)
  }

  const totalValue = user?.totalValue || 0
  const totalGainLoss = user?.portfolio?.reduce((total, stock) => {
    const currentValue = stock.quantity * stock.currentPrice
    const originalValue = stock.quantity * stock.avgPrice
    return total + (currentValue - originalValue)
  }, 0) || 0
  
  const totalGainLossPercent = totalValue > 0 
    ? ((totalGainLoss / (totalValue - totalGainLoss)) * 100) 
    : 0

  const isPositive = totalGainLoss >= 0

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header - Robinhood Minimal */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Portfolio</h1>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center gap-2 disabled:opacity-50 text-black dark:text-white"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button 
              onClick={() => navigate('/trade')}
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Invest
            </button>
          </div>
        </div>

        {/* Portfolio Summary - Robinhood Minimal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-black p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Value</span>
            <div className="text-3xl font-bold text-black dark:text-white mt-2">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="bg-white dark:bg-black p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Return</span>
            <div className={`text-3xl font-bold mt-2 ${isPositive ? 'rh-green' : 'rh-red'}`}>
              {isPositive ? '+' : ''}${Math.abs(totalGainLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`text-sm mt-1 ${isPositive ? 'rh-green' : 'rh-red'}`}>
              {isPositive ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
            </div>
          </div>

          <div className="bg-white dark:bg-black p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Holdings</span>
            <div className="text-3xl font-bold text-black dark:text-white mt-2">
              {user?.portfolio?.length || 0}
            </div>
          </div>
        </div>

        {/* Holdings List - Robinhood Minimal */}
        <div className="bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold text-black dark:text-white">Holdings</h2>
          </div>

          {!user?.portfolio || user.portfolio.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto stroke-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">No Holdings</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Start building your portfolio</p>
              <button 
                onClick={() => navigate('/trade')}
                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Invest
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {user.portfolio.map((holding, index) => {
                const currentValue = holding.quantity * holding.currentPrice
                const originalValue = holding.quantity * holding.avgPrice
                const gainLoss = currentValue - originalValue
                const gainLossPercent = ((gainLoss / originalValue) * 100)
                const isPositive = gainLoss >= 0

                return (
                  <motion.div
                    key={holding.ticker}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(`/stock/${holding.ticker}`)}
                    className="px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-black dark:text-white text-lg">{holding.ticker}</h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {holding.quantity} shares · Avg ${holding.avgPrice.toFixed(2)}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold text-black dark:text-white text-lg">
                          ${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className={`text-sm font-medium mt-1 ${isPositive ? 'rh-green' : 'rh-red'}`}>
                          {isPositive ? '+' : ''}${Math.abs(gainLoss).toFixed(2)} ({isPositive ? '+' : ''}{gainLossPercent.toFixed(2)}%)
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          ${holding.currentPrice.toFixed(2)}/share
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PortfolioPage

