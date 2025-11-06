import { motion } from 'framer-motion'
import { 
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
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Buying Power</h1>
          </div>
          
          <button 
            onClick={() => navigate('/trade')}
            className="px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Invest
          </button>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 transition-colors">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Balance</span>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              ${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 transition-colors">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Available Cash</span>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              ${availableCash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ready to invest</div>
          </div>

          <div className="bg-white dark:bg-black p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Invested</span>
            <div className="text-3xl font-bold text-black dark:text-white mt-2">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              In {user?.portfolio?.length || 0} positions
            </div>
          </div>
        </div>

        {/* Holdings Summary - Robinhood Minimal List */}
        <div className="bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold text-black dark:text-white">Holdings</h2>
          </div>
          
          {!user?.portfolio || user.portfolio.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Wallet className="w-16 h-16 mx-auto stroke-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">No Investments Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You have ${availableCash.toFixed(2)} available to invest
              </p>
              <button 
                onClick={() => navigate('/trade')}
                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Start Investing
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {user.portfolio.map((stock) => {
                const currentValue = stock.quantity * stock.currentPrice
                const originalValue = stock.quantity * stock.avgPrice
                const gainLoss = currentValue - originalValue
                const isProfit = gainLoss >= 0

                return (
                  <div
                    key={stock.ticker}
                    onClick={() => navigate(`/stock/${stock.ticker}`)}
                    className="px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-black dark:text-white text-lg">{stock.ticker}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {stock.quantity} shares × ${stock.currentPrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-black dark:text-white text-lg">
                          ${currentValue.toFixed(2)}
                        </div>
                        <div className={`text-sm mt-1 ${isProfit ? 'rh-green' : 'rh-red'}`}>
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
      </div>
    </div>
  )
}

export default WalletPage

