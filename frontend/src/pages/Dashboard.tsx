import { Bell, Menu, LogOut, Settings, X, Moon, Sun, TrendingUp, TrendingDown } from 'lucide-react'
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

const Dashboard = () => {
  const { user } = useUser()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved === 'true'
  })
  
  // Get symbols from user's actual portfolio
  const userSymbols = user?.portfolio?.map(p => p.ticker) || []
  const { quotes, isLoading: isLoadingQuotes } = useRealTimeQuotes({
    symbols: userSymbols,
    refreshInterval: 60000,
    enabled: userSymbols.length > 0
  })

  // Calculate portfolio total change
  const portfolioChange = user?.portfolio?.reduce((total, stock) => {
    const quote = quotes?.find(q => q.symbol === stock.ticker)
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

  if (!user) {
    navigate('/')
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
        {/* Header */}
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
              
              {/* Dark Mode Toggle */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors">
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
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 lg:px-6 py-8">

            {/* Portfolio Value - Robinhood Style */}
            <div className="mb-8">
              <div className="text-4xl font-medium text-gray-900 dark:text-white mb-2">
                ${user?.totalValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </div>
              <div className={`flex items-center gap-2 text-sm font-medium ${portfolioChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {portfolioChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{portfolioChange >= 0 ? '+' : ''}${Math.abs(portfolioChange).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span>({portfolioChange >= 0 ? '+' : ''}{portfolioChangePercent.toFixed(2)}%)</span>
                <span className="text-gray-500 dark:text-gray-400 font-normal">Today</span>
              </div>
            </div>

            {/* Portfolio Chart Placeholder */}
            <div className="mb-8 bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
              <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-600">
                {/* Chart will go here - add TradingView widget or custom chart */}
                <div className="text-center">
                  <div className="text-6xl mb-4">📈</div>
                  <div className="text-sm">Portfolio Performance Chart</div>
                  <div className="text-xs mt-1">(Connect real chart data)</div>
                </div>
              </div>
            </div>

            {/* Stocks List */}
            {user?.portfolio && user.portfolio.length > 0 ? (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Stocks</h2>
                <div className="space-y-1">
                  {user.portfolio.map((stock) => {
                    const quote = quotes?.find(q => q.symbol === stock.ticker)
                    const currentPrice = quote?.price || stock.currentPrice
                    const currentValue = stock.quantity * currentPrice
                    const totalGain = currentValue - (stock.quantity * stock.avgPrice)
                    const totalGainPercent = ((totalGain / (stock.quantity * stock.avgPrice)) * 100)

                    return (
                      <button
                        key={stock.ticker}
                        onClick={() => navigate(`/stock/${stock.ticker}`)}
                        className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl transition-colors group"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          {/* Company Logo */}
                          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                            <Logo 
                              company={stock.company}
                              fallback={stock.ticker.charAt(0)}
                              size={40}
                            />
                          </div>
                          
                          {/* Stock Info */}
                          <div className="text-left flex-1">
                            <div className="font-semibold text-gray-900 dark:text-white">{stock.company}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {stock.quantity} {stock.quantity === 1 ? 'share' : 'shares'}
                            </div>
                          </div>
                        </div>
                        
                        {/* Price & Gains */}
                        <div className="text-right">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            ${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className={`text-sm font-medium ${totalGain >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
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
              <div className="mb-8 text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Stocks Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Start building your portfolio</p>
                <button 
                  onClick={() => navigate('/trade')}
                  className="bg-emerald-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-600 transition-colors"
                >
                  Find Stocks
                </button>
              </div>
            )}

            {/* International Student Section */}
            {user?.visaStatus && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">For International Students</h2>
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

      {/* Profile Modal */}
      {profileOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setProfileOpen(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile</h2>
              <button 
                onClick={() => setProfileOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
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
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                {user?.goal && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Investment Goal</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{user.goal}</div>
                  </div>
                )}

                {user?.lifestyle && user.lifestyle.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Favorite Brands</div>
                    <div className="flex flex-wrap gap-2">
                      {user.lifestyle.map((brand) => (
                        <span key={brand} className="bg-white dark:bg-gray-700 px-3 py-1 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {user?.portfolio && user.portfolio.length > 0 && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Portfolio Value</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
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
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-left"
                >
                  <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Edit Profile</span>
                </button>
                
                <button 
                  onClick={async () => {
                    await authService.signOut()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
