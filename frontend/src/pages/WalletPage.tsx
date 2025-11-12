import { Plus, Wallet as WalletIcon } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

const WalletPage = () => {
  const { user } = useUser()
  const navigate = useNavigate()

  const totalValue = user?.totalValue || 0

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

        {/* Portfolio Value Card */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg border border-gray-200 dark:border-gray-800">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Portfolio Value</span>
            <div className="text-5xl font-bold text-black dark:text-white mt-2">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {user?.portfolio?.length || 0} {user?.portfolio?.length === 1 ? 'position' : 'positions'}
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
                const currentValue = stock.quantity * stock.currentPrice
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
                          {stock.quantity} {stock.quantity === 1 ? 'share' : 'shares'} × ${stock.currentPrice.toFixed(2)}
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
