import { TrendingUp, TrendingDown, BarChart3, MessageCircle, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useTheme } from '../context/ThemeContext'
import { useEffect, useState, useMemo } from 'react'
import Layout from '../components/Layout'
import { useRealTimeQuotes } from '../hooks/useRealTimeQuotes'
import PortfolioChart from '../components/PortfolioChart'
import AIChatSidebar from '../components/AIChatSidebar'
import tradingService from '../services/tradingService'

const Dashboard = () => {
  const { user, isLoading } = useUser()
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const [showAIChat, setShowAIChat] = useState(false)
  const [cashBalance, setCashBalance] = useState<number | null>(null)
  const [totalAccountValue, setTotalAccountValue] = useState<number | null>(null)
  
  // Get user's portfolio symbols
  const userSymbols = user?.portfolio?.map(p => p.ticker) || []
  
  // Get quotes for user's portfolio
  const { quotes: userQuotes } = useRealTimeQuotes({
    symbols: userSymbols,
    refreshInterval: 60000,
    enabled: userSymbols.length > 0
  })

  // Load cash balance and total account value from database
  useEffect(() => {
    const loadAccountData = async () => {
      if (!user) return
      try {
        const userId = user.email || user.id
        if (!userId) return
        
        const portfolioData = await tradingService.getPortfolio(userId)
        setCashBalance(portfolioData.cash_balance || 0)
        setTotalAccountValue(portfolioData.total_account_value || (portfolioData.portfolio_value + portfolioData.cash_balance))
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error loading account data:', error)
        }
      }
    }
    
    loadAccountData()
  }, [user])

  // Memoize expensive portfolio calculations
  const { portfolioChange, portfolioChangePercent } = useMemo(() => {
    const change = user?.portfolio?.reduce((total, stock) => {
      const quote = userQuotes?.find(q => q.symbol === stock.ticker)
      const currentPrice = quote?.price || stock.currentPrice
      const currentValue = stock.quantity * currentPrice
      const originalValue = stock.quantity * stock.avgPrice
      return total + (currentValue - originalValue)
    }, 0) || 0

    const changePercent = user?.totalValue 
      ? ((change / (user.totalValue - change)) * 100) 
      : 0

    return { portfolioChange: change, portfolioChangePercent: changePercent }
  }, [user?.portfolio, user?.totalValue, userQuotes])

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/')
    }
  }, [user, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-transparent">
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
      <div className="flex h-full relative overflow-x-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-4xl mx-auto px-4 py-8 w-full">

            {/* Portfolio Value - Total Account Value (Portfolio + Cash) */}
            <div className="mb-8">
              <div className="text-5xl font-medium text-black dark:text-white mb-2">
                ${totalAccountValue !== null 
                  ? totalAccountValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : (user?.totalValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                }
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {cashBalance !== null && (
                  <span>Cash: ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                )}
                {user?.portfolio && user.portfolio.length > 0 && (
                  <span className="ml-4">
                    Portfolio: ${(user.totalValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                )}
              </div>
              {portfolioChange !== 0 && (
                <div className={`flex items-center gap-2 text-base font-medium ${portfolioChange >= 0 ? 'text-[#00C805]' : 'text-[#FF5000]'}`}>
                  {portfolioChange >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  <span>{portfolioChange >= 0 ? '+' : ''}${Math.abs(portfolioChange).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span>({portfolioChange >= 0 ? '+' : ''}{portfolioChangePercent.toFixed(2)}%)</span>
                  <span className="text-gray-500 dark:text-gray-400 font-normal">Today</span>
                </div>
              )}
            </div>

            {/* Portfolio Chart - Shows Total Account Value Over Time */}
            <div className="mb-8">
              <PortfolioChart height="400px" />
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
                    const totalGainPercent = stock.avgPrice > 0 ? ((totalGain / (stock.quantity * stock.avgPrice)) * 100) : 0
                    const isPositive = totalGain >= 0

                    return (
                      <button
                        key={stock.ticker}
                        onClick={() => navigate(`/stock/${stock.ticker}`)}
                        className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/30 dark:hover:bg-black/30 transition-colors rounded-lg backdrop-blur-sm"
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
                          {/* Robinhood-style colors: #00C805 for green, #FF5000 for red */}
                          <div className={`text-sm font-medium ${isPositive ? 'text-[#00C805]' : 'text-[#FF5000]'}`}>
                            {isPositive ? '+' : ''}${Math.abs(totalGain).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            {' '}({isPositive ? '+' : ''}{totalGainPercent.toFixed(2)}%)
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
        </div>

        {/* Floating AI Chat Button */}
        {!showAIChat && (
          <button
            onClick={() => setShowAIChat(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center z-50"
            aria-label="Open AI Assistant"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        )}

        {/* AI Chat Sidebar - Toggleable */}
        {showAIChat && (
          <div className="fixed right-0 top-0 h-full w-96 border-l border-black/10 dark:border-white/10 bg-white/90 dark:bg-black/90 backdrop-blur-lg shadow-2xl z-50 flex flex-col">
            {/* Close Button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold text-black dark:text-white">AI Assistant</h3>
              <button 
                onClick={() => setShowAIChat(false)}
                className="p-2 hover:bg-white/30 dark:hover:bg-black/30 rounded-lg transition-colors"
                aria-label="Close AI Assistant"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            {/* AI Chat Content */}
            <div className="flex-1 overflow-hidden">
              <AIChatSidebar />
          </div>
        </div>
      )}
    </div>
    </Layout>
  )
}

export default Dashboard
