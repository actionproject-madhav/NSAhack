import { Bell, Menu, LogOut, Settings, X, Moon, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useState, useEffect } from 'react'
import authService from '../services/authService'
import Sidebar from '../components/Sidebar'
import RobinhoodChart from '../components/RobinhoodChart'
import AIChatSidebar from '../components/AIChatSidebar'
import ReceiptScanner from '../components/ReceiptScanner'
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
  const { quotes, isLoading: isLoadingQuotes, error } = useRealTimeQuotes({
    symbols: userSymbols,
    refreshInterval: 60000, // 60 seconds to respect API limits
    enabled: userSymbols.length > 0
  })

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
    console.log('Selected stock:', stock)
    // Navigate to stock detail page
    navigate(`/stock/${stock.symbol}`)
  }

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 flex overflow-hidden transition-colors">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Left Sidebar - Fixed */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out fixed lg:static inset-y-0 left-0 z-50 lg:z-auto`}>
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header - Fixed */}
        <header className="bg-white dark:bg-gray-800 px-4 lg:px-6 py-6 flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl lg:text-2xl font-medium text-gray-900 dark:text-white">
                Hello {user?.name?.split(' ')[0] || 'there'},
              </h1>
            </div>
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="hidden md:block">
                <StockSearch
                  onStockSelect={handleStockSearch}
                  placeholder="Search stocks"
                  className="w-48 lg:w-64"
                />
              </div>
              
              {/* Dark Mode Toggle */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl transition-colors"
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setProfileOpen(true)}
                className="relative hover:ring-2 hover:ring-orange-400 rounded-2xl transition-all"
              >
                {user?.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="w-10 h-10 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-2xl flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-4 lg:px-6 min-w-0">

            {/* Portfolio Value - Robinhood Style */}
            <div className="pt-8 pb-6">
              <div className="text-3xl font-semibold text-gray-900 dark:text-white">
                ${user?.totalValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Portfolio Value
              </div>
            </div>

            {/* Portfolio Chart */}
            <div className="mb-8">
              <RobinhoodChart />
            </div>

            {/* Your Stocks */}
            {user?.portfolio && user.portfolio.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stocks</h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden">
                  {user.portfolio.map((stock) => {
                    const quote = quotes?.find(q => q.symbol === stock.ticker)
                    const currentPrice = quote?.price || stock.currentPrice
                    const change = quote?.change || 0
                    const changePercent = quote?.changePercent || 0
                    const currentValue = stock.quantity * currentPrice
                    const totalGain = currentValue - (stock.quantity * stock.avgPrice)
                    const totalGainPercent = ((currentValue - (stock.quantity * stock.avgPrice)) / (stock.quantity * stock.avgPrice)) * 100

                    return (
                      <button
                        key={stock.ticker}
                        onClick={() => navigate(`/stock/${stock.ticker}`)}
                        className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          {/* Company Logo */}
                          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                            <Logo 
                              company={stock.company}
                              fallback={stock.ticker.charAt(0)}
                              size={40}
                            />
                          </div>
                          
                          {/* Stock Info */}
                          <div className="text-left">
                            <div className="font-semibold text-gray-900 dark:text-white text-base">{stock.ticker}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{stock.quantity} {stock.quantity === 1 ? 'share' : 'shares'}</div>
                          </div>
                        </div>
                        
                        {/* Value & Gains */}
                        <div className="text-right">
                          <div className="font-semibold text-gray-900 dark:text-white text-base">
                            ${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className={`text-sm font-medium ${totalGain >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
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

            {/* F-1 Student Compliance Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">International Student Compliance</h2>
              <div className="space-y-4">
                <InternationalStudentAlerts />
                <F1ComplianceTracker />
                <TaxTreatyCalculator />
              </div>
            </div>

          </div>

          {/* AI Chat Sidebar - Fixed, Hidden on mobile, shown on desktop */}
          <div className="hidden xl:block flex-shrink-0">
            <AIChatSidebar />
          </div>
        </div>
      </div>

      {/* Receipt Scanner - Floating Action Button */}
      <ReceiptScanner />

      {/* Profile Modal */}
      {profileOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setProfileOpen(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Profile</h2>
              <button 
                onClick={() => setProfileOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-6">
              {/* User Avatar & Name */}
              <div className="flex items-center gap-4">
                {user?.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-pink-400 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
                  <p className="text-gray-600 text-sm">{user?.email}</p>
                </div>
              </div>

              {/* Profile Information */}
              <div className="space-y-4">
                {/* Investment Goal */}
                {user?.goal && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs font-medium text-gray-500 mb-1">Investment Goal</div>
                    <div className="text-sm font-semibold text-gray-900 capitalize">{user.goal}</div>
                  </div>
                )}

                {/* Lifestyle Brands */}
                {user?.lifestyle && user.lifestyle.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs font-medium text-gray-500 mb-2">Favorite Brands</div>
                    <div className="flex flex-wrap gap-2">
                      {user.lifestyle.map((brand) => (
                        <span key={brand} className="bg-white px-3 py-1 rounded-lg text-xs font-medium text-gray-700 border border-gray-200">
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Portfolio Summary */}
                {user?.portfolio && user.portfolio.length > 0 && (
                  <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-4">
                    <div className="text-xs font-medium text-gray-500 mb-1">Portfolio Value</div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${user.totalValue?.toLocaleString() || '0'}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {user.portfolio.length} {user.portfolio.length === 1 ? 'stock' : 'stocks'}
                    </div>
                  </div>
                )}

                {/* Language */}
                {user?.language && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Language</span>
                    <span className="font-medium text-gray-900 uppercase">{user.language}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => {
                    setProfileOpen(false)
                    navigate('/onboarding')
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Edit Profile</span>
                </button>
                
                <button 
                  onClick={async () => {
                    await authService.signOut()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-red-600">Sign Out</span>
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