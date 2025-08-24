import { Bell, ChevronRight, Menu, Globe, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { ModernStockCards } from '../components/ModernStockCards'
import RobinhoodChart from '../components/RobinhoodChart'
import AIChatSidebar from '../components/AIChatSidebar'
import ReceiptScanner from '../components/ReceiptScanner'
import EnhancedPortfolioCard from '../components/EnhancedPortfolioCard'
import Watchlist from '../components/Watchlist'
import SnapshotCard from '../components/SnapshotCard'
import { StockSearch } from '../components/StockSearch'
import { SearchResult } from '../services/alphaVantageApi'
import { useRealTimeQuotes } from '../hooks/useRealTimeQuotes'
import SectorPerformance from '../components/SectorPerformance'
import InternationalStudentAlerts from '../components/InternationalStudentAlerts'
import TaxTreatyCalculator from '../components/TaxTreatyCalculator'
import F1ComplianceTracker from '../components/F1ComplianceTracker'
import InvestmentRecommendations from '../components/InvestmentRecommendations'

const Dashboard = () => {
  const { user } = useUser()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const symbols = ['NVDA', 'META', 'TSLA', 'AAPL', 'AMD']
  const { quotes, isLoading: isLoadingQuotes, error } = useRealTimeQuotes({
    symbols,
    refreshInterval: 30000, // 30 seconds
    enabled: true
  })

  // Debug logging
  console.log('Dashboard quotes:', quotes)
  console.log('Dashboard isLoading:', isLoadingQuotes)
  console.log('Dashboard error:', error)

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
    <div className="h-screen bg-gray-100 flex overflow-hidden">
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
        <header className="bg-white px-4 lg:px-6 py-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl lg:text-2xl font-medium text-gray-900">Hello NSA Boston,</h1>
            </div>
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="hidden md:block">
                <StockSearch
                  onStockSelect={handleStockSearch}
                  placeholder="Search for stocks and more"
                  className="w-48 lg:w-80"
                />
              </div>
              <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-2xl transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-2xl"></div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 min-w-0">


            {/* Critical Trading Alerts for International Students */}
            <div className="mb-6">
              <InternationalStudentAlerts />
            </div>

            {/* My Stocks */}
            <div className="mb-6">
              <h2 className="text-lg font-jakarta font-medium text-gray-900 mb-4">My Stocks</h2>
              <ModernStockCards quotes={quotes} />
            </div>

            {/* Portfolio Analytics - Robinhood Style */}
            <div className="mb-6">
              <RobinhoodChart />
            </div>

            {/* First Row - Balance + Watchlist */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <EnhancedPortfolioCard />
              <Watchlist />

            </div>

            {/* Second Row - Snapshot + F-1 Compliance Tracker */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <SnapshotCard />
              <F1ComplianceTracker />
            </div>

            {/* Tax Treaty Calculator - Below Snapshot Row */}
            <div className="mb-6">
              <TaxTreatyCalculator />
            </div>

            {/* Investment Recommendations */}
            <div className="mb-6">
              <InvestmentRecommendations />
            </div>

            {/* Sector Performance */}
            <div className="mb-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-jakarta font-medium text-gray-900 mb-4">Sector Performance</h2>
                <SectorPerformance />
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
    </div>
  )
}

export default Dashboard