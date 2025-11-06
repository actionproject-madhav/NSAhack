import { Moon, Sun, TrendingUp, TrendingDown, LogOut, Settings, X, Menu, Home, Briefcase, Wallet, BarChart3, BookOpen, Brain } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useState, useEffect } from 'react'
import authService from '../services/authService'
import { useRealTimeQuotes } from '../hooks/useRealTimeQuotes'
import TradingViewMiniWidget from '../components/TradingViewMiniWidget'

const Dashboard = () => {
  const { user, isLoading } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const [profileOpen, setProfileOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved === 'true'
  })

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Briefcase, label: 'Portfolio', path: '/portfolio' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: BarChart3, label: 'Trade', path: '/trade' },
    { icon: BookOpen, label: 'Learn', path: '/learn' },
    { icon: Brain, label: 'AI Hub', path: '/ai-hub' },
  ]
  
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

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode])

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
    <div className="min-h-screen bg-white dark:bg-black transition-colors flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Left Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out fixed lg:static inset-y-0 left-0 z-50 lg:z-auto w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
              <span className="text-white dark:text-black font-bold text-sm">F</span>
            </div>
            <span className="font-bold text-xl text-black dark:text-white">FinLit</span>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="px-3 py-4 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setProfileOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
          >
            {user?.picture ? (
              <img 
                src={user.picture} 
                alt={user.name} 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-semibold">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="flex-1 text-left">
              <div className="text-sm font-semibold text-black dark:text-white truncate">
                {user?.name || 'User'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                View Profile
              </div>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-black dark:bg-white text-white dark:text-black font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <button 
            onClick={async () => await authService.signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 bg-white dark:bg-black">
          <div className="px-4 h-16 flex items-center justify-between">
            {/* Mobile Menu Button (Left) */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg"
            >
              <Menu className="w-5 h-5 text-black dark:text-white" />
            </button>

            {/* Spacer - pushes everything to the edges */}
            <div className="flex-1" />

            {/* Right side - Profile and Dark Mode */}
            <div className="flex items-center gap-3 ml-auto">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-black" />}
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
                  <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-semibold text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
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
        </div>
      </div>

      {/* Profile Modal */}
      {profileOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setProfileOpen(false)}>
          <div className="bg-white dark:bg-black rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-black dark:text-white">Profile</h2>
              <button 
                onClick={() => setProfileOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4">
                {user?.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-bold text-2xl">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-black dark:text-white">{user?.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{user?.email}</p>
                </div>
              </div>

              {/* Portfolio Stats */}
              {user?.portfolio && user.portfolio.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Portfolio Value</div>
                  <div className="text-2xl font-bold text-black dark:text-white">
                    ${user.totalValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {user.portfolio.length} {user.portfolio.length === 1 ? 'position' : 'positions'}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button 
                  onClick={() => {
                    setProfileOpen(false)
                    navigate('/onboarding')
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors text-left"
                >
                  <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-black dark:text-white">Settings</span>
                </button>
                
                <button 
                  onClick={async () => {
                    await authService.signOut()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-5 h-5 text-red-600 dark:text-red-500" />
                  <span className="text-sm font-medium text-red-600 dark:text-red-500">Log Out</span>
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
