import { Bell, Menu, LogOut, Settings, X, Moon, Sun, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useState, useEffect } from 'react'
import authService from '../services/authService'
import Sidebar from '../components/Sidebar'
import { StockSearch } from '../components/StockSearch'
import { SearchResult } from '../services/alphaVantageApi'
import { useRealTimeQuotes } from '../hooks/useRealTimeQuotes'
import InternationalStudentAlerts from '../components/InternationalStudentAlerts'
import TaxTreatyCalculator from '../components/TaxTreatyCalculator'
import F1ComplianceTracker from '../components/F1ComplianceTracker'
import Logo from '../components/Logo'
import TradingViewMiniWidget from '../components/TradingViewMiniWidget'
import ChatWidget from '../components/ChatWidget'

// Popular stocks to show (these are real tickers)
const POPULAR_STOCKS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'AMD']

const Dashboard = () => {
  const { user, isLoading } = useUser()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved === 'true'
  })
  
  // Get user's portfolio symbols
  const userSymbols = user?.portfolio?.map(p => p.ticker) || []
  
  // Get quotes for user's portfolio
  const { quotes: userQuotes, isLoading: isLoadingUser } = useRealTimeQuotes({
    symbols: userSymbols,
    refreshInterval: 60000,
    enabled: userSymbols.length > 0
  })

  // Get quotes for popular stocks
  const { quotes: popularQuotes, isLoading: isLoadingPopular } = useRealTimeQuotes({
    symbols: POPULAR_STOCKS,
    refreshInterval: 60000,
    enabled: true
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

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode])

  // Redirect if not logged in (but wait for loading to complete)
  useEffect(() => {
    if (!isLoading && !user) {
      console.log('⚠️ No user found, redirecting to landing page...')
      navigate('/')
    }
  }, [user, isLoading, navigate])

  // Show loading while user context is initializing
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your portfolio...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleStockSearch = (stock: SearchResult) => {
    navigate(`/stock/${stock.symbol}`)
  }

  return (
    <div className="h-screen bg-white dark:bg-black flex overflow-hidden transition-colors">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Left Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out fixed lg:static inset-y-0 left-0 z-50 lg:z-auto`}>
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header - Robinhood Style (minimal) */}
        <header className="bg-white dark:bg-black px-4 lg:px-6 py-4 flex-shrink-0 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-400"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <StockSearch
                  onStockSelect={handleStockSearch}
                  placeholder="Search"
                  className="w-48"
                />
              </div>
              
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white rounded-lg transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => setProfileOpen(true)}
                className="hover:opacity-80 transition-opacity"
              >
                {user?.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-800"
                  />
                ) : (
                  <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-semibold text-sm border border-gray-200 dark:border-gray-800">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content - Robinhood Minimal Style */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 lg:px-6 py-8">

            {/* Portfolio Value - Robinhood Style (large, bold, minimal) */}
            <div className="mb-8">
              <div className="text-4xl font-medium text-black dark:text-white mb-2">
                ${user?.totalValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </div>
              {portfolioChange !== 0 && (
                <div className={`flex items-center gap-2 text-sm font-medium ${portfolioChange >= 0 ? 'rh-green' : 'rh-red'}`}>
                  {portfolioChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{portfolioChange >= 0 ? '+' : ''}${Math.abs(portfolioChange).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span>({portfolioChange >= 0 ? '+' : ''}{portfolioChangePercent.toFixed(2)}%)</span>
                  <span className="text-gray-500 dark:text-gray-400 font-normal">Today</span>
                </div>
              )}
            </div>

            {/* Portfolio Chart - Minimal */}
            <div className="mb-8">
              <div className="bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                <TradingViewMiniWidget 
                  symbol={user?.portfolio?.[0]?.ticker || 'SPY'} 
                  height="300px"
                  theme={darkMode ? 'dark' : 'light'}
                />
              </div>
            </div>

            {/* User's Stocks - Robinhood Minimal List */}
            {user?.portfolio && user.portfolio.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Stocks</h2>
                <div className="space-y-1">
                  {user.portfolio.map((stock) => {
                    const quote = userQuotes?.find(q => q.symbol === stock.ticker)
                    const currentPrice = quote?.price || stock.currentPrice
                    const change = quote?.change || 0
                    const changePercent = quote?.changePercent || 0
                    const currentValue = stock.quantity * currentPrice
                    const totalGain = currentValue - (stock.quantity * stock.avgPrice)
                    const totalGainPercent = ((totalGain / (stock.quantity * stock.avgPrice)) * 100)

                    return (
                      <button
                        key={stock.ticker}
                        onClick={() => navigate(`/stock/${stock.ticker}`)}
                        className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900 rounded-none border-b border-gray-100 dark:border-gray-900 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-left flex-1">
                            <div className="font-semibold text-black dark:text-white">{stock.ticker}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {stock.quantity} {stock.quantity === 1 ? 'share' : 'shares'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-semibold text-black dark:text-white">
                            ${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className={`text-sm font-medium ${totalGain >= 0 ? 'rh-green' : 'rh-red'}`}>
                            {totalGain >= 0 ? '+' : ''}${Math.abs(totalGain).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            {' '}({totalGain >= 0 ? '+' : ''}{totalGainPercent.toFixed(2)}%)
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Popular Stocks - Robinhood Minimal Style */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-black dark:text-white">Popular</h2>
                <button 
                  onClick={() => navigate('/screener')}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white flex items-center gap-1"
                >
                  See All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              {isLoadingPopular ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Loading market data...
                </div>
              ) : (
                <div className="space-y-1">
                  {popularQuotes?.slice(0, 8).map((quote) => (
                    <button
                      key={quote.symbol}
                      onClick={() => navigate(`/stock/${quote.symbol}`)}
                      className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900 rounded-none border-b border-gray-100 dark:border-gray-900 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-left">
                          <div className="font-semibold text-black dark:text-white">{quote.symbol}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold text-black dark:text-white">
                          ${quote.price.toFixed(2)}
                        </div>
                        <div className={`text-sm font-medium ${quote.change >= 0 ? 'rh-green' : 'rh-red'}`}>
                          {quote.change >= 0 ? '+' : ''}${Math.abs(quote.change).toFixed(2)}
                          {' '}({quote.change >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%)
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* International Student Section */}
            {user?.visaStatus && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-black dark:text-white mb-4">International Student Tools</h2>
                <div className="space-y-4">
                  <InternationalStudentAlerts />
                  <F1ComplianceTracker />
                  <TaxTreatyCalculator />
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Profile Modal - Robinhood Style */}
      {profileOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setProfileOpen(false)}>
          <div className="bg-white dark:bg-black rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-black dark:text-white">Account</h2>
              <button 
                onClick={() => setProfileOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                {user?.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="w-20 h-20 rounded-full object-cover border border-gray-200 dark:border-gray-800"
                  />
                ) : (
                  <div className="w-20 h-20 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-bold text-2xl border border-gray-200 dark:border-gray-800">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-black dark:text-white">{user?.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                {user?.portfolio && user.portfolio.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Portfolio Value</div>
                    <div className="text-2xl font-bold text-black dark:text-white">
                      ${user.totalValue?.toLocaleString() || '0'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {user.portfolio.length} {user.portfolio.length === 1 ? 'stock' : 'stocks'}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button 
                  onClick={() => {
                    setProfileOpen(false)
                    navigate('/onboarding')
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors text-left"
                >
                  <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Settings</span>
                </button>
                
                <button 
                  onClick={async () => {
                    await authService.signOut()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Widget */}
      <ChatWidget />
    </div>
  )
}

export default Dashboard
