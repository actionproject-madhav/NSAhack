import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Plus, Settings, Info, TrendingUp, TrendingDown, Zap } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import apiService from '../services/apiService'
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio</h1>
            <p className="text-gray-600">Manage your investments and track performance</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {refreshing ? 'Refreshing...' : 'Refresh Prices'}
            </button>
            <button 
              onClick={() => navigate('/trade')}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Investment
            </button>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Value</span>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Gain/Loss</span>
              {isPositive ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
            </div>
            <div className={`text-3xl font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}${Math.abs(totalGainLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`text-sm mt-1 ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Holdings</span>
              <Zap className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {user?.portfolio?.length || 0}
            </div>
            <div className="text-sm text-gray-600 mt-1">Active positions</div>
          </motion.div>
        </div>

        {/* Holdings List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Your Holdings</h2>
          </div>

          {!user?.portfolio || user.portfolio.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Holdings Yet</h3>
              <p className="text-gray-600 mb-6">Start building your portfolio by making your first investment</p>
              <button 
                onClick={() => navigate('/trade')}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Start Investing
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
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
                    className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                          <Logo 
                            company={holding.company}
                            fallback={holding.ticker.charAt(0)}
                            size={40}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{holding.ticker}</h3>
                            <span className="text-sm text-gray-500">{holding.company}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span>{holding.quantity} shares</span>
                            <span>·</span>
                            <span>Avg ${holding.avgPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold text-gray-900 text-lg">
                          ${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          {isPositive ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
                          <span className={`text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                            {isPositive ? '+' : ''}${Math.abs(gainLoss).toFixed(2)} ({isPositive ? '+' : ''}{gainLossPercent.toFixed(2)}%)
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
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

        {/* Note about real data */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Real-Time Data</h4>
              <p className="text-sm text-blue-700">
                All portfolio values and stock prices are fetched in real-time from market data. Prices automatically refresh every 5 minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioPage
