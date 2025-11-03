import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownLeft,
  Wallet,
  Plus
} from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'

const WalletPage = () => {
  const { user } = useUser()
  const navigate = useNavigate()

  const totalValue = user?.totalValue || 0
  const cashBalance = 10000 // Starting virtual cash for practice trading
  const availableCash = cashBalance - (totalValue || 0)
  const totalAssets = cashBalance

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Wallet</h1>
            <p className="text-gray-600">Manage your funds and track transactions</p>
          </div>
          
          <button 
            onClick={() => navigate('/trade')}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Invest Funds
          </button>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl shadow-lg text-white"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium opacity-90">Total Balance</span>
            </div>
            <div className="text-3xl font-bold mb-1">
              ${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm opacity-75">Available for trading</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <ArrowDownLeft className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Available Cash</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${availableCash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-gray-500">Ready to invest</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Invested</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-gray-500">In {user?.portfolio?.length || 0} positions</div>
          </motion.div>
        </div>

        {/* Portfolio Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Your Portfolio</h2>
          </div>
          
          {!user?.portfolio || user.portfolio.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Investments Yet</h3>
              <p className="text-gray-600 mb-6">You have ${availableCash.toFixed(2)} available to invest</p>
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
              {user.portfolio.map((stock) => {
                const currentValue = stock.quantity * stock.currentPrice
                const originalValue = stock.quantity * stock.avgPrice
                const gainLoss = currentValue - originalValue
                const isProfit = gainLoss >= 0

                return (
                  <div
                    key={stock.ticker}
                    onClick={() => navigate(`/stock/${stock.ticker}`)}
                    className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold">
                          {stock.ticker.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{stock.ticker}</h3>
                          <p className="text-sm text-gray-600">{stock.quantity} shares × ${stock.currentPrice.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          ${currentValue.toFixed(2)}
                        </div>
                        <div className={`text-sm ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
                          {isProfit ? '+' : ''}${gainLoss.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/trade')}
            className="p-6 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-emerald-200 transition-colors">
                <Plus className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Invest</h3>
              <p className="text-sm text-gray-600">Add to your portfolio</p>
            </div>
          </button>

          <button 
            onClick={() => navigate('/portfolio')}
            className="p-6 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Portfolio</h3>
              <p className="text-sm text-gray-600">View all holdings</p>
            </div>
          </button>

          <button 
            onClick={() => navigate('/learn')}
            className="p-6 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Learn</h3>
              <p className="text-sm text-gray-600">Investment courses</p>
            </div>
          </button>
        </div>

        {/* Info Banner */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-1">Real Portfolio Data</h4>
              <p className="text-sm text-blue-700">
                Your wallet shows your actual portfolio balance. All stock values are updated in real-time from market data. Start with ${cashBalance.toFixed(2)} virtual cash to practice investing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletPage
